// src/app/dashboard/chat/page.tsx
import { AIChatInterface } from "@/components/ai-chat-interface";
import { AppHeader } from "@/components/layout/app-header"

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col">
    <AppHeader title="Capital Readiness Assessment" subtitle="Evaluate your business funding potential" />
        <main className="flex-1">
             <AIChatInterface />
        </main>
     
    </div>
  );
}
