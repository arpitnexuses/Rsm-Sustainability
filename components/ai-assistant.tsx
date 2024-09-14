'use client'

import React, { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, User, Mail, FileText, Cpu, Paperclip, Image as ImageIcon, ChevronDown, Send } from 'lucide-react'

export function AiAssistant() {
  const [inputValue, setInputValue] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { role: 'system', content: 'You are a helpful AI assistant.' },
    { role: 'assistant', content: 'Hi there, John! What would you like to know?' },
  ])
  const [isLoading, setIsLoading] = useState(false)

  const prompts = [
    { icon: <User className="w-6 h-6" />, text: "Write a to-do list for a personal project or task" },
    { icon: <Mail className="w-6 h-6" />, text: "Generate an email to reply to a job offer" },
    { icon: <FileText className="w-6 h-6" />, text: "Summarise this article or text for me in one paragraph" },
    { icon: <Cpu className="w-6 h-6" />, text: "How does AI work in a technical capacity" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() === '') return

    const newMessage = { role: 'user' as const, content: inputValue }
    setChatHistory(prev => [...prev, newMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...chatHistory, newMessage] }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response')
      }

      const data = await response.json()
      setChatHistory(prev => [...prev, data])
    } catch (error) {
      console.error('Error:', error)
      setChatHistory(prev => [...prev, { role: 'assistant' as const, content: 'Sorry, I encountered an error. Please try again.' }])
    } finally {
      setIsLoading(false)
    }
  }

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 bg-white rounded-lg shadow-lg">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Hi there, <span className="text-purple-600">John</span></h1>
        <h2 className="text-3xl font-semibold text-purple-800">What would you like to know?</h2>
        <p className="text-gray-500">Use one of the most common prompts below or use your own to begin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prompts.map((prompt, index) => (
          <Card key={index} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handlePromptClick(prompt.text)}>
            <CardContent className="flex items-center p-4 space-x-4">
              <div className="text-purple-600">{prompt.icon}</div>
              <p className="text-sm">{prompt.text}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" className="text-gray-500">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Prompts
        </Button>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {chatHistory.map((message, index) => (
          message.role !== 'system' && (
            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-purple-500 text-white' 
                  : 'bg-gray-200 text-gray-800'
              }`}>
                {message.content}
              </div>
            </div>
          )
        ))}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Ask whatever you want..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="pr-32 pl-4 py-6 rounded-lg"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add Attachment</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ImageIcon className="h-4 w-4 text-gray-400" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Use Image</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className="text-sm text-gray-400">{inputValue.length}/1000</span>
          <Button type="submit" size="sm" className="bg-purple-600 text-white hover:bg-purple-700" disabled={isLoading}>
            {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </form>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>All Web</span>
        <ChevronDown className="h-4 w-4" />
      </div>
    </div>
  )
}
