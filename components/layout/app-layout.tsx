"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Home,
  Layers,
  TrendingUp,
  Settings,
  MessageSquare,
  Plus,
  ChevronDown,
  Menu,
  X,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useSession } from "@/lib/session-context"

const sidebarItems = [
  { title: "Home", icon: <Home className="h-5 w-5" />, isActive: false, route: "/" },
  {
    title: "Task",
    icon: <Layers className="h-5 w-5" />,
    isActive: false,
    items: [
      { title: "API Creation", url: "#" },
      { title: "Service Orchestration", url: "#" },
    ],
  },
  {
    title: "Analysis",
    icon: <TrendingUp className="h-5 w-5" />,
    isActive: false,
    items: [{ title: "Report", url: "#" }],
  },
  {
    title: "Management",
    icon: <Settings className="h-5 w-5" />,
    isActive: false,
    items: [
      { title: "Approval", url: "#" },
      { title: "Permission", url: "#" },
      { title: "User Management", url: "#" },
    ],
  },
]

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { sessions, activeSession, addSession, setActiveSession } = useSession()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const renderSidebarContent = () => (
    <>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="flex aspect-square size-10 items-center justify-center">
            <img src="/LogosDatocmsIcon.svg" alt="Logo" className="size-10" />
          </div>
          <div>
            <h2 className="font-semibold">FusionHub</h2>
            <p className="text-xs text-muted-foreground">Data API</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileMenuOpen(false)}
          className="md:hidden"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-3 py-2">
        <Button className="w-full rounded-2xl" variant="default" onClick={() => addSession()}>
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.title} className="mb-1">
              <button
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium",
                  item.isActive ? "bg-primary/10 text-primary" : "hover:bg-muted",
                )}
                onClick={() => {
                  if (item.route) {
                    window.location.href = item.route
                  } else if (item.items) {
                    toggleExpanded(item.title)
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.title}</span>
                </div>
                {item.items && (
                  <ChevronDown
                    className={cn(
                      "ml-2 h-4 w-4 transition-transform",
                      expandedItems[item.title] ? "rotate-180" : "",
                    )}
                  />
                )}
              </button>

              {item.items && expandedItems[item.title] && (
                <div className="mt-1 ml-6 space-y-1 border-l pl-3">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.title}
                      href={subItem.url}
                      className="flex items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted"
                    >
                      {subItem.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Separator */}
          <div className="my-2">
            <Separator className="bg-muted" />
          </div>

          {/* Sessions */}
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs font-medium text-muted-foreground">Sessions</div>
            {sessions.map((session) => (
              <button
                key={session.id}
                className={cn(
                  "flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm hover:bg-muted",
                  activeSession === session.id ? "bg-primary/10 text-primary" : "",
                )}
                onClick={() => setActiveSession(session.id)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">{session.title}</span>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">{session.time}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="border-t p-3">
        <div className="space-y-1">
          <button className="flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button className="flex w-full items-center justify-between rounded-2xl px-3 py-2 text-sm font-medium hover:bg-muted">
            <div className="flex items-center gap-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <span>John Doe</span>
            </div>
            <Badge variant="outline" className="ml-auto">
              Pro
            </Badge>
          </button>
        </div>
      </div>
    </>
  )

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 30% 70%, rgba(233, 30, 99, 0.5) 0%, rgba(81, 45, 168, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 70% 30%, rgba(76, 175, 80, 0.5) 0%, rgba(32, 119, 188, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 50% 50%, rgba(120, 41, 190, 0.5) 0%, rgba(53, 71, 125, 0.5) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{ duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar - Mobile */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-background transition-transform duration-300 ease-in-out md:hidden",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col border-r">{renderSidebarContent()}</div>
      </div>

      {/* Sidebar - Desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden w-64 transform border-r bg-background transition-transform duration-300 ease-in-out md:block",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">{renderSidebarContent()}</div>
      </div>

      {/* Main Content */}
      <div className={cn("flex flex-col min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-64" : "md:pl-0")}>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-semibold">Data API Center</h1>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
