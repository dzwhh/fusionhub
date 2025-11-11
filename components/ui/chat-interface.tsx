"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { APIDetailSheet, type APIDetail } from "@/components/ui/api-detail-sheet"
import { cn } from "@/lib/utils"

// Sample API data
const sampleAPIs: APIDetail[] = [
  {
    id: 1,
    name: "User Authentication API",
    description: "Secure user authentication and authorization service",
    method: "POST",
    endpoint: "/api/v1/auth/login",
    category: "Authentication",
    scenarios: ["User Login", "SSO Integration", "Mobile App Auth"],
    inputs: [
      { name: "email", type: "string", required: true, description: "User email address" },
      { name: "password", type: "string", required: true, description: "User password" },
    ],
    outputs: [
      { name: "token", type: "string", description: "JWT authentication token" },
      { name: "userId", type: "string", description: "Unique user identifier" },
      { name: "expiresIn", type: "number", description: "Token expiration time in seconds" },
    ],
    exampleResponse: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      userId: "usr_1234567890",
      expiresIn: 3600,
    },
  },
  {
    id: 2,
    name: "Payment Processing API",
    description: "Process secure payment transactions",
    method: "POST",
    endpoint: "/api/v1/payments/charge",
    category: "Payment",
    scenarios: ["E-commerce Checkout", "Subscription Billing", "Refund Processing"],
    inputs: [
      { name: "amount", type: "number", required: true, description: "Payment amount in cents" },
      { name: "currency", type: "string", required: true, description: "Currency code (USD, EUR, etc.)" },
      { name: "source", type: "string", required: true, description: "Payment source token" },
    ],
    outputs: [
      { name: "transactionId", type: "string", description: "Unique transaction identifier" },
      { name: "status", type: "string", description: "Transaction status" },
      { name: "amount", type: "number", description: "Charged amount" },
    ],
    exampleResponse: {
      transactionId: "txn_abc123xyz",
      status: "succeeded",
      amount: 5000,
    },
  },
  {
    id: 3,
    name: "Data Analytics API",
    description: "Retrieve analytics data and insights",
    method: "GET",
    endpoint: "/api/v1/analytics/report",
    category: "Analytics",
    scenarios: ["Dashboard Reporting", "User Behavior Analysis", "Performance Monitoring"],
    inputs: [
      { name: "startDate", type: "string", required: true, description: "Report start date (ISO 8601)" },
      { name: "endDate", type: "string", required: true, description: "Report end date (ISO 8601)" },
      { name: "metrics", type: "array", required: false, description: "Specific metrics to include" },
    ],
    outputs: [
      { name: "data", type: "array", description: "Analytics data points" },
      { name: "summary", type: "object", description: "Summary statistics" },
      { name: "period", type: "object", description: "Time period information" },
    ],
    exampleResponse: {
      data: [
        { date: "2025-01-01", views: 1250, clicks: 340 },
        { date: "2025-01-02", views: 1580, clicks: 420 },
      ],
      summary: { totalViews: 2830, totalClicks: 760, avgClickRate: 0.27 },
      period: { start: "2025-01-01", end: "2025-01-02" },
    },
  },
]

interface Message {
  id: string
  type: "user" | "assistant" | "thinking" | "results"
  content: string
  apis?: APIDetail[]
  timestamp: Date
}

interface ChatInterfaceProps {
  sessionId: number
}

export function ChatInterface({ sessionId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedAPI, setSelectedAPI] = useState<APIDetail | null>(null)
  const [isArtifactOpen, setIsArtifactOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate thinking process
    setTimeout(() => {
      const thinkingMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "thinking",
        content: "Analyzing your request and searching for relevant APIs...",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, thinkingMessage])
    }, 500)

    // Simulate API search results
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.type !== "thinking"))
      const resultsMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "results",
        content: "I found the following APIs that match your request:",
        apis: sampleAPIs,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, resultsMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleAPIClick = (api: APIDetail) => {
    setSelectedAPI(api)
    setIsArtifactOpen(true)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4 max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                {message.type === "user" && (
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-primary-foreground">
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                )}

                {message.type === "thinking" && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm italic">{message.content}</p>
                  </div>
                )}

                {message.type === "results" && (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">{message.content}</p>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
                      {message.apis?.map((api) => (
                        <motion.div
                          key={api.id}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAPIClick(api)}
                          className="cursor-pointer"
                        >
                          <Card className="overflow-hidden rounded-2xl border-2 transition-all hover:border-primary/50 hover:shadow-md">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "rounded-xl",
                                    api.method === "POST" && "border-blue-500 text-blue-500",
                                    api.method === "GET" && "border-green-500 text-green-500",
                                  )}
                                >
                                  {api.method}
                                </Badge>
                                <Badge variant="secondary" className="rounded-xl">
                                  {api.category}
                                </Badge>
                              </div>
                              <CardTitle className="text-base mt-2">{api.name}</CardTitle>
                              <CardDescription className="text-xs">{api.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                {api.endpoint}
                              </code>
                            </CardContent>
                            <CardFooter>
                              <Button variant="secondary" size="sm" className="w-full rounded-xl">
                                Apply for Access
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages.length > 0 && messages[messages.length - 1].type === "thinking" && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p className="text-sm italic">Processing your request...</p>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t bg-background p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Search for APIs using natural language..."
              className="rounded-2xl"
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              size="icon"
              className="rounded-2xl shrink-0"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* API Detail Sheet */}
      <APIDetailSheet
        api={selectedAPI}
        open={isArtifactOpen}
        onOpenChange={setIsArtifactOpen}
      />
    </div>
  )
}
