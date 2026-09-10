/* eslint-disable react/prop-types */
// Display a single message with alignment and colors based on its sender.
function MessageBubble({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`message-row ${isUser ? 'user-row' : 'assistant-row'}`}>
      <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'}`}>
        <span className="message-label">{isUser ? 'You' : 'Assistant'}</span>
        <p>{message.content}</p>
      </div>
    </div>
  )
}

export default MessageBubble