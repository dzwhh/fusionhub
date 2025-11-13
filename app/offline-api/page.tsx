"use client"

import { useState } from "react"
import { AppLayout } from "@/components/layout/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, Upload, Edit, Trash2, Plus, X } from "lucide-react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface OfflineAPI {
  id: string
  name: string
  description: string
  method: "GET" | "POST" | "PUT" | "DELETE"
  endpoint: string
  category: string
  tags: string[]
  uploadDate: string
  status: "active" | "inactive"
}

export default function OfflineAPIPage() {
  const [apis, setApis] = useState<OfflineAPI[]>([
    {
      id: "1",
      name: "用户信息查询",
      description: "查询用户详细信息接口",
      method: "GET",
      endpoint: "/api/user/info",
      category: "用户服务",
      tags: ["用户", "查询"],
      uploadDate: "2024-01-15",
      status: "active",
    },
    {
      id: "2",
      name: "订单创建",
      description: "创建新订单接口",
      method: "POST",
      endpoint: "/api/order/create",
      category: "订单服务",
      tags: ["订单", "创建"],
      uploadDate: "2024-01-14",
      status: "active",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [editingAPI, setEditingAPI] = useState<OfflineAPI | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  // 表单状态
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    method: "GET" as OfflineAPI["method"],
    endpoint: "",
    category: "",
    tags: "",
  })

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  // 过滤 API 列表
  const filteredAPIs = apis.filter(
    (api) =>
      api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      api.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // 处理文件上传
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)
      // 这里可以解析文件内容
      console.log("上传文件:", file.name)
    }
  }

  // 创建新 API
  const handleCreateAPI = () => {
    const newAPI: OfflineAPI = {
      id: Date.now().toString(),
      name: formData.name,
      description: formData.description,
      method: formData.method,
      endpoint: formData.endpoint,
      category: formData.category,
      tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      uploadDate: new Date().toISOString().split("T")[0],
      status: "active",
    }

    setApis([...apis, newAPI])
    setIsUploadDialogOpen(false)
    resetForm()
  }

  // 编辑 API
  const handleEditAPI = () => {
    if (!editingAPI) return

    const updatedAPIs = apis.map((api) =>
      api.id === editingAPI.id
        ? {
            ...api,
            name: formData.name,
            description: formData.description,
            method: formData.method,
            endpoint: formData.endpoint,
            category: formData.category,
            tags: formData.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
          }
        : api
    )

    setApis(updatedAPIs)
    setIsEditDialogOpen(false)
    setEditingAPI(null)
    resetForm()
  }

  // 删除 API
  const handleDeleteAPI = (id: string) => {
    setApis(apis.filter((api) => api.id !== id))
  }

  // 打开编辑对话框
  const openEditDialog = (api: OfflineAPI) => {
    setEditingAPI(api)
    setFormData({
      name: api.name,
      description: api.description,
      method: api.method,
      endpoint: api.endpoint,
      category: api.category,
      tags: api.tags.join(", "),
    })
    setIsEditDialogOpen(true)
  }

  // 重置表单
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      method: "GET",
      endpoint: "",
      category: "",
      tags: "",
    })
    setUploadedFile(null)
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">线下 API 管理</h1>
            <p className="text-muted-foreground mt-1">管理和维护线下 API 接口信息</p>
          </div>

          {/* 上传按钮 */}
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl" onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                添加 API
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
              <DialogHeader>
                <DialogTitle>添加线下 API</DialogTitle>
                <DialogDescription>手动填写或上传文件来添加 API 信息</DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                {/* 文件上传区域 */}
                <div className="space-y-2">
                  <Label htmlFor="file">上传文件 (可选)</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="file"
                      type="file"
                      accept=".json,.yaml,.yml"
                      onChange={handleFileUpload}
                      className="rounded-2xl"
                    />
                    {uploadedFile && (
                      <Badge variant="secondary" className="rounded-xl">
                        {uploadedFile.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">支持 JSON、YAML 格式</p>
                </div>

                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-4">或手动填写信息</p>

                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">API 名称 *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="例: 用户信息查询"
                          className="rounded-2xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="method">请求方法 *</Label>
                        <select
                          id="method"
                          value={formData.method}
                          onChange={(e) => setFormData({ ...formData, method: e.target.value as OfflineAPI["method"] })}
                          className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                          <option value="GET">GET</option>
                          <option value="POST">POST</option>
                          <option value="PUT">PUT</option>
                          <option value="DELETE">DELETE</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="endpoint">端点 *</Label>
                      <Input
                        id="endpoint"
                        value={formData.endpoint}
                        onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                        placeholder="例: /api/user/info"
                        className="rounded-2xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">描述</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="描述此 API 的功能"
                        className="rounded-2xl min-h-[80px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">分类</Label>
                        <Input
                          id="category"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="例: 用户服务"
                          className="rounded-2xl"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="tags">标签</Label>
                        <Input
                          id="tags"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="用逗号分隔，例: 用户, 查询"
                          className="rounded-2xl"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUploadDialogOpen(false)} className="rounded-2xl">
                  取消
                </Button>
                <Button
                  onClick={handleCreateAPI}
                  disabled={!formData.name || !formData.endpoint}
                  className="rounded-2xl"
                >
                  添加
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* 搜索栏 */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="搜索 API 名称、描述、分类或标签..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 rounded-2xl"
          />
        </div>

        {/* API 表格 */}
        <Card className="rounded-3xl">
          <CardContent className="p-0">
            {filteredAPIs.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">暂无 API 数据，点击"添加 API"开始录入</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left p-4 font-medium text-sm">API 名称</th>
                      <th className="text-left p-4 font-medium text-sm">方法</th>
                      <th className="text-left p-4 font-medium text-sm">端点</th>
                      <th className="text-left p-4 font-medium text-sm">分类</th>
                      <th className="text-left p-4 font-medium text-sm">标签</th>
                      <th className="text-left p-4 font-medium text-sm">上传日期</th>
                      <th className="text-left p-4 font-medium text-sm">状态</th>
                      <th className="text-right p-4 font-medium text-sm">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredAPIs.map((api, index) => (
                      <motion.tr
                        key={api.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{api.name}</div>
                            <div className="text-xs text-muted-foreground mt-1">{api.description}</div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge
                            variant="outline"
                            className={cn(
                              "rounded-xl",
                              api.method === "GET" && "border-green-500 text-green-500",
                              api.method === "POST" && "border-blue-500 text-blue-500",
                              api.method === "PUT" && "border-yellow-500 text-yellow-500",
                              api.method === "DELETE" && "border-red-500 text-red-500"
                            )}
                          >
                            {api.method}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {api.endpoint}
                          </code>
                        </td>
                        <td className="p-4">
                          <Badge variant="secondary" className="rounded-xl">
                            {api.category}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-wrap gap-1">
                            {api.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="rounded-xl text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </td>
                        <td className="p-4 text-sm text-muted-foreground">
                          {api.uploadDate}
                        </td>
                        <td className="p-4">
                          <Badge
                            variant={api.status === "active" ? "default" : "secondary"}
                            className="rounded-xl"
                          >
                            {api.status === "active" ? "活跃" : "未激活"}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditDialog(api)}
                              className="rounded-xl h-8 w-8"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteAPI(api.id)}
                              className="rounded-xl h-8 w-8 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 编辑对话框 */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl">
            <DialogHeader>
              <DialogTitle>编辑 API</DialogTitle>
              <DialogDescription>修改 API 信息和标签</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">API 名称 *</Label>
                    <Input
                      id="edit-name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-method">请求方法 *</Label>
                    <select
                      id="edit-method"
                      value={formData.method}
                      onChange={(e) => setFormData({ ...formData, method: e.target.value as OfflineAPI["method"] })}
                      className="flex h-10 w-full rounded-2xl border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="GET">GET</option>
                      <option value="POST">POST</option>
                      <option value="PUT">PUT</option>
                      <option value="DELETE">DELETE</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-endpoint">端点 *</Label>
                  <Input
                    id="edit-endpoint"
                    value={formData.endpoint}
                    onChange={(e) => setFormData({ ...formData, endpoint: e.target.value })}
                    className="rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-description">描述</Label>
                  <Textarea
                    id="edit-description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="rounded-2xl min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-category">分类</Label>
                    <Input
                      id="edit-category"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-tags">标签</Label>
                    <Input
                      id="edit-tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      placeholder="用逗号分隔"
                      className="rounded-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setEditingAPI(null)
                  resetForm()
                }}
                className="rounded-2xl"
              >
                取消
              </Button>
              <Button
                onClick={handleEditAPI}
                disabled={!formData.name || !formData.endpoint}
                className="rounded-2xl"
              >
                保存
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  )
}
