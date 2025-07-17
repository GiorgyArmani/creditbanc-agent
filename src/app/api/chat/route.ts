import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

function addEmojisToText(text: string): string {
  return text
    .replace(/\bidea\b/gi, "💡 idea")
    .replace(/\bimportant\b/gi, "🔥 important")
    .replace(/\bgrow|growth|scale\b/gi, "🚀 grow")
    .replace(/\bsave money|reduce costs|optimize\b/gi, "💰 optimize")
    .replace(/\bteam\b/gi, "🤝 team")
    .replace(/\bmarketing\b/gi, "🎯 marketing")
    .replace(/\bcustomer\b/gi, "🧑‍💼 customer")
}


export async function POST(req: NextRequest) {
  console.log("🚀 Chat API endpoint called")

  try {
    // Parse request body
    const body = await req.json()
    const { messages } = body

    console.log("📝 Received messages:", messages?.length || 0)

    // Validate messages
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      console.error("❌ Invalid messages format")
      return NextResponse.json({
        success: false,
        text: "Invalid message format. Please try again.",
      })
    }

    // Check for OpenAI API key
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      console.error("❌ OpenAI API key not found")
      return NextResponse.json({
        success: false,
        text: "AI service is currently unavailable. Please try again later.",
      })
    }


    // Get the latest user message
    const userMessage = messages[messages.length - 1]?.content
    if (!userMessage) {
      console.error("❌ No user message found")
      return NextResponse.json({
        success: false,
        text: "No message received. Please try again.",
      })
    }

    console.log("✅ Processing message:", userMessage.substring(0, 100) + "...")

    // Create system prompt
    const systemPrompt = `You are an expert AI Business Coach with deep knowledge in:
- Business strategy and planning
- Marketing and customer acquisition
- Financial management and growth
- Operations and efficiency
- Leadership and team building
- Technology and automation

Provide practical, actionable advice tailored to the user's specific situation. Be encouraging, professional, and focus on concrete next steps they can take.

Keep responses conversational but informative, and always aim to help them achieve their business goals.`

    // Call OpenAI API
    console.log("🔄 Calling OpenAI API...")

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      maxTokens: 1000,
      temperature: 0.7,
    })

    console.log("✅ OpenAI response received")

    if (!text) {
      console.error("❌ Empty response from OpenAI")
      return NextResponse.json({
        success: false,
        text: "I'm having trouble generating a response right now. Please try again.",
      })
    }

    return NextResponse.json({
      success: true,
      text: addEmojisToText(text),
    })
  } catch (error) {
    console.error("💥 Chat API error:", error)

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json({
          success: false,
          text: "AI service configuration error. Please contact support.",
        })
      }
      if (error.message.includes("rate limit")) {
        return NextResponse.json({
          success: false,
          text: "I'm receiving a lot of requests right now. Please wait a moment and try again.",
        })
      }
      if (error.message.includes("network") || error.message.includes("fetch")) {
        return NextResponse.json({
          success: false,
          text: "Network connection issue. Please check your internet and try again.",
        })
      }
    }

    return NextResponse.json(
      {
        success: false,
        text: "I'm experiencing technical difficulties. Please try again in a moment.",
      },
      { status: 500 },
    )
  }
}
