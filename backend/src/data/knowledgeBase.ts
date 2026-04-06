import path from 'node:path'
import * as XLSX from 'xlsx'
import type { KnowledgeItem } from '../types/knowledgeBaseTypes'

let knowledgeItems: KnowledgeItem[] = []

type SpreadsheetRow = {
  worksheet?: string
  variable?: string
  value?: string
  status?: string
  optional?: string
}

const workbookPath = path.join(
  __dirname,
  'Storage King USA - swivl Property Manager Export.xlsx'
)

export const loadKnowledgeBase = async (): Promise<void> => {
  const workbook = XLSX.readFile(workbookPath)
  const firstSheetName = workbook.SheetNames[0]

  if (!firstSheetName) {
    throw new Error('No sheets found in the knowledge base workbook.')
  }

  const worksheet = workbook.Sheets[firstSheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    range: 2,
    defval: '',
  })

  const normalizedRows = rows.map((row) => {
    const normalizedEntries = Object.entries(row).map(([key, value]) => [
      key.trim().toLowerCase(),
      value,
    ])

    return Object.fromEntries(normalizedEntries) as SpreadsheetRow
  })

  knowledgeItems = normalizedRows
    .map((row, index) => {
      if (!row.worksheet || !row.variable || !row.value) {
        return null
      }

      const searchableText = [
        row.worksheet ?? '',
        row.variable ?? '',
        row.value ?? '',
        row.status ?? '',
        row.optional ?? '',
      ]
        .join(' ')
        .toLowerCase()
        .trim()

      return {
        id: `${row.worksheet}-${row.variable}-${index}`,
        worksheet: row.worksheet,
        category: row.worksheet,
        variableName: row.variable,
        content: row.value,
        status: row.status ?? '',
        optional: row.optional ?? '',
        searchableText: searchableText,
      }
    })
    .filter((item): item is KnowledgeItem => item !== null)
}

export const getKnowledgeItems = (): KnowledgeItem[] => {
  if (knowledgeItems.length === 0) {
    throw new Error('Knowledge base has not been loaded yet.')
  }

  return knowledgeItems
}
