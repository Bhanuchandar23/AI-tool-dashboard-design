"use client"

import { useState } from "react"
import { Send, Plus, Settings, User, MessageSquare, Sparkles, Moon, Sun, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  lastUpdated: Date
}

export default function AIToolDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentInput, setCurrentInput] = useState("")
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      title: "Marketing Copy Ideas",
      messages: [
        {
          id: "1",
          content: "Help me write compelling marketing copy for a new SaaS product",
          role: "user",
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: "2",
          content:
            "I'd be happy to help you create compelling marketing copy! To get started, could you tell me more about your SaaS product? What problem does it solve, who is your target audience, and what are its key features?",
          role: "assistant",
          timestamp: new Date(Date.now() - 3500000),
        },
      ],
      lastUpdated: new Date(Date.now() - 3500000),
    },
    {
      id: "2",
      title: "Content Strategy",
      messages: [],
      lastUpdated: new Date(Date.now() - 86400000),
    },
  ])
  const [activeConversation, setActiveConversation] = useState(conversations[0])
  const { theme, setTheme } = useTheme()

  const handleSendMessage = () => {
    if (!currentInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      content: currentInput,
      role: "user",
      timestamp: new Date(),
    }

    const updatedConversation = {
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
      lastUpdated: new Date(),
    }

    setActiveConversation(updatedConversation)
    setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? updatedConversation : conv)))
    setCurrentInput("")

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I understand you're looking for help with that. Let me provide you with a comprehensive response that addresses your needs...",
        role: "assistant",
        timestamp: new Date(),
      }

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, aiResponse],
        lastUpdated: new Date(),
      }

      setActiveConversation(finalConversation)
      setConversations((prev) => prev.map((conv) => (conv.id === activeConversation.id ? finalConversation : conv)))
    }, 1000)
  }

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Conversation",
      messages: [],
      lastUpdated: new Date(),
    }
    setConversations((prev) => [newConversation, ...prev])
    setActiveConversation(newConversation)
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-80" : "w-0"} transition-all duration-300 overflow-hidden border-r bg-card`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-lg">AI Assistant</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
                <X className="w-4 h-4" />
              </Button>
            </div>
            <Button onClick={createNewConversation} className="w-full" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Chat
            </Button>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Recent Conversations</h3>
            {conversations.map((conversation) => (
              <Card
                key={conversation.id}
                className={`cursor-pointer transition-colors hover:bg-accent ${
                  activeConversation.id === conversation.id ? "bg-accent" : ""
                }`}
                onClick={() => setActiveConversation(conversation)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium truncate">{conversation.title}</span>
                    </div>
                    {conversation.messages.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {conversation.messages.length}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{conversation.lastUpdated.toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t space-y-2">
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start" size="sm">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!sidebarOpen && (
                <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <h1 className="text-xl font-semibold">{activeConversation.title}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeConversation.messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-2">How can I help you today?</h2>
                <p className="text-muted-foreground">Start a conversation by typing your question or request below.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">✍️ Content Creation</h3>
                    <p className="text-sm text-muted-foreground">
                      Generate blog posts, social media content, and marketing copy
                    </p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">💡 Brainstorming</h3>
                    <p className="text-sm text-muted-foreground">Get creative ideas and solutions for your projects</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">📊 Data Analysis</h3>
                    <p className="text-sm text-muted-foreground">Analyze data and generate insights and reports</p>
                  </CardContent>
                </Card>
                <Card className="cursor-pointer hover:bg-accent transition-colors">
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">🔧 Problem Solving</h3>
                    <p className="text-sm text-muted-foreground">Get help with technical issues and troubleshooting</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-4xl mx-auto">
              {activeConversation.messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`flex space-x-3 max-w-3xl ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                  >
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      {message.role === "user" ? (
                        <AvatarFallback>U</AvatarFallback>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </Avatar>
                    <div
                      className={`rounded-lg p-4 ${
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <p className="text-xs opacity-70 mt-2">{message.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t bg-card p-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-4">
              <div className="flex-1">
                <Textarea
                  placeholder="Type your message here..."
                  value={currentInput}
                  onChange={(e) => setCurrentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                  className="min-h-[60px] resize-none"
                />
              </div>
              <Button onClick={handleSendMessage} disabled={!currentInput.trim()} size="lg" className="px-6">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Press Enter to send, Shift + Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
