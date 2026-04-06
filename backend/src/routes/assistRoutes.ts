import { Router } from 'express'
import { handleAssistRequest } from '../controllers/assistController'

export const assistRouter = Router()

assistRouter.post('/assist', handleAssistRequest)
assistRouter.post('/receive-user-message', handleAssistRequest)
