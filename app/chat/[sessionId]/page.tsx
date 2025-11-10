"use client"

import { ChatInterface } from "@/components/ui/chat-interface"
import { AppLayout } from "@/components/layout/app-layout"
import { useParams } from "next/navigation"

export default function ChatPage() {
  const params = useParams()
  const sessionId = params.sessionId ? Number.parseInt(params.sessionId as string) : 1

  return (
    <AppLayout>
      <ChatInterface sessionId={sessionId} />
    </AppLayout>
  )
}
