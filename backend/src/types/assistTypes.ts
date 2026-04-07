import type { KnowledgeItem } from './knowledgeBaseTypes'

export type ConversationRole = 'tenant' | 'employee'
export type ChannelType = 'chat' | 'email' | 'phone'

export type ConversationMessage = {
  id?: string
  role: ConversationRole
  text: string
}

export type AssistRequest = {
  latestTenantMessage: string
  channel?: ChannelType
}

export type EmployeeMessageRequest = {
  message: string
}

export interface PineconeMetadata {
  category: string
  title: string
  text: string
}

export type AgentAssistAnalysis = {
  suggestedReply: string
  sourcesUsed: string
}

export type AssistResponse = {
  matchedItems: KnowledgeItem[]
  relatedItems: KnowledgeItem[]
  relatedCategories: string[]
  suggestedReply: string
  usedSources: string
  conversation: ConversationMessage[]
}

export type EmployeeMessageResponse = {
  conversation: ConversationMessage[]
}

export type ConversationResponse = {
  conversation: ConversationMessage[]
}
