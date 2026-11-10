// Accounts and sync (Supabase: email + password, one row of data per user).
// Setup: docs/ACCOUNTS.md. Without VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY the app stays local-only
// and Profile says accounts aren't connected. The anon key is public by design; row level security
// in the database keeps each person's row private.
import { createClient, Session, SupabaseClient } from "@supabase/supabase-js";
import { S, onSave, render, replaceAll } from "./store";

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY_ = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
export const sb: SupabaseClient | null = URL_ && KEY_ ? createClient(URL_, KEY_, { auth: { persistSession: true, autoRefreshToken: true } }) : null;
export const cloudOn = !!sb;

/** Signed-in account and sync status, for the Profile screen. */
export const ACC: { email: string | null; status: "" | "syncing" | "synced" | "offline"; at: string | null } = { email: null, status: "", at: null };

const TABLE = "user_data";
let uid: string | null = null, timer: ReturnType<typeof setTimeout> | null = null, applying = false;

const hasData = (d: any) => !!d && ((d.hist?.length || 0) + (d.f?.length || 0) + (d.per?.length || 0) + Object.keys(d.cl || {}).length > 0 || !!d.cyc);

async function push() {
  if (!sb || !uid) return;
  ACC.status = "syncing";
  render();
  const { error } = await sb.from(TABLE).upsert({ user_id: uid, data: S, updated_at: new Date().toISOString() });
  ACC.status = error ? "offline" : "synced";
  if (!error) ACC.at = new Date().toISOString();
  render();
}
/** Upload a couple of seconds after the last change. */
function schedule() {
  if (!uid || applying) return;
  if (timer) clearTimeout(timer);
  timer = setTimeout(push, 2000);
}

/**
 * After signing in: if the account already has data, it replaces what's on this device;
 * if the account is empty, this device's data is uploaded to it.
 */
async function pull() {
  if (!sb || !uid) return;
  ACC.status = "syncing";
  render();
  const { data, error } = await sb.from(TABLE).select("data").eq("user_id", uid).maybeSingle();
  if (error) {
    ACC.status = "offline";
    render();
    return;
  }
  if (data && hasData(data.data)) {
    applying = true;
    const keep = { look: S.set.look, lang: S.set.lang, uw: S.set.uw, ul: S.set.ul };
    replaceAll(data.data);
    // Device preferences: keep what was just picked on this device when the account has none.
    for (const [k, v] of Object.entries(keep)) if (S.set[k] == null && v != null) S.set[k] = v;
    applying = false;
    ACC.status = "synced";
    ACC.at = new Date().toISOString();
    render();
  } else await push();
}

function use(s: Session | null) {
  const was = uid;
  uid = s?.user.id || null;
  ACC.email = s?.user.email || null;
  if (!uid) ACC.status = "";
  render();
  if (uid && uid != was) pull();
}

export function initCloud() {
  if (!sb) return;
  onSave.push(schedule);
  sb.auth.getSession().then(({ data }) => use(data.session));
  sb.auth.onAuthStateChange((_e, s) => use(s));
}

/** Friendly message for an auth error (English; translated where shown). */
const msg = (e: any) => {
  const m = String(e?.message || e || "");
  if (/invalid login/i.test(m)) return "Wrong email or password.";
  if (/already registered|already exists/i.test(m)) return "This email already has an account. Sign in instead.";
  if (/password.*(6|short|least)/i.test(m)) return "Use at least 8 characters for the password.";
  if (/email.*(invalid|valid)/i.test(m)) return "Check the email address.";
  if (/not confirmed/i.test(m)) return "Confirm your email first: open the link we sent you.";
  if (/fetch|network/i.test(m)) return "No connection. Check your internet and try again.";
  return m || "Something went wrong. Try again.";
};

export async function signUp(email: string, password: string): Promise<{ ok: boolean; msg?: string; confirm?: boolean }> {
  if (!sb) return { ok: false, msg: "Accounts aren't connected yet." };
  const { data, error } = await sb.auth.signUp({ email, password, options: { emailRedirectTo: location.origin + location.pathname } });
  if (error) return { ok: false, msg: msg(error) };
  return { ok: true, confirm: !data.session };
}
export async function signIn(email: string, password: string): Promise<{ ok: boolean; msg?: string }> {
  if (!sb) return { ok: false, msg: "Accounts aren't connected yet." };
  const { error } = await sb.auth.signInWithPassword({ email, password });
  return error ? { ok: false, msg: msg(error) } : { ok: true };
}
export async function resetPassword(email: string): Promise<{ ok: boolean; msg?: string }> {
  if (!sb) return { ok: false, msg: "Accounts aren't connected yet." };
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + location.pathname });
  return error ? { ok: false, msg: msg(error) } : { ok: true };
}
/** Log out: upload the latest changes, then remove this account's data from the device. */
export async function signOut() {
  if (!sb) return;
  if (timer) {
    clearTimeout(timer);
    await push();
  }
  const keep = { look: S.set.look, lang: S.set.lang, uw: S.set.uw, ul: S.set.ul };
  await sb.auth.signOut();
  applying = true;
  replaceAll({ set: keep } as any);
  applying = false;
}

