"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"

interface Session {
  id: number
  title: string
  time: string
}

interface SessionContextType {
  sessions: Session[]
  activeSession: number | null
  addSession: (title?: string) => void
  setActiveSession: (id: number) => void
  clearActiveSession: () => void
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export function SessionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([
    { id: 1, title: "New API Design", time: "2 min ago" },
    { id: 2, title: "Service Integration", time: "1 hour ago" },
    { id: 3, title: "Permission Setup", time: "Yesterday" },
  ])
  const [activeSession, setActiveSessionState] = useState<number | null>(null)

  const addSession = (title?: string) => {
    const newSession: Session = {
      id: sessions.length > 0 ? Math.max(...sessions.map((s) => s.id)) + 1 : 1,
      title: title || `New Chat ${sessions.length + 1}`,
      time: "Just now",
    }
    setSessions([newSession, ...sessions])
    setActiveSessionState(newSession.id)
    router.push(`/chat/${newSession.id}`)
  }

  const setActiveSession = (id: number) => {
    setActiveSessionState(id)
    router.push(`/chat/${id}`)
  }

  const clearActiveSession = () => {
    setActiveSessionState(null)
  }

  return (
    <SessionContext.Provider
      value={{
        sessions,
        activeSession,
        addSession,
        setActiveSession,
        clearActiveSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export function useSession() {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}
