import type { Request, Response } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import type { ParsedQs } from 'qs'
import {
  clearConversationMessages,
  createEmployeeMessage,
  getConversationResponse,
  getAssistResponse,
} from '../services/assistService'
import type {
  AssistRequest,
  AssistResponse,
  ConversationResponse,
  EmployeeMessageRequest,
  EmployeeMessageResponse,
} from '../types/assistTypes'

type AssistRequestParams = ParamsDictionary
type AssistRequestQuery = ParsedQs
type AssistRequestHttp = Request<
  AssistRequestParams,
  AssistResponse,
  AssistRequest,
  AssistRequestQuery
>
type AssistResponseHttp = Response<AssistResponse>
type EmployeeMessageRequestHttp = Request<
  AssistRequestParams,
  EmployeeMessageResponse,
  EmployeeMessageRequest,
  AssistRequestQuery
>
type EmployeeMessageResponseHttp = Response<EmployeeMessageResponse>
type ConversationResponseHttp = Response<ConversationResponse>

export const handleTenantMessageRequest = async (
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
      relatedItems: [],
      relatedCategories: [],
      suggestedReply: '',
      conversation: [],
    })
    return
  }

  try {
    const result = await getAssistResponse(assistRequest)
    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred.',
      question: latestTenantMessage,
      currentIntent: '',
      conversationSummary: '',
      matchedItems: [],
      relatedItems: [],
      relatedCategories: [],
      suggestedReply: '',
      conversation: [],
    })
  }
}

export const handleEmployeeMessageRequest = async (
  req: EmployeeMessageRequestHttp,
  res: EmployeeMessageResponseHttp
) => {
  const employeeMessage = req.body.message?.trim() ?? ''

  if (!employeeMessage) {
    res.status(400).json({
      message: 'An employee message is required.',
      role: 'employee',
      conversation: [],
    })
    return
  }

  try {
    const result = await createEmployeeMessage({
      message: employeeMessage,
      conversation: req.body.conversation,
    })

    res.status(200).json(result)
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred.',
      role: 'employee',
      conversation: [],
    })
  }
}

export const handleGetConversationRequest = (
  _req: Request,
  res: ConversationResponseHttp
) => {
  const result = getConversationResponse()
  res.status(200).json(result)
}

export const handleClearConversationRequest = (
  _req: Request,
  res: ConversationResponseHttp
) => {
  const result = clearConversationMessages()
  res.status(200).json(result)
}
