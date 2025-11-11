"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award,
  BookOpen,
  Bookmark,
  Brush,
  Camera,
  Clock,
  Code,
  Download,
  Eye,
  FileText,
  Heart,
  ImageIcon,
  Layers,
  LayoutGrid,
  Lightbulb,
  MessageSquare,
  MoreHorizontal,
  Palette,
  PanelLeft,
  Play,
  Plus,
  Search,
  Share2,
  Sparkles,
  Star,
  Trash,
  TrendingUp,
  Type,
  Users,
  Video,
  CuboidIcon,
  Archive,
  ArrowUpDown,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { APIDetailSheet, type APIDetail } from "@/components/ui/api-detail-sheet"
import { SearchInput } from "@/components/ui/search-input"
import { cn } from "@/lib/utils"

// Sample API data for recent launches
const recentAPIs: APIDetail[] = [
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
  {
    id: 4,
    name: "SMS Notification API",
    description: "Send SMS notifications to users worldwide",
    method: "POST",
    endpoint: "/api/v1/notifications/sms",
    category: "Notification",
    scenarios: ["OTP Verification", "Marketing Campaigns", "Alert Notifications"],
    inputs: [
      { name: "phoneNumber", type: "string", required: true, description: "Recipient phone number" },
      { name: "message", type: "string", required: true, description: "SMS message content" },
      { name: "sender", type: "string", required: false, description: "Sender ID or phone number" },
    ],
    outputs: [
      { name: "messageId", type: "string", description: "Unique message identifier" },
      { name: "status", type: "string", description: "Delivery status" },
      { name: "cost", type: "number", description: "Message cost in credits" },
    ],
    exampleResponse: {
      messageId: "msg_xyz789abc",
      status: "sent",
      cost: 1.5,
    },
  },
  {
    id: 5,
    name: "Image Recognition API",
    description: "AI-powered image analysis and object detection",
    method: "POST",
    endpoint: "/api/v1/vision/analyze",
    category: "AI/ML",
    scenarios: ["Product Recognition", "Content Moderation", "Visual Search"],
    inputs: [
      { name: "imageUrl", type: "string", required: true, description: "URL of the image to analyze" },
      { name: "features", type: "array", required: false, description: "Features to detect (labels, faces, text)" },
    ],
    outputs: [
      { name: "labels", type: "array", description: "Detected objects and labels" },
      { name: "confidence", type: "number", description: "Overall confidence score" },
      { name: "metadata", type: "object", description: "Additional image metadata" },
    ],
    exampleResponse: {
      labels: [
        { name: "Person", confidence: 0.98 },
        { name: "Outdoor", confidence: 0.95 },
      ],
      confidence: 0.96,
      metadata: { width: 1920, height: 1080, format: "JPEG" },
    },
  },
  {
    id: 6,
    name: "Geolocation API",
    description: "Convert addresses to coordinates and vice versa",
    method: "GET",
    endpoint: "/api/v1/geo/geocode",
    category: "Location",
    scenarios: ["Store Locator", "Delivery Tracking", "Location-based Services"],
    inputs: [
      { name: "address", type: "string", required: true, description: "Address to geocode" },
      { name: "language", type: "string", required: false, description: "Response language code" },
    ],
    outputs: [
      { name: "latitude", type: "number", description: "Latitude coordinate" },
      { name: "longitude", type: "number", description: "Longitude coordinate" },
      { name: "formattedAddress", type: "string", description: "Standardized address" },
    ],
    exampleResponse: {
      latitude: 37.7749,
      longitude: -122.4194,
      formattedAddress: "San Francisco, CA 94102, USA",
    },
  },
]

