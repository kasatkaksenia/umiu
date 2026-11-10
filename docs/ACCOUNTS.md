# Accounts and sync (Supabase)

umiu signs people in with email + password through [Supabase](https://supabase.com) (free plan is enough)
and keeps each person's data in one database row. Until it's set up, the app works as before (data on the
device only) and Profile says "Accounts aren't connected yet".

## One-time setup (about 10 minutes)

1. Create a project at https://supabase.com/dashboard (any name, region close to you).
2. **SQL Editor › New query**, paste this and run it:

   ```sql
   create table public.user_data (
     user_id uuid primary key references auth.users on delete cascade,
     data jsonb not null,
     updated_at timestamptz not null default now()
   );
   alter table public.user_data enable row level security;
   create policy "own row" on public.user_data
     for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
   ```

3. **Authentication › URL Configuration**: Site URL `https://kasatkaksenia.github.io/umiu/`; add
   `http://localhost:5173/umiu/` to Redirect URLs (for local testing).
4. **Project Settings › API**: copy the **Project URL** and the **anon public** key.
5. GitHub repo › **Settings › Secrets and variables › Actions › Variables**: add
   `SUPABASE_URL` and `SUPABASE_ANON_KEY` with those values. The next push to `main` builds them in.
6. For local development, create `.env.local` (not committed):

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```

The anon key is public by design; the row level security policy above is what keeps each row private.

## How sync works (`src/lib/cloud.ts`)

- **Sign in**: if the account already has data, it replaces what's on the device; if the account is empty,
  the device's data is uploaded to it. Style, language and units picked on the device are kept if the
  account has none.
- **While signed in**: every save uploads the whole state 2 seconds after the last change.
- **Log out**: uploads pending changes, signs out and clears the account's data from the device
  (style, language and units stay).
- **Not synced**: progress photos (they stay on the device, by design).
- Password reset and email confirmation links come back to the app's URL.
