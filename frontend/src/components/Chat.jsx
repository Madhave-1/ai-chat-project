import { useState } from 'react'
import Sidebar from './Sidebar'
import ChatWindow from './ChatWindow'
export default function Chat({ onLogout }) {
  const [chatId, setChatId] = useState(Date.now())
  const handleNewChat = () => {
    setChatId(Date.now())
  }
  const handleSelectChat = (id) => {
    setChatId(id)
  }
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar onLogout={onLogout} onNewChat={handleNewChat} onSelectChat={handleSelectChat} currentChatId={chatId} />
      <ChatWindow key={chatId} chatId={chatId} />
    </div>
  )
}
