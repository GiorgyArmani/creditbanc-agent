import { CapitalReadinessAssessment } from "@/components/capital-readiness-assessment"
import { AppHeader } from "@/components/layout/app-header"

export default function AssessmentPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader title="Capital Readiness Assessment" subtitle="Evaluate your business funding potential" />
      <main className="flex-1">
        <CapitalReadinessAssessment mode="full" />
      </main>
    </div>
  )
}
