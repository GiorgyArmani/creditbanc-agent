import { createClient } from "@/lib/supabase/server"
import { type EmailOtpType } from "@supabase/supabase-js"
import { redirect } from "next/navigation"
import { type NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const token_hash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null
  const next = searchParams.get("next") ?? "/"

  const validTypes: EmailOtpType[] = [
    "signup",
    "magiclink",
    "recovery",
    "invite",
    "email_change",
  ]

  if (!token_hash || !type || !validTypes.includes(type)) {
    redirect(`/auth/error?error=Invalid or missing parameters`)
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (error) {
    redirect(`/auth/error?error=${encodeURIComponent(error.message)}`)
  }

  // ✅ Get session to access the user
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user

  if (user) {
    const userId = user.id
    const email = user.email
    const fullName = user.user_metadata?.full_name || "Unnamed User"

    // ✅ Ensure user is in public.users
    const { data: existingUser, error: userQueryError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single()

    if (!existingUser && !userQueryError) {
      await supabase.from("users").insert({
        id: userId,
        email,
        full_name: fullName,
        role: "free",
        created_at: new Date().toISOString(),
      })
    }

    // ✅ Ensure user has a business_profile
    const { data: existingProfile, error: profileQueryError } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("user_id", userId)
      .single()

    if (!existingProfile && !profileQueryError) {
      await supabase.from("business_profiles").insert({
        user_id: userId,
        completion_level: 0,
        last_updated: new Date().toISOString(),
      })
    }
  }

  redirect(next)
}
