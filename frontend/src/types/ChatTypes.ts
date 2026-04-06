export type ChatRole = 'user' | 'agent'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
}

export type AssistantAnalysis = {
  message: string
  question: string
  currentIntent?: string
  conversationSummary?: string
  suggestedReply?: string
}


export type AssistResponse = {
  message: string
  question: string
  currentIntent: string
  conversationSummary: string
  suggestedReply: string
  matchedItems: []
  relatedCategories: string[]
}

export type RequestStatus = 'idle' | 'submitting' | 'error'

export type AgentAssistChatProps = {
  draft: string
  messages: ChatMessage[]
  onDraftChange: (value: string) => void
  onSubmit: () => void
  status: RequestStatus
}

export type AgentAssistDataDisplayProps = {
  onDraftChange: (value: string) => void
  analysis: AssistantAnalysis | null
  status: RequestStatus
}

export type ChatInputProps = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}
