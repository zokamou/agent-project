import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { openAiClient, openAiModel } from '../clients/openAiClient'
import type { AgentAssistAnalysis, ChannelType } from '../types/assistTypes'
import type { KnowledgeItem } from '../types/knowledgeBaseTypes'
import { getConversationMessages } from '../services/assistService'

const promptCache: Record<string, string> = {}

const loadPrompt = async (fileName: string): Promise<string> => {
  if (promptCache[fileName]) {
    return promptCache[fileName]
  }

  const filePath = path.join(__dirname, '..', 'prompts', fileName)
  const content = await readFile(filePath, 'utf-8')
  promptCache[fileName] = content

  return content
}

export const generateAssistAnalysis = async (
  latestTenantMessage: string,
  matchedKnowledgeItems: KnowledgeItem[],
  relatedKnowledgeItems: KnowledgeItem[],
  channel: ChannelType = 'chat'
): Promise<AgentAssistAnalysis> => {
  const [identity, guardrails, style] = await Promise.all([
    loadPrompt('userMessageAnalysis.md'),
    loadPrompt('guardrails.md'),
    loadPrompt(`${channel}.md`),
  ])

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  // only grabbing last 5 messages to keep context short and snappy
  const recentHistory = getConversationMessages().slice(-5)
  const itemsToProcess = matchedKnowledgeItems.slice(0, 3)
  const relatedToProcess = relatedKnowledgeItems.slice(0, 3)


  // dynamic systen prompt
  // this often doesnt change, open ai recongnized this and loads existing prompts from cache
  const systemPrompt = `
    ${identity}
    ${guardrails}
    ${style}
  `

  // context window builder for dynamic prompt construction
  // only feeding llm relevant knowledge so it doesnt have to parse through every data point
  const knowledgeContext = `
    Directly relevant policies:
    ${itemsToProcess
      .map(
        (item) => `- Category: ${item.category}
      Title: ${item.title}
      Content: ${item.content}`
      )
      .join('\n\n')}

    Related policies:
    ${relatedToProcess
      .map(
        (item) => `- Category: ${item.category}
      Title: ${item.title}
      Content: ${item.content}`
      )
      .join('\n\n')}

          Conversation History: 
    ${recentHistory
      .map((message) => `${message.role}: ${message.text}`)
      .join('\n')}

    Tenant message:
    ${latestTenantMessage}
    `

  // using 4o mini open ai model
  // structured output with json schema to make output predictable and easy to parse
  const response = await openAiClient.responses.create({
    model: openAiModel,
    max_output_tokens: 200,
    input: [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: knowledgeContext,
      },
    ],
    text: {
      format: {
        type: 'json_schema',
        name: 'agent_assist_analysis',
        strict: true,
        schema: {
          type: 'object',
          additionalProperties: false,
          properties: {
            suggestedReply: {
              type: 'string',
            },
            sourcesUsed: {
              type: 'string',
            },
          },
          required: ['suggestedReply', 'sourcesUsed'],
        },
      },
    },
  })

  return JSON.parse(response.output_text) as AgentAssistAnalysis
}
