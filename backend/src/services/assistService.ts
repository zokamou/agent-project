import type { AssistRequest, AssistResponse } from '../types/assistTypes'
import { generateAssistAnalysis } from '../agents/agentAssistAgent'

export const getAssistResponse = async (
  request: AssistRequest
): Promise<AssistResponse> => {
  const latestTenantMessage =
    request.latestTenantMessage ?? request.question ?? ''
  const analysis = await generateAssistAnalysis(latestTenantMessage)

  const response: AssistResponse = {
    question: latestTenantMessage,
    message: analysis.suggestedReply,
    currentIntent: analysis.currentIntent,
    conversationSummary: analysis.conversationSummary,
    suggestedReply: analysis.suggestedReply,
    matchedItems: [],
    relatedCategories: [],
  }

  return response
}
