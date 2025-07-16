// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cliente normal del servidor usando ANON KEY
 * Solo sirve para autenticación basada en cookies
 */
export async function createClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Ignore for middleware
          }
        },
      },
    }
  )
}

/**
 * Cliente seguro para funciones RPC o inserciones que requieren permisos elevados
 */
export function createAdminClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // 👈 usa SERVICE ROLE
    {
      cookies: {
        getAll: () => [],
        setAll: () => {},
      },
    }
  )
}
