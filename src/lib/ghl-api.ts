// GoHighLevel API integration utilities

const GHL_API_BASE_URL = process.env.GHL_API_BASE_URL || "https://rest.gohighlevel.com/v1"
const GHL_API_KEY = process.env.GHL_API_KEY

export class GoHighLevelAPI {
  private apiKey: string
  private baseUrl: string

  constructor() {
    if (!GHL_API_KEY) {
      throw new Error("GHL_API_KEY environment variable is required")
    }
    this.apiKey = GHL_API_KEY
    this.baseUrl = GHL_API_BASE_URL
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`GHL API error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Contact management
  async getContact(contactId: string) {
    return this.makeRequest(`/contacts/${contactId}`)
  }

  async updateContact(contactId: string, data: any) {
    return this.makeRequest(`/contacts/${contactId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  async createContact(contactData: any) {
    return this.makeRequest("/contacts", {
      method: "POST",
      body: JSON.stringify(contactData),
    })
  }

  // Custom fields for course progress
  async updateCourseProgress(
    contactId: string,
    courseData: {
      courseName: string
      progress: number
      completedLessons: number
      totalLessons: number
      lastAccessed: string
    },
  ) {
    const customFields = {
      [`${courseData.courseName}_progress`]: courseData.progress,
      [`${courseData.courseName}_completed`]: courseData.completedLessons,
      [`${courseData.courseName}_total`]: courseData.totalLessons,
      [`${courseData.courseName}_last_accessed`]: courseData.lastAccessed,
    }

    return this.updateContact(contactId, { customFields })
  }

  // Tags for course completion
  async addCourseCompletionTag(contactId: string, courseName: string) {
    return this.makeRequest(`/contacts/${contactId}/tags`, {
      method: "POST",
      body: JSON.stringify({
        tags: [`${courseName}_completed`, "course_graduate"],
      }),
    })
  }

  // Opportunities for upsells
  async createOpportunity(data: {
    contactId: string
    title: string
    value: number
    stage: string
    source: string
  }) {
    return this.makeRequest("/opportunities", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }
}

export const ghlAPI = new GoHighLevelAPI()
