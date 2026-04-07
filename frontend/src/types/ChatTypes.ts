export type ChatRole = 'user' | 'agent'
export type ComposerRole = 'tenant' | 'employee'

export type ChatMessage = {
  id: string
  role: ChatRole
  text: string
}

export type KnowledgeItem = {
  id: string
  category: string
  title: string
  content: string
  relatedCategories: string[]
}

export type MatchedKnowledgeItem = KnowledgeItem & {
  matchReason: string
}

export type ConversationMessage = {
  id?: string
  role: 'tenant' | 'employee'
  text: string
}

export type AssistantAnalysis = {
  message: string
  question: string
  currentIntent?: string
  conversationSummary?: string
  suggestedReply?: string
  matchedItems?: MatchedKnowledgeItem[]
  relatedItems?: KnowledgeItem[]
  relatedCategories?: string[]
}

export type AssistResponse = {
  message: string
  question: string
  currentIntent: string
  conversationSummary: string
  suggestedReply: string
  matchedItems: MatchedKnowledgeItem[]
  relatedItems: KnowledgeItem[]
  relatedCategories: string[]
  conversation: ConversationMessage[]
}

export type EmployeeMessageResponse = {
  message: string
  role: 'employee'
  conversation: ConversationMessage[]
}

export type ConversationResponse = {
  conversation: ConversationMessage[]
}

export type RequestStatus = 'idle' | 'submitting' | 'error'

export type AgentAssistChatProps = {
  draft: string
  nextSpeaker: ComposerRole
  messages: ChatMessage[]
  onDraftChange: (value: string) => void
  onNextSpeakerChange: (value: ComposerRole) => void
  onClearConversation: () => void
  onSubmit: () => void
  status: RequestStatus
}

export type AgentAssistDataDisplayProps = {
  onDraftChange: (value: string) => void
  analysis: AssistantAnalysis | null
  status: RequestStatus
}

export type ChatInputProps = {
  id: string
  placeholder: string
  submitLabel: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
}
