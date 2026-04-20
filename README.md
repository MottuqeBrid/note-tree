# Note Tree

A note-taking web application built with Next.js 15, React 19, and TypeScript. Features include user authentication, note management with PDF export, group collaboration, cover designs, and an admin dashboard.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS + DaisyUI
- **Animations**: Framer Motion
- **Forms**: React Hook Form
- **HTTP**: Axios
- **Icons**: React Icons
- **Notifications**: React Toastify, SweetAlert2
- **PDF**: html2canvas-pro, jspdf

## Project Structure

```
src/
├── app/
│   ├── (admin)/          # Admin dashboard routes
│   │   └── admin/
│   ├── (auth)/           # Authentication routes (login, register)
│   ├── (ban)/            # Banned user pages
│   ├── (home)/           # Public pages
│   │   ├── cover/        # Cover design gallery
│   │   ├── group-note/  # Group notes
│   │   └── page.tsx      # Landing page
│   ├── dashboard/        # User dashboard
│   ├── terms/            # Legal pages
│   └── layout.tsx        # Root layout
├── sharedComponent/       # Shared UI components
└── middleware.ts        # Route middleware
```

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint
npm run lint
```

## Routes

| Path                   | Description       |
| ---------------------- | ----------------- |
| `/`                    | Landing page      |
| `/login`               | User login        |
| `/register`            | User registration |
| `/dashboard`           | User dashboard    |
| `/dashboard/add-note`  | Create new note   |
| `/dashboard/all-notes` | View all notes    |
| `/dashboard/profile`   | User profile      |
| `/admin`               | Admin panel       |
| `/admin/users`         | User management   |
| `/admin/group`         | Group management  |
| `/admin/covers`        | Cover management  |
| `/cover`               | Cover gallery     |
