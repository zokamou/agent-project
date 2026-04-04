import { Routes, Route } from 'react-router-dom'
import { AgentAssistPage } from './pages/AgentAssistPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<AgentAssistPage />} />
    </Routes>
  )
}

export default App