// Extended API list with developer info, launch date, and popularity for service table
const allAPIs = [
  {
    ...recentAPIs[0],
    developer: "TechCorp Inc.",
    launchDate: "2024-12-15",
    popularity: 9850,
    status: "上线" as const,
  },
  {
    ...recentAPIs[1],
    developer: "PaymentHub",
    launchDate: "2024-11-28",
    popularity: 8720,
    status: "上线" as const,
  },
  {
    ...recentAPIs[2],
    developer: "DataWise Analytics",
    launchDate: "2025-01-05",
    popularity: 7540,
    status: "测试" as const,
  },
  {
    ...recentAPIs[3],
    developer: "MsgCloud Services",
    launchDate: "2024-10-20",
    popularity: 12300,
    status: "上线" as const,
  },
  {
    ...recentAPIs[4],
    developer: "VisionAI Labs",
    launchDate: "2025-01-10",
    popularity: 6890,
    status: "测试" as const,
  },
  {
    ...recentAPIs[5],
    developer: "MapTech Solutions",
    launchDate: "2024-09-15",
    popularity: 15600,
    status: "上线" as const,
  },
  {
    id: 7,
    name: "Email Marketing API",
    description: "Send bulk emails and manage campaigns",
    method: "POST",
    endpoint: "/api/v1/email/send",
    category: "Marketing",
    developer: "EmailPro",
    launchDate: "2024-08-12",
    popularity: 10200,
    status: "上线" as const,
    scenarios: ["Newsletter", "Transactional Email", "Drip Campaigns"],
    inputs: [
      { name: "recipients", type: "array", required: true, description: "List of recipient emails" },
      { name: "subject", type: "string", required: true, description: "Email subject" },
      { name: "body", type: "string", required: true, description: "Email HTML content" },
    ],
    outputs: [
      { name: "campaignId", type: "string", description: "Campaign identifier" },
      { name: "sentCount", type: "number", description: "Number of emails sent" },
      { name: "status", type: "string", description: "Campaign status" },
    ],
    exampleResponse: {
      campaignId: "camp_xyz123",
      sentCount: 5000,
      status: "delivered",
    },
  },
  {
    id: 8,
    name: "Weather Forecast API",
    description: "Get real-time weather data and forecasts",
    method: "GET",
    endpoint: "/api/v1/weather/forecast",
    category: "Weather",
    developer: "WeatherNow",
    launchDate: "2024-07-05",
    popularity: 18400,
    status: "下线" as const,
    scenarios: ["Travel Planning", "Event Scheduling", "Agriculture"],
    inputs: [
      { name: "location", type: "string", required: true, description: "City or coordinates" },
      { name: "days", type: "number", required: false, description: "Number of forecast days" },
    ],
    outputs: [
      { name: "current", type: "object", description: "Current weather conditions" },
      { name: "forecast", type: "array", description: "Daily forecast data" },
    ],
    exampleResponse: {
      current: { temp: 22, condition: "Sunny", humidity: 65 },
      forecast: [{ day: "Monday", temp: 24, condition: "Partly Cloudy" }],
    },
  },
]

// Sample data for apps
const apps = [
  {
    name: "PixelMaster",
    icon: <ImageIcon className="text-violet-500" />,
    description: "Advanced image editing and composition",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VectorPro",
    icon: <Brush className="text-orange-500" />,
    description: "Professional vector graphics creation",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "VideoStudio",
    icon: <Video className="text-pink-500" />,
    description: "Cinematic video editing and production",
    category: "Video",
    recent: true,
    new: false,
    progress: 100,
  },
  {
    name: "MotionFX",
    icon: <Sparkles className="text-blue-500" />,
    description: "Stunning visual effects and animations",
    category: "Video",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "PageCraft",
    icon: <Layers className="text-red-500" />,
    description: "Professional page design and layout",
    category: "Creative",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "UXFlow",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    description: "Intuitive user experience design",
    category: "Design",
    recent: false,
    new: true,
    progress: 85,
  },
  {
    name: "PhotoLab",
    icon: <Camera className="text-teal-500" />,
    description: "Advanced photo editing and organization",
    category: "Photography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "DocMaster",
    icon: <FileText className="text-red-600" />,
    description: "Document editing and management",
    category: "Document",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "WebCanvas",
    icon: <Code className="text-emerald-500" />,
    description: "Web design and development",
    category: "Web",
    recent: false,
    new: true,
    progress: 70,
  },
  {
    name: "3DStudio",
    icon: <CuboidIcon className="text-indigo-500" />,
    description: "3D modeling and rendering",
    category: "3D",
    recent: false,
    new: true,
    progress: 60,
  },
  {
    name: "FontForge",
    icon: <Type className="text-amber-500" />,
    description: "Typography and font creation",
    category: "Typography",
    recent: false,
    new: false,
    progress: 100,
  },
  {
    name: "ColorPalette",
    icon: <Palette className="text-purple-500" />,
    description: "Color scheme creation and management",
    category: "Design",
    recent: false,
    new: false,
    progress: 100,
  },
]

