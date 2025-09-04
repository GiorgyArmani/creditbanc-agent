// creditbanc-agent/src/app/dashboard/assessment/page.tsx
'use client'
import { CapitalReadinessAssessment } from "@/components/capital-readiness-assessment"


export default function AssessmentPage() {
  return (
    <div className="flex min-h-screen flex-col">
  
      <main className="flex-1">
        <CapitalReadinessAssessment mode="full" />
      </main>
    </div>
  )
}
