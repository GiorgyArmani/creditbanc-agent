import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next") ?? "/dashboard";

  if (!token_hash || !type) {
    return redirect("/auth/error?error=Missing token or type");
  }

  const supabase = await createClient(); // ✅ await necesario

  // Verificar OTP
  const { error: verifyError } = await supabase.auth.verifyOtp({ token_hash, type });
  if (verifyError) {
    return redirect(`/auth/error?error=${verifyError.message}`);
  }

  // Obtener usuario actual
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return redirect(`/auth/error?error=Failed to get user`);
  }

  // Insertar perfil si no existe (vía RPC con RLS)
  const { error: insertError } = await supabase.rpc("insert_user_profile", {
    user_id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || "",
    role: "free",
  });

  if (insertError) {
    console.error("insert_user_profile error:", insertError.message);
    // No redirigimos aquí aún — seguimos para intentar crear el business profile
  }

  // Crear business_profile si no existe
  const { error: bpError } = await supabase
    .from("business_profiles")
    .insert({ user_id: user.id });

  if (bpError && bpError.code !== "23505") {
    // 23505 = unique_violation, o sea ya existe, lo ignoramos
    console.error("business_profiles insert error:", bpError.message);
  }

  return redirect(next);
}
