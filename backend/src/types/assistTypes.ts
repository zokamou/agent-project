export type ConversationRole = 'tenant' | 'employee'

export type ConversationMessage = {
  id?: string
  role: ConversationRole
  text: string
}

export type AssistRequest = {
  latestTenantMessage?: string
  conversation?: ConversationMessage[]
  question?: string
}

export type KnowledgeItem = {
  id: string
  category: string
  title: string
  content: string
  keywords: string[]
  relatedCategories: string[]
}

export type MatchedKnowledgeItem = KnowledgeItem & {
  matchReason: string
}

export type AgentAssistAnalysis = {
  currentIntent: string
  conversationSummary: string
  suggestedReply: string
  reasoning: string
}

export type AssistResponse = {
  question: string
  message: string
  currentIntent: string
  conversationSummary: string
  matchedItems: MatchedKnowledgeItem[]
  relatedCategories: string[]
  suggestedReply: string
}