// Sample data for recent files
const recentFiles = [
  {
    name: "Brand Redesign.pxm",
    app: "PixelMaster",
    modified: "2 hours ago",
    icon: <ImageIcon className="text-violet-500" />,
    shared: true,
    size: "24.5 MB",
    collaborators: 3,
  },
  {
    name: "Company Logo.vec",
    app: "VectorPro",
    modified: "Yesterday",
    icon: <Brush className="text-orange-500" />,
    shared: true,
    size: "8.2 MB",
    collaborators: 2,
  },
  {
    name: "Product Launch Video.vid",
    app: "VideoStudio",
    modified: "3 days ago",
    icon: <Video className="text-pink-500" />,
    shared: false,
    size: "1.2 GB",
    collaborators: 0,
  },
  {
    name: "UI Animation.mfx",
    app: "MotionFX",
    modified: "Last week",
    icon: <Sparkles className="text-blue-500" />,
    shared: true,
    size: "345 MB",
    collaborators: 4,
  },
  {
    name: "Magazine Layout.pgc",
    app: "PageCraft",
    modified: "2 weeks ago",
    icon: <Layers className="text-red-500" />,
    shared: false,
    size: "42.8 MB",
    collaborators: 0,
  },
  {
    name: "Mobile App Design.uxf",
    app: "UXFlow",
    modified: "3 weeks ago",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    shared: true,
    size: "18.3 MB",
    collaborators: 5,
  },
  {
    name: "Product Photography.phl",
    app: "PhotoLab",
    modified: "Last month",
    icon: <Camera className="text-teal-500" />,
    shared: false,
    size: "156 MB",
    collaborators: 0,
  },
]

// Sample data for projects
const projects = [
  {
    name: "Website Redesign",
    description: "Complete overhaul of company website",
    progress: 75,
    dueDate: "June 15, 2025",
    members: 4,
    files: 23,
  },
  {
    name: "Mobile App Launch",
    description: "Design and assets for new mobile application",
    progress: 60,
    dueDate: "July 30, 2025",
    members: 6,
    files: 42,
  },
  {
    name: "Brand Identity",
    description: "New brand guidelines and assets",
    progress: 90,
    dueDate: "May 25, 2025",
    members: 3,
    files: 18,
  },
  {
    name: "Marketing Campaign",
    description: "Summer promotion materials",
    progress: 40,
    dueDate: "August 10, 2025",
    members: 5,
    files: 31,
  },
]

// Sample data for tutorials
const tutorials = [
  {
    title: "Mastering Digital Illustration",
    description: "Learn advanced techniques for creating stunning digital art",
    duration: "1h 45m",
    level: "Advanced",
    instructor: "Sarah Chen",
    category: "Illustration",
    views: "24K",
  },
  {
    title: "UI/UX Design Fundamentals",
    description: "Essential principles for creating intuitive user interfaces",
    duration: "2h 20m",
    level: "Intermediate",
    instructor: "Michael Rodriguez",
    category: "Design",
    views: "56K",
  },
  {
    title: "Video Editing Masterclass",
    description: "Professional techniques for cinematic video editing",
    duration: "3h 10m",
    level: "Advanced",
    instructor: "James Wilson",
    category: "Video",
    views: "32K",
  },
  {
    title: "Typography Essentials",
    description: "Create beautiful and effective typography for any project",
    duration: "1h 30m",
    level: "Beginner",
    instructor: "Emma Thompson",
    category: "Typography",
    views: "18K",
  },
  {
    title: "Color Theory for Designers",
    description: "Understanding color relationships and psychology",
    duration: "2h 05m",
    level: "Intermediate",
    instructor: "David Kim",
    category: "Design",
    views: "41K",
  },
]

// Sample data for community posts
const communityPosts = [
  {
    title: "Minimalist Logo Design",
    author: "Alex Morgan",
    likes: 342,
    comments: 28,
    image: "/placeholder.svg?height=300&width=400",
    time: "2 days ago",
  },
  {
    title: "3D Character Concept",
    author: "Priya Sharma",
    likes: 518,
    comments: 47,
    image: "/placeholder.svg?height=300&width=400",
    time: "1 week ago",
  },
  {
    title: "UI Dashboard Redesign",
    author: "Thomas Wright",
    likes: 276,
    comments: 32,
    image: "/placeholder.svg?height=300&width=400",
    time: "3 days ago",
  },
  {
    title: "Product Photography Setup",
    author: "Olivia Chen",
    likes: 189,
    comments: 15,
    image: "/placeholder.svg?height=300&width=400",
    time: "5 days ago",
  },
]


