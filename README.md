# 🔐 Secure Notes Frontend

A **client-side rendered web application** built with **Next.js**, providing a secure and intuitive interface for creating, managing, sharing, and viewing notes with **real-time updates**.

---

## 🚀 Features

- User registration and login
- Secure authentication using JWT
- Notes dashboard
- Create, edit, and delete notes
- Upload external files and extract text
- Download notes as `.txt`
- Share notes with other users (read-only)
- Live updates when viewing shared notes
- Protected routes for authenticated users

---

## 🧱 Tech Stack

- **Framework:** Next.js (CSR)
- **Language:** TypeScript
- **Authentication:** JWT
- **State Management:** ZuStand
- **Real-time:** Socket.IO Client
- **Styling:** CSS / Tailwind CSS (optional)

---

## 📂 Project Structure

```text
app/
 ├── login/
 ├── register/
 ├── dashboard/
 ├── notes/[id]/
 ├── shared/
 └── layout.tsx
