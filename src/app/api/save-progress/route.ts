import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Here you would integrate with GoHighLevel API
    // Example GoHighLevel API integration:

    const goHighLevelData = {
      contactId: data.userId,
      customFields: {
        [`${data.checklistId}_progress`]: data.progress,
        [`${data.checklistId}_completed_count`]: data.completedCount,
        [`${data.checklistId}_last_updated`]: data.timestamp,
      },
      tags: data.progress === 100 ? [`${data.checklistId}_completed`] : [],
    }

    // Make API call to GoHighLevel
    const ghlResponse = await fetch(`${process.env.GHL_API_BASE_URL}/contacts/${data.userId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.GHL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goHighLevelData),
    })

    if (!ghlResponse.ok) {
      throw new Error("Failed to update GoHighLevel")
    }

    // You could also save to your own database here
    // await saveToDatabase(data)

    return NextResponse.json({
      success: true,
      message: "Progress saved successfully",
    })
  } catch (error) {
    console.error("Error saving progress:", error)
    return NextResponse.json({ success: false, message: "Failed to save progress" }, { status: 500 })
  }
}
