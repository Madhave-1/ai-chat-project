import { useState } from 'react'
import Login from './components/Login'
import Chat from './components/Chat'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const handleLogin = (email, password) => {
    console.log("Login clicked with", email, password)
    setIsAuthenticated(true)
  }
  return (
    <div className="h-screen w-full bg-[#0b0f19] text-gray-100 font-sans antialiased overflow-hidden selection:bg-blue-500/30">
      {isAuthenticated ? (
        <Chat onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}
export default App