export function HomePage() {
  const [activeTab, setActiveTab] = useState("home")
  const [selectedAPI, setSelectedAPI] = useState<APIDetail | null>(null)
  const [isAPIDetailOpen, setIsAPIDetailOpen] = useState(false)

  const handleAPIClick = (api: APIDetail) => {
    setSelectedAPI(api)
    setIsAPIDetailOpen(true)
  }

  return (
        <main className="flex-1 p-4 md:p-6">
          <Tabs defaultValue="home" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <TabsList className="grid w-full max-w-[600px] grid-cols-5 rounded-2xl p-1">
                <TabsTrigger value="home" className="rounded-xl data-[state=active]:rounded-xl">
                  ALL
                </TabsTrigger>
                <TabsTrigger value="apps" className="rounded-xl data-[state=active]:rounded-xl">
                  Apps
                </TabsTrigger>
                <TabsTrigger value="files" className="rounded-xl data-[state=active]:rounded-xl">
                  Creatives
                </TabsTrigger>
                <TabsTrigger value="projects" className="rounded-xl data-[state=active]:rounded-xl">
                  Products
                </TabsTrigger>
                <TabsTrigger value="learn" className="rounded-xl data-[state=active]:rounded-xl">
                  Customers
                </TabsTrigger>
              </TabsList>
              <div className="hidden md:flex gap-2">
                <Button className="rounded-2xl">
                  <Plus className="mr-2 h-4 w-4" />
                  New API
                </Button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <TabsContent value="home" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-pink-600 via-red-600 to-orange-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-4">
                          <h2 className="text-3xl font-bold">欢迎来到 FusionHub</h2>
                          <p className="max-w-[600px] text-white/80">
                            数据 API 服务市场，集成应用、商品、创意、广告效果等数据服务，助你快速发现、接入高品质数据能力
                          </p>
                        </div>
                        <div className="hidden lg:block">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                            className="relative h-40 w-40"
                          >
                            <motion.div 
                              animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.15, 0.1] }}
                              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                              className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md" 
                            />
                            <motion.div 
                              animate={{ scale: [1, 1.08, 1], opacity: [0.2, 0.25, 0.2] }}
                              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.3 }}
                              className="absolute inset-4 rounded-full bg-white/20" 
                            />
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.35, 0.3] }}
                              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.6 }}
                              className="absolute inset-8 rounded-full bg-white/30" 
                            />
                            <motion.div 
                              animate={{ scale: [1, 1.12, 1], opacity: [0.4, 0.45, 0.4] }}
                              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.9 }}
                              className="absolute inset-12 rounded-full bg-white/40" 
                            />
                            <motion.div 
                              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.6, 0.5] }}
                              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1.2 }}
                              className="absolute inset-16 rounded-full bg-white/50" 
                            />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">最近上新</h2>
                      <Button variant="ghost" className="rounded-2xl">
                        查看全部
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {recentAPIs.slice(0, 6).map((api) => (
                        <motion.div 
                          key={api.id} 
                          whileHover={{ scale: 1.02, y: -5 }} 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAPIClick(api)}
                          className="cursor-pointer"
                        >
                          <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
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
                                <Badge variant="secondary" className="rounded-xl text-xs">
                                  {api.category}
                                </Badge>
                              </div>
                              <CardTitle className="text-base mt-2">{api.name}</CardTitle>
                              <CardDescription className="text-xs line-clamp-2">{api.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                {api.endpoint}
                              </code>
                            </CardContent>
                            <CardFooter>
                              <Button variant="secondary" size="sm" className="w-full rounded-xl">
                                查看详情
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Service List */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">服务列表</h2>
                      <SearchInput placeholder="Search API..." />
                    </div>
                    <div className="rounded-3xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                          <thead>
                            <tr className="bg-muted/50 border-b">
                              <th className="text-left p-4 font-medium text-sm w-1/6">服务名称</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">状态</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">开发者</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">上线时间</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">类别</th>
                              <th className="text-right p-4 font-medium text-sm w-1/6">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {allAPIs.map((api) => (
                              <motion.tr
                                key={api.id}
                                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                onClick={() => handleAPIClick(api)}
                                className="cursor-pointer transition-colors"
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium truncate">{api.name}</p>
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            "rounded-lg text-xs shrink-0",
                                            api.method === "POST" && "border-blue-500 text-blue-500",
                                            api.method === "GET" && "border-green-500 text-green-500",
                                          )}
                                        >
                                          {api.method}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground truncate mt-1">{api.description}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge 
                                    variant={api.status === "上线" ? "default" : api.status === "测试" ? "secondary" : "outline"}
                                    className={cn(
                                      "rounded-xl text-xs",
                                      api.status === "上线" && "bg-green-500 hover:bg-green-600",
                                      api.status === "测试" && "bg-yellow-500 hover:bg-yellow-600 text-white",
                                      api.status === "下线" && "bg-gray-400 text-white"
                                    )}
                                  >
                                    {api.status}
                                  </Badge>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {api.developer}
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {new Date(api.launchDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                                </td>
                                <td className="p-4">
                                  <Badge variant="secondary" className="rounded-xl text-xs">
                                    {api.category}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-xl"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // TODO: 处理操作逻辑
                                      }}
                                    >
                                      {api.status === "上线" && "下线"}
                                      {api.status === "测试" && "发布"}
                                      {api.status === "下线" && "测试"}
                                    </Button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="apps" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">应用数据服务</h2>
                          <p className="max-w-[600px] text-white/80">
                            提供丰富的游戏&应用APP 数据服务接口，助力移动应用开发与数据分析
                          </p>
                        </div>
                        <div className="hidden lg:block">
                          <motion.div className="relative h-40 w-40">
                            <motion.div
                              animate={{ 
                                scale: [1, 1.2, 1],
                                rotate: [0, 180, 360]
                              }}
                              transition={{ 
                                duration: 8,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-0 rounded-3xl bg-white/10 backdrop-blur-md"
                            />
                            <motion.div
                              animate={{ 
                                scale: [1.2, 1, 1.2],
                                rotate: [360, 180, 0]
                              }}
                              transition={{ 
                                duration: 8,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-6 rounded-3xl bg-white/20"
                            />
                            <motion.div
                              animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.5, 0.3]
                              }}
                              transition={{ 
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-12 rounded-2xl bg-white/30"
                            />
                            <motion.div
                              animate={{ 
                                rotate: 360
                              }}
                              transition={{ 
                                duration: 12,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "linear"
                              }}
                              className="absolute inset-16 rounded-full bg-white/40"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  {/* 最热门服务 */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">最热门服务</h2>
                      <Button variant="ghost" className="rounded-2xl">
                        查看全部
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {recentAPIs.slice(0, 6).map((api) => (
                        <motion.div 
                          key={api.id} 
                          whileHover={{ scale: 1.02, y: -5 }} 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAPIClick(api)}
                          className="cursor-pointer"
                        >
                          <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
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
                                <Badge variant="secondary" className="rounded-xl text-xs">
                                  {api.category}
                                </Badge>
                              </div>
                              <CardTitle className="text-base mt-2">{api.name}</CardTitle>
                              <CardDescription className="text-xs line-clamp-2">{api.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                {api.endpoint}
                              </code>
                            </CardContent>
                            <CardFooter>
                              <Button variant="secondary" size="sm" className="w-full rounded-xl">
                                查看详情
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* 服务列表 */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">服务列表</h2>
                      <SearchInput placeholder="Search API..." />
                    </div>
                    <div className="rounded-3xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                          <thead>
                            <tr className="bg-muted/50 border-b">
                              <th className="text-left p-4 font-medium text-sm w-1/6">服务名称</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">状态</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">开发者</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">上线时间</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">类别</th>
                              <th className="text-right p-4 font-medium text-sm w-1/6">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {allAPIs.map((api) => (
                              <motion.tr
                                key={api.id}
                                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                onClick={() => handleAPIClick(api)}
                                className="cursor-pointer transition-colors"
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium truncate">{api.name}</p>
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            "rounded-lg text-xs shrink-0",
                                            api.method === "POST" && "border-blue-500 text-blue-500",
                                            api.method === "GET" && "border-green-500 text-green-500",
                                          )}
                                        >
                                          {api.method}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground truncate mt-1">{api.description}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge 
                                    variant={api.status === "上线" ? "default" : api.status === "测试" ? "secondary" : "outline"}
                                    className={cn(
                                      "rounded-xl text-xs",
                                      api.status === "上线" && "bg-green-500 hover:bg-green-600",
                                      api.status === "测试" && "bg-yellow-500 hover:bg-yellow-600 text-white",
                                      api.status === "下线" && "bg-gray-400 text-white"
                                    )}
                                  >
                                    {api.status}
                                  </Badge>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {api.developer}
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {new Date(api.launchDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                                </td>
                                <td className="p-4">
                                  <Badge variant="secondary" className="rounded-xl text-xs">
                                    {api.category}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-xl"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // TODO: 处理操作逻辑
                                      }}
                                    >
                                      {api.status === "上线" && "下线"}
                                      {api.status === "测试" && "发布"}
                                      {api.status === "下线" && "测试"}
                                    </Button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="files" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">广告创意数据服务</h2>
                          <p className="max-w-[600px] text-white/80">
                            汇聚优质广告创意数据资源，赋能营销创意分析与优化决策
                          </p>
                        </div>
                        <div className="hidden lg:block">
                          <motion.div className="relative h-40 w-40">
                            <motion.div
                              animate={{ 
                                y: [-10, 10, -10],
                                rotate: [0, 15, 0, -15, 0]
                              }}
                              transition={{ 
                                duration: 6,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-0 rounded-full bg-white/10 backdrop-blur-md"
                            />
                            <motion.div
                              animate={{ 
                                y: [10, -10, 10],
                                scale: [1, 1.15, 1]
                              }}
                              transition={{ 
                                duration: 5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: 0.3
                              }}
                              className="absolute inset-4 rounded-full bg-white/20"
                            />
                            <motion.div
                              animate={{ 
                                y: [-8, 8, -8],
                                x: [-5, 5, -5],
                                rotate: [0, -20, 0, 20, 0]
                              }}
                              transition={{ 
                                duration: 7,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut",
                                delay: 0.6
                              }}
                              className="absolute inset-8 rounded-full bg-white/30"
                            />
                            <motion.div
                              animate={{ 
                                scale: [1, 1.4, 1],
                                opacity: [0.4, 0.6, 0.4]
                              }}
                              transition={{ 
                                duration: 3.5,
                                repeat: Number.POSITIVE_INFINITY,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-14 rounded-full bg-white/40"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  {/* 最热门服务 */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">最热门服务</h2>
                      <Button variant="ghost" className="rounded-2xl">
                        查看全部
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {recentAPIs.slice(0, 6).map((api) => (
                        <motion.div 
                          key={api.id} 
                          whileHover={{ scale: 1.02, y: -5 }} 
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleAPIClick(api)}
                          className="cursor-pointer"
                        >
                          <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
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
                                <Badge variant="secondary" className="rounded-xl text-xs">
                                  {api.category}
                                </Badge>
                              </div>
                              <CardTitle className="text-base mt-2">{api.name}</CardTitle>
                              <CardDescription className="text-xs line-clamp-2">{api.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="pb-3">
                              <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                {api.endpoint}
                              </code>
                            </CardContent>
                            <CardFooter>
                              <Button variant="secondary" size="sm" className="w-full rounded-xl">
                                查看详情
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* 服务列表 */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">服务列表</h2>
                      <SearchInput placeholder="Search API..." />
                    </div>
                    <div className="rounded-3xl border overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full table-fixed">
                          <thead>
                            <tr className="bg-muted/50 border-b">
                              <th className="text-left p-4 font-medium text-sm w-1/6">服务名称</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">状态</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">开发者</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">上线时间</th>
                              <th className="text-left p-4 font-medium text-sm w-1/6">类别</th>
                              <th className="text-right p-4 font-medium text-sm w-1/6">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {allAPIs.map((api) => (
                              <motion.tr
                                key={api.id}
                                whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                                onClick={() => handleAPIClick(api)}
                                className="cursor-pointer transition-colors"
                              >
                                <td className="p-4">
                                  <div className="flex items-center gap-3">
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium truncate">{api.name}</p>
                                        <Badge
                                          variant="outline"
                                          className={cn(
                                            "rounded-lg text-xs shrink-0",
                                            api.method === "POST" && "border-blue-500 text-blue-500",
                                            api.method === "GET" && "border-green-500 text-green-500",
                                          )}
                                        >
                                          {api.method}
                                        </Badge>
                                      </div>
                                      <p className="text-xs text-muted-foreground truncate mt-1">{api.description}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-4">
                                  <Badge 
                                    variant={api.status === "上线" ? "default" : api.status === "测试" ? "secondary" : "outline"}
                                    className={cn(
                                      "rounded-xl text-xs",
                                      api.status === "上线" && "bg-green-500 hover:bg-green-600",
                                      api.status === "测试" && "bg-yellow-500 hover:bg-yellow-600 text-white",
                                      api.status === "下线" && "bg-gray-400 text-white"
                                    )}
                                  >
                                    {api.status}
                                  </Badge>
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {api.developer}
                                </td>
                                <td className="p-4 text-sm text-muted-foreground">
                                  {new Date(api.launchDate).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' })}
                                </td>
                                <td className="p-4">
                                  <Badge variant="secondary" className="rounded-xl text-xs">
                                    {api.category}
                                  </Badge>
                                </td>
                                <td className="p-4">
                                  <div className="flex items-center justify-end">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="rounded-xl"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        // TODO: 处理操作逻辑
                                      }}
                                    >
                                      {api.status === "上线" && "下线"}
                                      {api.status === "测试" && "发布"}
                                      {api.status === "下线" && "测试"}
                                    </Button>
                                  </div>
                                </td>
                              </motion.tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </section>
                </TabsContent>

                <TabsContent value="projects" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">电商商品数据服务</h2>
                          <p className="max-w-[600px] text-white/80">
                            整合电商平台商品数据接口，助力商品管理与市场分析决策
                          </p>
                        </div>
                        <div className="hidden lg:block">
                          <motion.div
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                            className="relative h-40 w-40"
                          >
                            <div className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-md rotate-12" />
                            <div className="absolute inset-4 rounded-2xl bg-white/20 rotate-6" />
                            <div className="absolute inset-8 rounded-2xl bg-white/30" />
                            <div className="absolute inset-12 rounded-2xl bg-white/40 -rotate-6" />
                            <div className="absolute inset-16 rounded-2xl bg-white/50 -rotate-12" />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  {/* 最热门服务 */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">最热门服务</h2>
                      <Button variant="ghost" className="rounded-2xl">
                        查看全部
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {recentAPIs.slice(0, 6).map((api) => (
                        <motion.div
                          key={api.id}
                          whileHover={{ scale: 1.02, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                            onClick={() => handleAPIClick(api)}
                          >
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="rounded-xl">
                                  {api.method}
                                </Badge>
                                <Badge variant="secondary" className="rounded-xl text-xs">
                                  {api.category}
                                </Badge>
                              </div>
                              <CardTitle className="mt-2">{api.name}</CardTitle>
                              <CardDescription className="line-clamp-2">{api.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                {api.endpoint}
                              </code>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* 服务列表 */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">服务列表</h2>
                      <SearchInput placeholder="Search API..." />
                    </div>
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="bg-muted/50 border-b">
                          <th className="text-left p-4 font-medium text-sm w-1/6">服务名称</th>
                          <th className="text-left p-4 font-medium text-sm w-1/6">状态</th>
                          <th className="text-left p-4 font-medium text-sm w-1/6">开发者</th>
                          <th className="text-left p-4 font-medium text-sm w-1/6">上线时间</th>
                          <th className="text-left p-4 font-medium text-sm w-1/6">类别</th>
                          <th className="text-right p-4 font-medium text-sm w-1/6">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {allAPIs.map((api) => (
                          <motion.tr
                            key={api.id}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            className="cursor-pointer"
                            onClick={() => handleAPIClick(api)}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{api.name}</span>
                                <Badge variant="outline" className="rounded-xl text-xs">
                                  {api.method}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge 
                                variant={api.status === "上线" ? "default" : api.status === "测试" ? "secondary" : "outline"}
                                className={cn(
                                  "rounded-xl text-xs",
                                  api.status === "上线" && "bg-green-500 hover:bg-green-600",
                                  api.status === "测试" && "bg-yellow-500 hover:bg-yellow-600 text-white",
                                  api.status === "下线" && "bg-gray-400 text-white"
                                )}
                              >
                                {api.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm">{api.developer}</td>
                            <td className="p-4 text-sm text-muted-foreground">{api.launchDate}</td>
                            <td className="p-4">
                              <Badge variant="secondary" className="rounded-xl text-xs">
                                {api.category}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // TODO: 处理操作逻辑
                                }}
                              >
                                {api.status === "上线" && "下线"}
                                {api.status === "测试" && "发布"}
                                {api.status === "下线" && "测试"}
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                </TabsContent>

                <TabsContent value="learn" className="space-y-8 mt-0">
                  <section>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="overflow-hidden rounded-3xl bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-8 text-white"
                    >
                      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-bold">客户数据服务</h2>
                          <p className="max-w-[600px] text-white/80">
                            提供客户关系管理数据接口，支持客户行为分析与精准营销
                          </p>
                        </div>
                        <div className="hidden lg:block">
                          <motion.div
                            className="relative h-40 w-40"
                          >
                            <motion.div
                              animate={{ 
                                rotate: 360,
                                borderRadius: ["30%", "50%", "30%"]
                              }}
                              transition={{ 
                                rotate: { duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                                borderRadius: { duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                              }}
                              className="absolute inset-0 bg-white/10 backdrop-blur-md"
                              style={{ borderRadius: "30%" }}
                            />
                            <motion.div
                              animate={{ 
                                rotate: -360,
                                scale: [1, 1.15, 1],
                                borderRadius: ["40%", "50%", "40%"]
                              }}
                              transition={{ 
                                rotate: { duration: 30, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                                scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                                borderRadius: { duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 0.5 }
                              }}
                              className="absolute inset-8 bg-white/20"
                              style={{ borderRadius: "40%" }}
                            />
                            <motion.div
                              animate={{ 
                                scale: [1, 1.3, 1],
                                opacity: [0.3, 0.5, 0.3],
                                rotate: 180
                              }}
                              transition={{ 
                                scale: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                                opacity: { duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                                rotate: { duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
                              }}
                              className="absolute inset-14 rounded-full bg-white/40"
                            />
                          </motion.div>
                        </div>
                      </div>
                    </motion.div>
                  </section>

                  {/* 最热门服务 */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">最热门服务</h2>
                      <Button variant="ghost" className="rounded-2xl">
                        查看全部
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                      {recentAPIs.slice(0, 6).map((api) => (
                        <motion.div
                          key={api.id}
                          whileHover={{ scale: 1.02, y: -5 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Card 
                            className="overflow-hidden rounded-3xl border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                            onClick={() => handleAPIClick(api)}
                          >
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline" className="rounded-xl">
                                  {api.method}
                                </Badge>
                                <Badge variant="secondary" className="rounded-xl text-xs">
                                  {api.category}
                                </Badge>
                              </div>
                              <CardTitle className="mt-2">{api.name}</CardTitle>
                              <CardDescription className="line-clamp-2">{api.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                              <code className="text-xs bg-muted px-2 py-1 rounded block truncate">
                                {api.endpoint}
                              </code>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* 服务列表 */}
                  <section className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold">服务列表</h2>
                      <SearchInput placeholder="Search API..." />
                    </div>
                    <table className="w-full table-fixed">
                      <thead>
                        <tr className="bg-muted/50 border-b">
                          <th className="text-left p-4 font-medium text-sm w-1/6">服务名称</th>
                          <th className="text-left p-4 font-medium text-sm w-1/6">状态</th>
                          <th className="text-left p-4 font-medium text-sm w-1/6">开发者</th>
                          <th className="text-left p-4 font-medium text-sm w-1/6">上线时间</th>
                          <th className="text-left p-4 font-medium text-sm w-1/6">类别</th>
                          <th className="text-right p-4 font-medium text-sm w-1/6">操作</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {allAPIs.map((api) => (
                          <motion.tr
                            key={api.id}
                            whileHover={{ backgroundColor: "rgba(0,0,0,0.02)" }}
                            className="cursor-pointer"
                            onClick={() => handleAPIClick(api)}
                          >
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{api.name}</span>
                                <Badge variant="outline" className="rounded-xl text-xs">
                                  {api.method}
                                </Badge>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge 
                                variant={api.status === "上线" ? "default" : api.status === "测试" ? "secondary" : "outline"}
                                className={cn(
                                  "rounded-xl text-xs",
                                  api.status === "上线" && "bg-green-500 hover:bg-green-600",
                                  api.status === "测试" && "bg-yellow-500 hover:bg-yellow-600 text-white",
                                  api.status === "下线" && "bg-gray-400 text-white"
                                )}
                              >
                                {api.status}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm">{api.developer}</td>
                            <td className="p-4 text-sm text-muted-foreground">{api.launchDate}</td>
                            <td className="p-4">
                              <Badge variant="secondary" className="rounded-xl text-xs">
                                {api.category}
                              </Badge>
                            </td>
                            <td className="p-4 text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-xl"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // TODO: 处理操作逻辑
                                }}
                              >
                                {api.status === "上线" && "下线"}
                                {api.status === "测试" && "发布"}
                                {api.status === "下线" && "测试"}
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                </TabsContent>
              </motion.div>
            </AnimatePresence>
          </Tabs>

          {/* API Detail Sheet */}
          <APIDetailSheet
            api={selectedAPI}
            open={isAPIDetailOpen}
            onOpenChange={setIsAPIDetailOpen}
          />
        </main>
  )
}
