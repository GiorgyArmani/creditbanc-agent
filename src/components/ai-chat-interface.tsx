'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Bot, Loader2, Send, Sparkles, User } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  id: string
}

const QUICK_PROMPTS = [
  'Help me create a business plan',
  'What are the best marketing strategies for my industry?',
  'How can I improve my cash flow?',
  'What should I focus on to scale my business?',
]

export function AIChatInterface() {
  const supabase = createClient()
  const { toast } = useToast()

  const [userId, setUserId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // On mount: get user and load or create session
  useEffect(() => {
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) return
      setUserId(user.id)

      // Buscar o crear sesión
      let { data: session } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (!session) {
        const { data: newSession } = await supabase
          .from('chat_sessions')
          .insert({ user_id: user.id })
          .select()
          .single()
        session = newSession
      }

      if (session?.id) {
        setSessionId(session.id)

        // Cargar historial de mensajes
        const { data: storedMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', session.id)
          .order('timestamp', { ascending: true })

        if (storedMessages) {
          const formatted = storedMessages.map((m) => ({
            id: m.id,
            content: m.content,
            role: m.role,
            timestamp: new Date(m.timestamp),
          }))
          setMessages(formatted)
        }
      }
    }

    initChat()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || !sessionId || !userId) return

    const userMessage: Message = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
      id: `user-${Date.now()}`,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Guardar mensaje del usuario
    await supabase.from('chat_messages').insert({
      session_id: sessionId,
      role: 'user',
      content: userMessage.content,
    })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(({ role, content }) => ({ role, content })),
        }),
      })

      const data = await response.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.text || 'Something went wrong.',
        timestamp: new Date(),
        id: `assistant-${Date.now()}`,
      }

      setMessages((prev) => [...prev, assistantMessage])

      // Guardar respuesta del asistente
      await supabase.from('chat_messages').insert({
        session_id: sessionId,
        role: 'assistant',
        content: assistantMessage.content,
      })
    } catch (err) {
      toast({
        title: 'Error',
        description: 'There was a problem talking to the assistant.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Business Coach</h3>
            <p className="text-sm text-gray-600">Your strategic business partner</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <Avatar className="w-8 h-8 bg-blue-600">
                  <AvatarFallback className="text-white"><Bot className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[80%] rounded-lg px-4 py-3 ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'}`}>
                <div className="text-sm whitespace-pre-wrap">{m.content}</div>
                <div className="text-xs mt-2 text-right opacity-60">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {m.role === 'user' && (
                <Avatar className="w-8 h-8 bg-gray-600">
                  <AvatarFallback className="text-white"><User className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-8 h-8 bg-blue-600">
                <AvatarFallback className="text-white"><Bot className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 px-4 py-2 rounded-lg text-sm">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Prompts */}
      {messages.length === 0 && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-sm text-gray-700 mb-2">Try one of these:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {QUICK_PROMPTS.map((prompt, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => handleQuickPrompt(prompt)}>
                <Sparkles className="w-4 h-4 mr-2 text-blue-600" />
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center p-4 border-t gap-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Ask me anything about your business..."
          className="flex-1 min-h-[60px] max-h-32 resize-none"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </form>
    </div>
  )
}

export default AIChatInterface
