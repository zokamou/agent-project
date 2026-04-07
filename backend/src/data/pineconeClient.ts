import { Pinecone } from '@pinecone-database/pinecone'

const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

export const index = pc.index({
  name: 'agent-assist',
})

export default pc
