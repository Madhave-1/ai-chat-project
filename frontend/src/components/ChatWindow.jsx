import { useState, useRef, useEffect } from 'react'
export default function ChatWindow({ chatId }) {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState([
    { id: 1, role: 'ai', content: 'Hello! I am Nexus AI. How can I help you today?' },
  ])
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  useEffect(() => {
    const loadChatHistory = async () => {
      const token = localStorage.getItem("my_chat_token");
      if (!token || !chatId) return;
      try {
        const response = await fetch(`https://my-ai-chat-backend-e401.onrender.com/chat/${chatId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            const formattedMessages = [];
            data.messages.forEach((msg, index) => {
              formattedMessages.push({ id: `user_${index}`, role: 'user', content: msg.user_message });
              formattedMessages.push({ id: `ai_${index}`, role: 'ai', content: msg.ai_response });
            });
            setMessages(formattedMessages);
          }
        }
      } catch (error) {
        console.error("Failed to load chat session:", error);
      }
    };
    loadChatHistory();
  }, [chatId]);
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = input.trim();
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: userMessage }]);
    setInput('');
    const token = localStorage.getItem("my_chat_token");
    try {
        const response = await fetch("https://my-ai-chat-backend-e401.onrender.com/chat/", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ chat_id: chatId.toString(), message: userMessage })
        });
        const data = await response.json();
        if (response.ok) {
            console.log("AI says:", data.reply);
            setMessages(prev => [...prev, { id: Date.now() + 1, role: 'ai', content: data.reply }]);
        } else {
            console.log("Error:", data.detail);
        }
    } catch (error) {
        console.error("Failed to send message:", error);
    }
  }
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }
  return (
    <main className="ml-72 flex-1 flex flex-col h-screen relative bg-surface-container-lowest overflow-hidden w-full">
      <header className="sticky top-0 w-full z-20 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-headline-md text-headline-md font-semibold text-on-surface">Nexus AI</span>
            <span className="font-label-sm text-label-sm px-2 py-0.5 rounded-full bg-surface-container-high text-primary border border-outline-variant/30 flex items-center gap-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
              Active
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 rounded-full p-2 transition-colors flex items-center gap-1.5 font-label-md text-label-md" title="Share Session">
            <span className="material-symbols-outlined text-[18px]" data-icon="share">share</span>
            <span className="font-body-md text-body-sm hidden md:inline">Share</span>
          </button>
          <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 rounded-full p-2 transition-colors" title="Clear Conversation">
            <span className="material-symbols-outlined text-[18px]" data-icon="delete_sweep">delete_sweep</span>
          </button>
          <button className="text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 rounded-full p-2 transition-colors" title="Settings & Hyperparameters">
            <span className="material-symbols-outlined text-[18px]" data-icon="more_vert">more_vert</span>
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-y-auto px-6 py-8 flex justify-center">
        <div className="w-full max-w-[820px] flex flex-col gap-8 pb-32">
          {messages.map((msg) => (
            msg.role === 'user' ? (
              <div key={msg.id} className="flex flex-col items-end gap-1.5 pl-12">
                <div className="relative bg-blue-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-[4px] shadow-[0_4px_24px_-2px_rgba(37,99,235,0.35)] border border-blue-400/20 max-w-xl">
                  <p className="font-body-lg text-body-md leading-relaxed text-white whitespace-pre-wrap">
                    {msg.content}
                  </p>
                </div>
              </div>
            ) : (
              <div key={msg.id} className="flex flex-col items-start gap-2 pr-4">
                <div className="flex items-center gap-2.5 font-label-sm text-label-sm text-outline ml-1">
                  <div className="w-5 h-5 rounded flex items-center justify-center bg-primary/10 border border-primary/30 text-primary">
                    <span className="material-symbols-outlined text-[14px]" data-icon="neurology">neurology</span>
                  </div>
                  <span className="font-semibold text-on-surface">Nexus AI</span>
                </div>
                <div className="w-full bg-surface-container-high/80 backdrop-blur-md rounded-2xl rounded-tl-[4px] border border-outline-variant/30 p-6 shadow-[0_8px_32px_-4px_rgba(11,19,38,0.6)] flex flex-col gap-4">
                  <p className="font-body-lg text-body-md text-on-surface leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 mt-2">
                    <div className="flex items-center gap-1">
                      <button className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-1.5 rounded-DEFAULT transition-colors font-label-sm text-label-sm" title="Copy Message">
                        <span className="material-symbols-outlined text-[16px]" data-icon="content_copy">content_copy</span>
                      </button>
                      <button className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-1.5 rounded-DEFAULT transition-colors" title="Good Response">
                        <span className="material-symbols-outlined text-[16px]" data-icon="thumb_up">thumb_up</span>
                      </button>
                      <button className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface hover:bg-surface-container p-1.5 rounded-DEFAULT transition-colors" title="Bad Response">
                        <span className="material-symbols-outlined text-[16px]" data-icon="thumb_down">thumb_down</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="absolute bottom-6 inset-x-0 flex justify-center px-6 z-30 pointer-events-none">
        <div className="w-full max-w-[820px] pointer-events-auto">
          <div className="relative bg-surface-container-low/85 backdrop-blur-xl border border-outline-variant/40 rounded-2xl shadow-[0_12px_40px_-6px_rgba(0,0,0,0.7)] p-2 transition-all duration-200 focus-within:border-primary/50 focus-within:shadow-[0_8px_32px_-4px_rgba(77,142,255,0.25)]">
            <div className="flex flex-col">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none text-on-surface placeholder:text-outline focus:ring-0 resize-none font-body-md text-body-md px-3 py-1 outline-none max-h-36" 
                placeholder="Message Nexus AI..." 
                rows={2}
              />
              <div className="flex items-center justify-between pt-1 px-2">
                <div className="flex items-center gap-1.5">
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-label-sm text-label-sm text-outline hidden sm:inline">
                    Enter to send • Shift+Enter for newline
                  </span>
                  <button 
                    onClick={handleSend}
                    disabled={!input.trim()}
                    className="w-9 h-9 rounded-full bg-primary-container text-on-primary-container hover:bg-primary transition-all flex items-center justify-center shadow-[0_0_16px_rgba(77,142,255,0.4)] active:scale-95 disabled:opacity-50" 
                    title="Send Prompt"
                  >
                    <span className="material-symbols-outlined text-[20px]" data-icon="arrow_upward">arrow_upward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
