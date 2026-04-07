import { Router } from 'express'
import {
  handleClearConversationRequest,
  handleEmployeeMessageRequest,
  handleGetConversationRequest,
  handleTenantMessageRequest,
} from '../controllers/assistController'

export const assistRouter = Router()

assistRouter.post('/tenant-message', handleTenantMessageRequest)
assistRouter.post('/employee-message', handleEmployeeMessageRequest)
assistRouter.get('/messages', handleGetConversationRequest)
assistRouter.post('/clear-messages', handleClearConversationRequest)
