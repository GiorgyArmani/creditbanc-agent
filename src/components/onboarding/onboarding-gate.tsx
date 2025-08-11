"use client"
import { useState, useEffect, type ReactNode } from "react"
import OnboardingModal from "./onboarding-modal"
import { useOnboardingStatus } from "./use-onboarding-status"

type OnboardingGateProps = { children: ReactNode }

export default function OnboardingGate({ children }: OnboardingGateProps) {
  const { needsOnboarding, loading } = useOnboardingStatus()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (loading) return
    const skipped = sessionStorage.getItem("skipOnboarding") === "true"
    // open if needed and not skipped in THIS tab
    setOpen(needsOnboarding && !skipped)
    // DEBUG (remove later)
    // console.log("[Gate]", { needsOnboarding, loading, skipped })
  }, [needsOnboarding, loading])

  const handleSkipThisSession = () => {
    sessionStorage.setItem("skipOnboarding", "true")
    setOpen(false)
  }

  return (
    <>
      {children}
      <OnboardingModal
        open={open}
        onClose={() => setOpen(false)}
        onSkipThisSession={handleSkipThisSession}
      />
    </>
  )
}
