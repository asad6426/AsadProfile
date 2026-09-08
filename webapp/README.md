# Md. Asaduzzaman — Personal Portfolio

A personal portfolio site built with Next.js + Tailwind CSS. Content (profile, projects,
students) is stored in JSON files under `data/` and can be edited two ways:

1. **Admin panel** at `/admin` (login at `/admin-login`) — edit your profile, add/edit/delete
   projects, and approve/reject student submissions.
2. **Public student form** at `/students/join` — share this link with your trainees so they can
   submit their own info (photo, current job, work area, availability). Submissions stay
   "pending" until you approve them from the admin panel.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Login

The admin password is set in `.env.local` (not committed to git):

```
ADMIN_PASSWORD=your-password-here
ADMIN_SESSION_SECRET=a-long-random-string
```

A password was auto-generated when this project was set up — check `.env.local` for the
current value, or change it any time (just edit the file and restart the dev server).

## Data

- `data/profile.json` — name, about, skills, experience, education, certifications, contact
- `data/projects.json` — portfolio projects
- `data/students.json` — trainee submissions (`status`: pending / approved / rejected)

Uploaded photos are saved under `public/uploads/`.

## Deployment note

This project stores data as JSON files on disk and saves uploaded images to `public/uploads/`.
That works great on any regular Node.js host (a VPS, Railway, Render, etc.) where the filesystem
persists. It will **not** persist on serverless platforms with a read-only/ephemeral filesystem
(e.g. Vercel's default deployment) — uploads and admin edits would be lost on redeploy. If you
plan to deploy there, swap the file-based storage in `src/lib/data.ts` / `src/lib/upload.ts` for
a database and object storage (e.g. Postgres + S3/Cloudinary).

## Build

```bash
npm run build
npm start
```
