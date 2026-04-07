import type {
  AssistRequest,
  AssistResponse,
  ConversationMessage,
  ConversationResponse,
  EmployeeMessageRequest,
  EmployeeMessageResponse,
  ChannelType,
  PineconeMetadata,
} from '../types/assistTypes'
import type { KnowledgeItem } from '../types/knowledgeBaseTypes'
import { generateAssistAnalysis } from '../agents/agentAssistAgent'
import { index } from '../data/pineconeClient'
import type { Hit } from '@pinecone-database/pinecone'

const conversationMessages: ConversationMessage[] = []

const addConversationMessage = (
  role: ConversationMessage['role'],
  text: string
): void => {
  conversationMessages.push({
    id: crypto.randomUUID(),
    role,
    text,
  })
}

export const getConversationMessages = (): ConversationMessage[] => {
  return [...conversationMessages]
}

export const getConversationResponse = (): ConversationResponse => {
  return {
    conversation: getConversationMessages(),
  }
}

export const clearConversationMessages = (): ConversationResponse => {
  conversationMessages.length = 0

  return {
    conversation: [],
  }
}

export const getAssistResponse = async (
  request: AssistRequest
): Promise<AssistResponse> => {
  const latestTenantMessage = request.latestTenantMessage
  const channel: ChannelType = request.channel ?? 'chat'

  addConversationMessage('tenant', latestTenantMessage)

  const primaryResult = await index.searchRecords({
    query: { inputs: { text: latestTenantMessage }, topK: 3 },
  })

  if (primaryResult.result.hits.length === 0) {
    return {
      usedSources: '',
      matchedItems: [],
      relatedItems: [],
      relatedCategories: [],
      suggestedReply: '',
      conversation: getConversationMessages(),
    }
  }

  const matchedKnowledgeItems = primaryResult.result.hits.map((hit) =>
    mapHitToItem(hit)
  )
  const primaryIds = new Set(matchedKnowledgeItems.map((item) => item.id))

  const primaryCategories = matchedKnowledgeItems.map((item) => item.category)
  const primaryTitles = matchedKnowledgeItems.map((item) => item.title)
  const expansionTerms = [...new Set([
    ...primaryCategories,
    ...primaryTitles,
  ])]

  const relatedResult = await index.searchRecords({
    query: {
      inputs: { text: expansionTerms.join(' ') },
      topK: 6,
      filter: { 
        category: { $nin: [...primaryCategories, "Auctions", "Live In Unit", "Legal"] },
      }
    },
  })
  const matchedRelatedKnowledgeItems = relatedResult.result.hits
    .map(mapHitToItem)
    .filter((item) => !primaryIds.has(item.id))
    .slice(0, 3)

  const analysis = await generateAssistAnalysis(
    latestTenantMessage,
    matchedKnowledgeItems,
    matchedRelatedKnowledgeItems,
    channel
  )

  return {
    suggestedReply: analysis.suggestedReply,
    usedSources: analysis.sourcesUsed,
    matchedItems: matchedKnowledgeItems,
    relatedItems: matchedRelatedKnowledgeItems,
    relatedCategories: matchedRelatedKnowledgeItems.map(
      (item) => item.category
    ),
    conversation: getConversationMessages(),
  }
}

export const createEmployeeMessage = async (
  request: EmployeeMessageRequest
): Promise<EmployeeMessageResponse> => {
  const employeeMessage = request.message.trim()

  addConversationMessage('employee', employeeMessage)

  return {
    conversation: getConversationMessages(),
  }
}

const mapHitToItem = (hit: Hit): KnowledgeItem => {
  const fields = hit.fields as PineconeMetadata

  return {
    id: hit._id,
    category: fields.category,
    title: fields.title,
    content: fields.text,
  }
}
