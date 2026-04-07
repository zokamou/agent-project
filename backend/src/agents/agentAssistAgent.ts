import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { openAiClient, openAiModel } from '../clients/openAiClient'
import type {
  AgentAssistAnalysis,
} from '../types/assistTypes'
import { KnowledgeItem } from '../types/knowledgeBaseTypes'
import { getConversationMessages } from '../services/assistService'


const promptPath = path.join(
  __dirname,
  '..',
  'prompts',
  'userMessageAnalysis.md'
)

export const generateAssistAnalysis = async (
  latestTenantMessage: string,
  matchedKnowledgeItems: KnowledgeItem[],
  relatedKnowledgeItems: KnowledgeItem[]
): Promise<AgentAssistAnalysis> => {
  const promptTemplate = await readFile(promptPath, 'utf-8')

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const knowledgeContext = `

    Conversation History: 
    ${getConversationMessages()
      .map((message) => `${message.role}: ${message.text}`)
      .join('\n')}

    Tenant message:
    ${latestTenantMessage}

    Directly relevant policies:
    ${matchedKnowledgeItems
      .map(
        (item) => `- Category: ${item.category}
      Title: ${item.title}
      Content: ${item.content}`
      )
      .join('\n\n')}

    Related policies:
    ${relatedKnowledgeItems
      .map(
        (item) => `- Category: ${item.category}
      Title: ${item.title}
      Content: ${item.content}`
      )
      .join('\n\n')}
    `

  // wait for open ai repsonse
  const response = await openAiClient.responses.create({
    model: openAiModel,
    input: [
      {
        role: 'system',
        content: promptTemplate,
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
            currentIntent: {
              type: 'string',
            },
            conversationSummary: {
              type: 'string',
            },
            suggestedReply: {
              type: 'string',
            },
            reasoning: {
              type: 'string',
            },
          },
          required: [
            'currentIntent',
            'conversationSummary',
            'suggestedReply',
            'reasoning',
          ],
        },
      },
    },
  })

  return JSON.parse(response.output_text) as AgentAssistAnalysis
}
