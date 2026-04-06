import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { openAiClient, openAiModel } from '../clients/openAiClient'
import type { AgentAssistAnalysis } from '../types/assistTypes'

const promptPath = path.join(
  __dirname,
  '..',
  'prompts',
  'userMessageAnalysis.md'
)

export const generateAssistAnalysis = async (
  latestTenantMessage: string
): Promise<AgentAssistAnalysis> => {
  const promptTemplate = await readFile(promptPath, 'utf-8')

  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured')
  }

  const response = await openAiClient.responses.create({
    model: openAiModel,
    input: [
      {
        role: 'system',
        content: promptTemplate,
      },
      {
        role: 'user',
        content: `Tenant message: ${latestTenantMessage}`,
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

  const parsedAnalysis = JSON.parse(response.output_text) as AgentAssistAnalysis

  return parsedAnalysis
}
