# HireIQ — Intelligent HR Hiring Assistant

A fully responsive, production-grade frontend for automating resume screening and candidate shortlisting.

## Tech Stack

- **React 18** (functional components + hooks)
- **Tailwind CSS** (utility-first styling)
- **AG Grid Community** (candidates table with custom cell renderers)
- **React Router v6** (client-side routing)
- **Lucide React** (icons)
- **React Dropzone** (file uploads)
- **React Hot Toast** (notifications)
- **Axios** (HTTP client)
- **Zustand** (state management)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Edit `.env` to point to your backend:

```env
REACT_APP_API_URL=https://your-azure-api.azurewebsites.net
```

### 3. Start the development server

```bash
npm start
```

The app opens at [http://localhost:3000](http://localhost:3000)

---

## Pages

| Route | Page | Description |
|---|---|---|
| `/upload` | Upload | Configure JD, skills, and resume ZIP |
| `/dashboard` | Dashboard | Live stats and processing progress |
| `/candidates` | Candidates | AG Grid table with search, filter, export |
| `/email` | Email Actions | Bulk email to selected/rejected candidates |

## Demo Flow

1. Go to **Upload** — upload any JD file, add skill tags, upload any ZIP
2. Click **Start AI Screening** — simulates API call
3. Watch **Dashboard** — live count-up animations and progress bar
4. Navigate to **Candidates** — filter, sort, click "View Details"
5. Go to **Email Actions** — send bulk emails with confirmation modal

## Dark / Light Mode

Toggle via the sun/moon icon in the top-right corner. Preference is saved to `localStorage`.

## API Integration

All API calls are in `src/utils/api.js`. The app uses mock data by default. To connect to a real backend:
1. Set `REACT_APP_API_URL` in `.env`
2. Replace mock calls in hooks with real API functions from `src/utils/api.js`

## Project Structure

```
src/
├── components/
│   ├── layout/         Sidebar, TopBar, MobileNavBar
│   ├── upload/         JD upload, skills input, ZIP upload
│   ├── dashboard/      Stat cards, progress bar
│   ├── candidates/     AG Grid table, detail drawer, status badge
│   └── email/          Email cards, confirm modal
├── pages/              UploadPage, DashboardPage, CandidatesPage, EmailPage
├── hooks/              useUpload, useProcessingStatus, useCandidates
├── context/            AppContext (global state)
└── utils/              api.js (Axios API client)
```
