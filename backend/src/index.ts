import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { assistRouter } from './routes/assistRoutes'
import { loadKnowledgeBase } from './data/knowledgeBase'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', assistRouter)

loadKnowledgeBase()

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
