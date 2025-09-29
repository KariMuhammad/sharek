====================================================
               SHAREK SYSTEM ARCHITECTURE
====================================================

1. Frontend (Client Layer)
   - Next.js + Tailwind CSS
   - Features:
     * Browse/Search/Filter Projects
     * Contribution Requests & Approvals
     * Project & User Profiles
     * Project Chat UI
     * SEO-Friendly Pages

----------------------------------------------------

2. Backend (Application Layer)
   - Node.js (NestJS or Express)
   - Features:
     * User Authentication (JWT / OAuth)
     * Project CRUD (Create, Update, Delete, Fulfill)
     * Contribution Management (Request/Accept/Reject)
     * Rating System (Author <-> Contributor)
     * Notifications (WebSocket + Email)
     * Real-time Chat Service (Socket.io)

----------------------------------------------------

3. Database Layer
   - PostgreSQL (Main Relational DB)
     * Tables: Users, Projects, Contributions, Ratings,
               Tasks, Attachments
   - Redis (Cache & Real-time Data)
     * Notifications
     * Active Chat Messages
   - (Optional) MongoDB (Flexible storage for unstructured tasks)

----------------------------------------------------

4. Real-time Communication
   - WebSockets (Socket.io)
     * Project Chat Rooms
     * Live Notifications (join request, acceptance, updates)

----------------------------------------------------

5. File Storage
   - Cloud Storage (AWS S3 / DigitalOcean Spaces / Firebase Storage)
     * Attachments
     * Project Resources
     * Diagrams & Guides

----------------------------------------------------

6. Extra Services
   - Email Service (SendGrid / Mailgun / AWS SES)
   - CI/CD (GitHub Actions, Docker, Vercel for Next.js)
   - Optional GitHub API Integration (Sync repos & issues)

====================================================
        EXAMPLE FLOW: Contributor Joins Project
====================================================
1. Contributor browses projects on Next.js frontend.
2. Sends "Join Request" -> Backend API (NestJS/Express).
3. Request saved in PostgreSQL (status = pending).
4. Author gets WebSocket notification.
5. Author accepts -> DB updates -> Contributor added.
6. Contributor joins project chat (Socket.io channel).
7. Author & contributors collaborate in real time.

====================================================
