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


// in memory store for conversatoin messages
// in production these would be stored in a db with a conversation id
const conversationMessages: ConversationMessage[] = []

export const getAssistResponse = async (
  request: AssistRequest
): Promise<AssistResponse> => {

  console.time('Total assist generation time')

  const latestTenantMessage = request.latestTenantMessage
  const channel: ChannelType = request.channel ?? 'chat'

  addConversationMessage('tenant', latestTenantMessage)

  console.time('Pinecone search time')
  // first pinecone search to find directly relevant knowledge base items
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

  // second pinecone search to find related items based on categories and titles
  // we exclude certain categories that are less likely to be helpful for assist generation
  // after testing, i found that "Auctions", "Live In Unit", and "Legal" were returned often, but irrelevant
  const relatedResult = await index.searchRecords({
    query: {
      inputs: { text: expansionTerms.join(' ') },
      topK: 6,
      filter: { 
        category: { $nin: [...primaryCategories, "Auctions", "Live In Unit", "Legal"] },
      }
    },
  })

  // take the top 3 related items that are not already in the primary results
  const matchedRelatedKnowledgeItems = relatedResult.result.hits
    .map(mapHitToItem)
    .filter((item) => !primaryIds.has(item.id))
    .slice(0, 3)

  console.timeEnd('Pinecone search time')

  console.time('LLM response generation time')
  // generate assist analysis based on the tenant message and the retrieved knowledge items
  // will return suggested reply and what sources were used
  const analysis = await generateAssistAnalysis(
    latestTenantMessage,
    matchedKnowledgeItems,
    matchedRelatedKnowledgeItems,
    channel
  )
  console.timeEnd('LLM response generation time')
  
  console.timeEnd('Total assist generation time')

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


// "dummy" message to add employee messages to conversation
// we arent analyzing employee messages, but they are being added to the context
export const createEmployeeMessage = async (
  request: EmployeeMessageRequest
): Promise<EmployeeMessageResponse> => {
  const employeeMessage = request.message.trim()

  addConversationMessage('employee', employeeMessage)

  return {
    conversation: getConversationMessages(),
  }
}

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


const mapHitToItem = (hit: Hit): KnowledgeItem => {
  const fields = hit.fields as PineconeMetadata

  return {
    id: hit._id,
    category: fields.category,
    title: fields.title,
    content: fields.text,
  }
}
