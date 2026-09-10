import { useRef, useState } from 'react'
import ChatWindow from './components/ChatWindow'
import ChatInput from './components/ChatInput'
import DisclaimerBanner from './components/DisclaimerBanner'
import './App.css'

// Keep the welcome message in one place so it can be reused when a chat is reset.
const initialMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi, I'm your AI Health Assistant. I can share general health information, but I am not a licensed doctor. I do not replace professional medical advice. If you have serious or life-threatening symptoms, seek emergency care right away. What symptoms would you like to describe?",
}

function App() {
  // Conversation history is intentionally kept only in React state.
  const [messages, setMessages] = useState([initialMessage])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const requestController = useRef(null)

  // Send the complete conversation to the API and append its reply.
  async function handleSend(content) {
    const userMessage = { id: crypto.randomUUID(), role: 'user', content }
    const conversation = [...messages, userMessage]

    setMessages(conversation)
    setError('')
    setIsLoading(true)

    requestController.current?.abort()
    requestController.current = new AbortController()

    try {
      const apiUrl = import.meta.env.VITE_API_URL || ''
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: conversation.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
        signal: requestController.current.signal,
      })

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
      }

      const data = await response.json()
      const assistantContent = data.reply || data.message || data.content

      if (typeof assistantContent !== 'string' || !assistantContent.trim()) {
        throw new Error('The API returned an empty response')
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { id: crypto.randomUUID(), role: 'assistant', content: assistantContent },
      ])
    } catch (requestError) {
      // Ignore an intentional cancellation when starting a new conversation.
      if (requestError.name !== 'AbortError') {
        setError('We could not reach the health assistant. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Cancel an in-flight request and return to the original welcome state.
  function handleNewConversation() {
    requestController.current?.abort()
    setMessages([initialMessage])
    setError('')
    setIsLoading(false)
  }

  return (
    <main className="app-shell">
      <section className="chat-card" aria-label="AI Health Assistant chat">
        <header className="chat-header">
          <div className="brand-mark" aria-hidden="true">+</div>
          <div>
            <p className="eyebrow">Personal health companion</p>
            <h1>AI Health Assistant</h1>
          </div>
          <button className="new-conversation-button" type="button" onClick={handleNewConversation}>
            New conversation
          </button>
        </header>

        <ChatWindow messages={messages} isLoading={isLoading} error={error} />
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </section>

      <DisclaimerBanner />
    </main>
  )
}

export default App
