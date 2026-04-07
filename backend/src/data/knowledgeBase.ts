import path from 'node:path'
import * as XLSX from 'xlsx'
import type { KnowledgeItem } from '../types/knowledgeBaseTypes'
import { index } from './pineconeClient'

let knowledgeItems: KnowledgeItem[] = []

type SpreadsheetRow = {
  worksheet?: string
  variable?: string
  value?: string
}

const workbookPath = path.join(
  __dirname,
  'Storage King USA - swivl Property Manager Export.xlsx'
)

export const syncToPinecone = async (items: KnowledgeItem[]) => {
  const BATCH_SIZE = 50

  const validItems = items.filter(
    (item) => item.content && item.content.trim().length > 0
  )

  const records = validItems.map((item) => ({
    _id: item.id,
    text: item.content,
    category: item.category,
    title: item.title,
  }))

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE)
    await index.upsertRecords({ records: batch })
  }

  console.log(`Successfully synced ${records.length} items to Pinecone.`)
}

export const loadKnowledgeBase = async (): Promise<void> => {
  const workbook = XLSX.readFile(workbookPath)
  const firstSheetName = workbook.SheetNames[0]

  if (!firstSheetName) {
    throw new Error('No sheets found in the knowledge base workbook.')
  }

  const worksheet = workbook.Sheets[firstSheetName]
  const rows = XLSX.utils.sheet_to_json<SpreadsheetRow>(worksheet, {
    range: 2,
    defval: '',
  })

  const loadedKnowledgeItems: KnowledgeItem[] = []

  for (const [index, rawRow] of rows.entries()) {
    const worksheetName = rawRow.worksheet?.trim() ?? ''
    const title = rawRow.variable?.trim() ?? ''
    const content = rawRow.value?.trim() ?? ''

    if (!worksheetName || !title || !content) {
      continue
    }

    loadedKnowledgeItems.push({
      id: `${worksheetName}-${title}-${index}`,
      category: worksheetName,
      title,
      content,
    })
  }

  knowledgeItems = loadedKnowledgeItems
}

export const getKnowledgeItems = (): KnowledgeItem[] => {
  if (knowledgeItems.length === 0) {
    throw new Error('Knowledge base has not been loaded yet.')
  }

  return knowledgeItems
}
