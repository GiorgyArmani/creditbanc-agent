import { type NextRequest, NextResponse } from "next/server"
import { ghlAPI } from "@/lib/ghl-api"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()

    // Create contact in GoHighLevel
    const contactData = {
      firstName: formData.name.split(" ")[0],
      lastName: formData.name.split(" ").slice(1).join(" "),
      email: formData.email,
      phone: formData.phone,
      customFields: {
        preferred_consultation_time: formData.preferredTime,
        credit_goals: formData.creditGoals,
        current_challenges: formData.currentChallenges,
        consultation_requested: new Date().toISOString(),
      },
      tags: ["consultation_requested", "high_priority_lead"],
      source: "Credit Course Platform",
    }

    const contact = await ghlAPI.createContact(contactData)

    // Create opportunity for consultation
    const opportunityData = {
      contactId: contact.id,
      title: `Credit Consultation - ${formData.name}`,
      value: 0, // Free consultation
      stage: "consultation_requested",
      source: "Credit Course Platform",
    }

    await ghlAPI.createOpportunity(opportunityData)

    // You could also trigger automated workflows here
    // such as sending confirmation emails, assigning to advisors, etc.

    return NextResponse.json({
      success: true,
      message: "Consultation booked successfully",
      contactId: contact.id,
    })
  } catch (error) {
    console.error("Error booking consultation:", error)
    return NextResponse.json({ success: false, message: "Failed to book consultation" }, { status: 500 })
  }
}
