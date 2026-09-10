/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react'
import MessageBubble from './MessageBubble'

// Render messages and keep the newest content visible as the chat grows.
function ChatWindow({ messages, isLoading, error }) {
  const messageListRef = useRef(null)

  useEffect(() => {
    const messageList = messageListRef.current
    if (messageList) {
      messageList.scrollTop = messageList.scrollHeight
    }
  }, [messages, isLoading, error])

  return (
    <div className="chat-window" ref={messageListRef} aria-live="polite">
      <div className="conversation-intro">Today · General health information</div>
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}

      {isLoading && (
        <div className="message-row assistant-row">
          <div className="message-bubble assistant-bubble typing-bubble" aria-label="Assistant is typing">
            <span />
            <span />
            <span />
          </div>
        </div>
      )}

      {error && <div className="inline-error" role="alert">{error}</div>}
    </div>
  )
}

export default ChatWindow