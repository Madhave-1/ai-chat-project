import { useEffect, useState } from 'react';
export default function Sidebar({ onLogout, onNewChat, onSelectChat, currentChatId }) {
  const handleNewChat = () => {
    if (onNewChat) onNewChat()
  }
  const handleSelectChat = (id) => {
    if (onSelectChat) onSelectChat(id)
  }
  const handleLogoutClick = () => {
    console.log("Logout clicked")
    onLogout()
  }
  const [history, setHistory] = useState([])
  useEffect(() => {
    const fetchHistory = async () => {
        const token = localStorage.getItem("my_chat_token");
        if (!token) return;
        try {
            const response = await fetch("https://my-ai-chat-backend-e401.onrender.com/chat/history", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const formattedHistory = data.history.map((session) => {
                    const date = new Date(session.updated_at);
                    return {
                        id: session.chat_id,
                        title: session.title || "New Chat",
                        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                });
                setHistory(formattedHistory);
            }
        } catch (error) {
            console.error("Failed to fetch history", error);
        }
    };
    fetchHistory();
  }, [currentChatId]); 
  return (
    <aside className="fixed inset-y-0 left-0 w-72 flex flex-col bg-surface-container-low border-r border-outline-variant/30 z-30 transition-all duration-200">
      <div className="flex flex-col h-full justify-between p-4">
        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-DEFAULT bg-surface-container-high border border-outline-variant/40 shadow-[0_0_16px_rgba(77,142,255,0.25)]">
                <span className="material-symbols-outlined text-primary text-[20px]" data-icon="neurology">neurology</span>
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-primary animate-pulse"></span>
              </div>
              <div className="flex flex-col">
                <span className="font-headline-md text-headline-md font-semibold text-primary tracking-tight leading-none">Nexus AI</span>
                <span className="font-label-sm text-label-sm text-outline mt-1 leading-none">v1 Active</span>
              </div>
            </div>
            <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 p-1.5 rounded-full transition-colors" title="Collapse Sidebar">
              <span className="material-symbols-outlined text-[18px]" data-icon="dock_to_left">dock_to_left</span>
            </button>
          </div>
          <button 
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-DEFAULT bg-surface-container hover:bg-surface-container-high border border-primary/30 hover:border-primary/60 text-primary shadow-[0_4px_20px_-2px_rgba(77,142,255,0.15)] transition-all duration-200 active:scale-[0.98] group"
          >
            <span className="material-symbols-outlined text-primary group-hover:rotate-90 transition-transform duration-200 text-[20px]" data-icon="add">add</span>
            <span className="font-headline-md text-body-md font-medium text-on-surface">New Chat</span>
          </button>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between px-2 pt-2 pb-1">
              <span className="font-label-sm text-label-sm text-outline tracking-wider uppercase font-semibold">Recent</span>
              <span className="font-label-sm text-label-sm text-outline/60">{history.length} sessions</span>
            </div>
            <nav className="flex flex-col gap-1 overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
              {history.map((chat) => (
                <button
                  key={chat.id}
                  onClick={() => handleSelectChat(chat.id)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-DEFAULT text-left transition-all duration-200 active:scale-[0.98] group ${
                    chat.id === currentChatId 
                      ? "bg-surface-container-high text-on-surface font-medium border-l-2 border-primary" 
                      : "text-on-surface-variant font-normal hover:bg-surface-container hover:text-on-surface"
                  }`}
                >
                  <span className={`material-symbols-outlined text-[18px] ${chat.id === currentChatId ? 'text-primary' : 'text-outline group-hover:text-on-surface-variant'}`} data-icon={chat.id === currentChatId ? 'chat_bubble' : 'chat_bubble_outline'}>
                    {chat.id === currentChatId ? 'chat_bubble' : 'chat_bubble_outline'}
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className={`font-body-md text-body-md truncate ${chat.id === currentChatId ? 'text-on-surface' : ''}`}>
                      {chat.title}
                    </span>
                    <span className="text-[10px] text-outline mt-0.5 truncate">{chat.time}</span>
                  </div>
                  {chat.id === currentChatId && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_#adc6ff] flex-shrink-0"></span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="pt-3 border-t border-outline-variant/30 flex flex-col gap-2">
          <div className="flex items-center justify-between p-2 rounded-DEFAULT hover:bg-surface-container-high/50 transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary/20 border border-outline-variant/50 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">person</span>
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-tertiary border-2 border-surface-container-low"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-body-md text-body-sm font-medium text-on-surface truncate">User</span>
                <span className="font-label-sm text-label-sm text-outline truncate">Active</span>
              </div>
            </div>
            <button 
              onClick={handleLogoutClick}
              className="text-on-surface-variant hover:text-error hover:bg-error/10 p-2 rounded-DEFAULT transition-all duration-150" title="Log out"
            >
              <span className="material-symbols-outlined text-[18px]" data-icon="logout">logout</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  )
}
