// src/app/dashboard/chat/page.tsx
import { AIChatInterface } from "@/components/ai-chat-interface";

export default function ChatPage() {
  return (
    <div className="flex min-h-screen flex-col">
        <main className="flex-1">
             <AIChatInterface />
        </main>
     
    </div>
  );
}
