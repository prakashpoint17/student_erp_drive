import { createClient } from "@supabase/supabase-js";

// Read Supabase environment variables or fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://mock-student-erp.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "mock-anon-key-student-erp-12345";

export const isSupabaseConfigured = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes("mock")
);

// Initialize Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Authentication Service Helper
export const SupabaseAuthService = {
  // 1. Google OAuth Sign-in
  async signInWithGoogle() {
    if (!isSupabaseConfigured) {
      return { 
        success: true, 
        mode: "simulated", 
        message: "Supabase Google OAuth in Demo Mode" 
      };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: window.location.origin
      }
    });
    if (error) throw error;
    return { success: true, data };
  },

  // 2. Email & Password Sign-in
  async signInWithEmail(email, password) {
    if (!isSupabaseConfigured) {
      return { success: true, mode: "simulated" };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return { success: true, data };
  },

  // 3. Sign Out
  async signOut() {
    if (!isSupabaseConfigured) return;
    await supabase.auth.signOut();
  },

  // 4. Fetch User Profile
  async getUserProfile(userId) {
    if (!isSupabaseConfigured) return null;
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) return null;
    return data;
  }
};
