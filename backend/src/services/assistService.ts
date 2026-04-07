import type {
  AssistRequest,
  AssistResponse,
  ConversationMessage,
  ConversationResponse,
  EmployeeMessageRequest,
  EmployeeMessageResponse,
  PineconeMetadata,
} from '../types/assistTypes'
import { KnowledgeItem } from '../types/knowledgeBaseTypes'
import {
  generateAssistAnalysis,
} from '../agents/agentAssistAgent'
import { index } from '../data/pineconeClient'
import { Hit } from '@pinecone-database/pinecone'

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

  const latestTenantMessage = request.latestTenantMessage ?? request.question ?? ''

  addConversationMessage('tenant', latestTenantMessage)

  const primaryTopicSearch = await index.searchRecords({
    query: {
      inputs: {
        text: latestTenantMessage,
      },
      topK: 5,
    },
  })

  if (primaryTopicSearch.result.hits.length === 0) {
    return {question: latestTenantMessage,
      message: 'No relevant information found.',
      currentIntent: '',
      conversationSummary: '',
      matchedItems: [],
      relatedItems: [],
      relatedCategories: [],
      suggestedReply: '',
      conversation: getConversationMessages()
    };
  }

  const topHit = primaryTopicSearch.result.hits[0];
  const topFields = topHit.fields as PineconeMetadata;
  const primaryCategory = topFields.category;

  const relatedSearch = await index.searchRecords({
    query: {
      inputs: { text: `Policies and procedures related to ${primaryCategory}` },
      filter: { 
        category: { $ne: primaryCategory }},
      topK: 4
    }
  });

  const matchedKnowledgeItems = [mapHitToItem(topHit)];
  const matchedRelatedKnowledgeItems = relatedSearch.result.hits.map(hit => mapHitToItem(hit));


  const analysis = await generateAssistAnalysis(latestTenantMessage, matchedKnowledgeItems, matchedRelatedKnowledgeItems);

return {
    question: latestTenantMessage,
    message: analysis.suggestedReply,
    currentIntent: analysis.currentIntent,
    conversationSummary: analysis.conversationSummary,
    suggestedReply: analysis.suggestedReply,
    matchedItems: matchedKnowledgeItems.map((item) => ({
      ...item,
      matchReason: 'Directly relevant based on semantic match',
    })),
    relatedItems: matchedRelatedKnowledgeItems.map((item) => ({
      ...item,
      matchReason: `Proactively identified as related to ${primaryCategory}`,
    })),
    relatedCategories: matchedRelatedKnowledgeItems.map(i => i.category),
    conversation: getConversationMessages(),
  }
}

export const createEmployeeMessage = async (
  request: EmployeeMessageRequest
): Promise<EmployeeMessageResponse> => {
  const employeeMessage = request.message.trim()

  addConversationMessage('employee', employeeMessage)

  return {
    message: employeeMessage,
    role: 'employee',
    conversation: getConversationMessages(),
  }
}


const mapHitToItem = (hit: Hit): KnowledgeItem => {
  const fields = hit.fields as PineconeMetadata;
  return {
    id: hit._id,
    category: fields.category,
    title: fields.title,
    content: fields.text,
    relatedCategories: fields.relatedCategories || [],
  };
};
