# Supabase + Gmail SMTP setup (fix rate limit & API key errors)

## Error: `"No API key found in request"`

This is **not** caused by SMTP settings. It means a request hit Supabase **without** the `anon` API key.

### Fix in ClassFlow app

1. Copy `.env.example` → `.env` in the project root (same folder as `package.json`).
2. Open [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Project Settings** → **API**.
3. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY` (NOT the `service_role` key)
4. **Restart** the dev server after saving `.env`:
   ```bash
   # Stop npm run dev (Ctrl+C), then:
   npm run dev
   ```
5. Hard refresh the browser (Ctrl+Shift+R).

### If you see this in the browser address bar

Do **not** open URLs like `https://xxx.supabase.co/auth/v1/...` directly in the browser.  
Only the app (or Supabase Dashboard) should call those APIs—with the key in headers.

---

## Gmail SMTP in Supabase (avoid signup email rate limit)

Supabase’s built-in email is limited (~2 emails/hour on free tier). Use **Custom SMTP** with Gmail.

### Step 1 — Gmail App Password

1. Use a Google account with **2-Step Verification** enabled.  
   [Google Account → Security](https://myaccount.google.com/security)
2. Search **App passwords** → Create new:
   - App: **Mail**
   - Device: **Other** → name it `Supabase`
3. Copy the **16-character password** (no spaces).

> You cannot use your normal Gmail password. App Password is required.

### Step 2 — Supabase SMTP settings

Dashboard → **Authentication** → **SMTP Settings**:

| Field | Value |
|--------|--------|
| Enable custom SMTP | **ON** |
| Host | `smtp.gmail.com` |
| Port | `587` |
| Username | your full Gmail, e.g. `you@gmail.com` |
| Password | the **16-char App Password** |
| Sender email | same Gmail address |
| Sender name | `ClassFlow` (optional) |

Click **Save**, then use **Send test email** (in Dashboard only).

### Step 3 — Auth URL configuration

Dashboard → **Authentication** → **URL Configuration**:

| Setting | Value (local dev) |
|---------|-------------------|
| Site URL | `http://localhost:5173` |
| Redirect URLs | Add these lines: |

```
http://localhost:5173/**
http://localhost:5173/auth/callback
http://localhost:5173/login
```

For production, also add:

```
https://YOUR_DOMAIN/**
https://YOUR_DOMAIN/auth/callback
```

### Step 4 — Email confirmations

Dashboard → **Authentication** → **Providers** → **Email**:

- Enable **Confirm email** (recommended)
- After SMTP works, signups send via Gmail (higher limits)

### Step 5 — Email template redirect (important)

Dashboard → **Authentication** → **Email Templates** → **Confirm signup**

Ensure the link uses Supabase’s `{{ .ConfirmationURL }}` (default).  
Our app redirects to: `http://localhost:5173/auth/callback` after confirmation.

---

## Checklist

- [ ] `.env` has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] Dev server restarted after editing `.env`
- [ ] Custom SMTP enabled with Gmail App Password
- [ ] Port `587`, host `smtp.gmail.com`
- [ ] Redirect URLs include `/auth/callback`
- [ ] Test: Register → check Gmail → click link → lands on `/auth/callback` → login/setup

---

## Still failing?

1. **Rate limit** — wait 1 hour or use custom SMTP (above).
2. **Spam folder** — check Promotions/Spam for Supabase/Gmail mail.
3. **Wrong key** — never put `service_role` in the frontend `.env`.
4. **Gmail blocked** — try App Password again; revoke old one and create new.
