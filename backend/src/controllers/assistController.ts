import type { Request, Response } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import type { ParsedQs } from 'qs'
import { getAssistResponse } from '../services/assistService'
import type { AssistRequest, AssistResponse } from '../types/assistTypes'

type AssistRequestParams = ParamsDictionary
type AssistRequestQuery = ParsedQs
type AssistRequestHttp = Request<
  AssistRequestParams,
  AssistResponse,
  AssistRequest,
  AssistRequestQuery
>
type AssistResponseHttp = Response<AssistResponse>

export const handleAssistRequest = async (
  req: AssistRequestHttp,
  res: AssistResponseHttp
) => {
  const assistRequest = req.body
  const latestTenantMessage =
    assistRequest.latestTenantMessage ?? assistRequest.question ?? ''

  if (!latestTenantMessage) {
    res.status(400).json({
      message: 'A tenant message is required.',
      question: '',
      currentIntent: '',
      conversationSummary: '',
      matchedItems: [],
      relatedCategories: [],
      suggestedReply: '',
    })
    return
  }

  try {
    const result = await getAssistResponse(assistRequest)
    res.status(200).json(result)
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Unable to analyze the tenant message right now.'

    console.error('Assist request failed:', error)

    res.status(500).json({
      message: errorMessage,
      question: latestTenantMessage,
      currentIntent: '',
      conversationSummary: '',
      matchedItems: [],
      relatedCategories: [],
      suggestedReply: '',
    })
  }
}
