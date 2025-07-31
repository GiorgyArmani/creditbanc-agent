'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Bot, Loader2, Send, ArrowDown, ArrowUp, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import ReactMarkdown from "react-markdown"

function cleanMarkdown(content: string): string {
  return content
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`([^`]+)`/g, '$1')
    .trim()
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  id: string
}

export function AIChatInterface() {
  const supabase = createClient()
  const { toast } = useToast()

  const [userId, setUserId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(true)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Load session + history
  useEffect(() => {
    const initChat = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) return
      setUserId(user.id)

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
        const { data: storedMessages } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('session_id', session.id)
          .order('timestamp', { ascending: true })

        if (storedMessages) {
          setMessages(
            storedMessages.map((m) => ({
              id: m.id,
              content: m.content,
              role: m.role,
              timestamp: new Date(m.timestamp),
            }))
          )
        }
      }
    }
    initChat()
  }, [])

  // Auto scroll if at bottom
  useEffect(() => {
    if (isAtBottom) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isAtBottom])

  // Detect scroll position
  const handleScroll = () => {
    const scroller = scrollContainerRef.current
    if (!scroller) return
    const atBottom =
      scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 50
    setIsAtBottom(atBottom)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as unknown as React.FormEvent)
    }
  }

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
          userId,
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

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-md">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">AI Business Coach</h3>
            <p className="text-sm text-gray-500">Your strategic business partner</p>
          </div>
        </div>
      </div>

      {/* Chat Area (scrollable) */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 scrollbar-thin relative"
      >
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <Avatar className="w-9 h-9 bg-emerald-600 shadow-md">
                  <AvatarFallback className="text-black"><Bot className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-2xl px-5 py-3 text-[15px] leading-relaxed shadow-sm
                  ${m.role === 'user'
                    ? 'bg-emerald-600 text-white max-w-[75%]'
                    : 'bg-white border border-gray-200 text-gray-800 max-w-[75%]'}`}
              >
                <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline font-medium"
                        />
                      ),
                    }}
                  >{cleanMarkdown(m.content)}</ReactMarkdown>
                <div className="text-[11px] mt-2 opacity-60 text-right">
                  {m.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {m.role === 'user' && (
                <Avatar className="w-9 h-9 bg-gray-600 shadow-md">
                  <AvatarFallback className="text-black"><User className="w-4 h-4" /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <Avatar className="w-9 h-9 bg-emerald-600 shadow-md">
                <AvatarFallback className="text-black"><Bot className="w-4 h-4" /></AvatarFallback>
              </Avatar>
              <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 shadow-sm text-gray-600 flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Scroll Button */}
      {messages.length > 0 && (
        <div className="fixed bottom-28 right-6 z-20">
          <Button
            variant="outline"
            size="icon"
            className="bg-white border shadow-lg rounded-full hover:bg-emerald-50 transition-all"
            onClick={() => {
              const scroller = scrollContainerRef.current
              if (!scroller) return
              if (isAtBottom) {
                scroller.scrollTo({ top: 0, behavior: 'smooth' })
              } else {
                scroller.scrollTo({ top: scroller.scrollHeight, behavior: 'smooth' })
              }
            }}
          >
            {isAtBottom ? (
              <ArrowUp className="h-5 w-5 text-emerald-600" />
            ) : (
              <ArrowDown className="h-5 w-5 text-emerald-600" />
            )}
          </Button>
        </div>
      )}

      {/* Input Bar (always fixed at bottom) */}
      <div className="sticky bottom-0 w-full border-t bg-white backdrop-blur-md shadow-inner">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 px-4 py-4 max-w-3xl mx-auto"
        >
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything about your business..."
            className="flex-1 min-h-[60px] max-h-32 resize-none rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring focus:ring-emerald-100 px-4 py-3 text-sm"
            disabled={isLoading}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="rounded-full p-3 bg-emerald-600 hover:bg-emerald-700 shadow-md"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : (
              <Send className="w-5 h-5 text-white" />
            )}
          </Button>
        </form>
      </div>
    </div>
  )
}

export default AIChatInterface
