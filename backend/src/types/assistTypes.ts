import { KnowledgeItem } from "./knowledgeBaseTypes"

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

export type EmployeeMessageRequest = {
  message: string
  conversation?: ConversationMessage[]
}

export type MatchedKnowledgeItem = KnowledgeItem & {
  matchReason: string
}

export interface PineconeMetadata {
  category: string;
  title: string;
  text: string; 
  relatedCategories: string[];
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
  relatedItems: KnowledgeItem[]
  relatedCategories: string[]
  suggestedReply: string
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
