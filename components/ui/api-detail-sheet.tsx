"use client"

import { useState } from "react"
import { Check, Copy, Code, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export interface APIDetail {
  id: number
  name: string
  description: string
  method: string
  endpoint: string
  category: string
  scenarios?: string[]
  inputs: Array<{
    name: string
    type: string
    required: boolean
    description: string
  }>
  outputs: Array<{
    name: string
    type: string
    description: string
  }>
  exampleResponse: any
}

interface APIDetailSheetProps {
  api: APIDetail | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function APIDetailSheet({ api, open, onOpenChange }: APIDetailSheetProps) {
  const [isCopied, setIsCopied] = useState(false)
  const [isEndpointCopied, setIsEndpointCopied] = useState(false)

  const handleCopyResponse = async () => {
    if (!api) return
    
    try {
      await navigator.clipboard.writeText(JSON.stringify(api.exampleResponse, null, 2))
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleCopyEndpoint = async () => {
    if (!api) return
    
    try {
      await navigator.clipboard.writeText(`${api.method} ${api.endpoint}`)
      setIsEndpointCopied(true)
      setTimeout(() => setIsEndpointCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!api) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-2xl p-0 m-4 h-[calc(100vh-2rem)] rounded-3xl border-2 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          <SheetHeader>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <SheetTitle className="flex items-center gap-2">
                  {api.name}
                  <Badge variant="outline" className="rounded-xl">
                    {api.method}
                  </Badge>
                </SheetTitle>
                <SheetDescription className="mt-2">{api.description}</SheetDescription>
              </div>
              <Button className="rounded-2xl shrink-0">
                <Check className="mr-2 h-4 w-4" />
                Apply for Access
              </Button>
            </div>
          </SheetHeader>

          {/* Business Scenarios */}
          {api.scenarios && api.scenarios.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-medium text-muted-foreground mb-2">Business Scenarios</h4>
              <div className="flex flex-wrap gap-2">
                {api.scenarios.map((scenario, index) => (
                  <Badge key={index} variant="secondary" className="rounded-xl text-xs">
                    {scenario}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-6">
            {/* Endpoint */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Endpoint</h3>
              <div className="flex items-center gap-2">
                <code className="flex-1 block bg-muted px-3 py-2 rounded-xl text-sm">
                  {api.method} {api.endpoint}
                </code>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCopyEndpoint}
                  className="h-9 w-9 rounded-lg shrink-0"
                >
                  {isEndpointCopied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Tabs for Parameters and Response */}
            <Tabs defaultValue="inputs" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-2xl">
                <TabsTrigger value="inputs" className="rounded-xl">
                  Input Parameters
                </TabsTrigger>
                <TabsTrigger value="outputs" className="rounded-xl">
                  Output Parameters
                </TabsTrigger>
                <TabsTrigger value="example" className="rounded-xl">
                  Example Response
                </TabsTrigger>
              </TabsList>

              <TabsContent value="inputs" className="space-y-3 mt-4">
                {api.inputs.map((input, index) => (
                  <Card key={index} className="rounded-2xl">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Code className="h-4 w-4" />
                          {input.name}
                        </CardTitle>
                        {input.required && (
                          <Badge variant="destructive" className="rounded-xl text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary" className="rounded-lg">
                          {input.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{input.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="outputs" className="space-y-3 mt-4">
                {api.outputs.map((output, index) => (
                  <Card key={index} className="rounded-2xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        {output.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">Type:</span>
                        <Badge variant="secondary" className="rounded-lg">
                          {output.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{output.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="example" className="mt-4">
                <Card className="rounded-2xl">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">Response Structure</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyResponse}
                        className="h-8 w-8 rounded-lg"
                      >
                        {isCopied ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-muted p-4 rounded-xl text-xs overflow-x-auto">
                      <code>{JSON.stringify(api.exampleResponse, null, 2)}</code>
                    </pre>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
