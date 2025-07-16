import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'
import { redirect } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next') ?? '/dashboard'

  if (!token_hash || !type) {
    return redirect('/auth/error?error=Missing token or type')
  }

  // Cliente con SERVICE_ROLE_KEY (no lo pongas en el frontend)
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Verifica el token
  const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  })

  if (verifyError || !verifyData?.user?.id) {
    return redirect(`/auth/error?error=${verifyError?.message || 'Invalid OTP'}`)
  }

  const user = verifyData.user

  // Crear perfil de usuario
  const { error: insertError } = await supabase.rpc('insert_user_profile', {
    user_id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || '',
    role: 'free',
  })

  if (insertError) {
    console.error('insert_user_profile error:', insertError.message)
    // Podés decidir si querés redirigir al error o continuar igual
  }

  // Crear perfil de negocio
  const { error: bpError } = await supabase
    .from('business_profiles')
    .insert({ user_id: user.id })

  if (bpError && bpError.code !== '23505') {
    console.error('business_profiles insert error:', bpError.message)
  }

  return redirect(next)
}
