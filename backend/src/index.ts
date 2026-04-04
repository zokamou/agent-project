import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

app.post('/api/assist', (req, res) => {
  const { question } = req.body

  console.log('Incoming question:', question)

  res.json({
    message: 'Backend working!',
    question,
  })
})

const PORT = 3001

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})