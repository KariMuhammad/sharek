# Project Name: Sharek

**Meaning**: "Contribute" in English.

---

## Overview

Sharek is a web-based contribution platform that enables developers to create projects, invite collaborators, and contribute to each other’s work.
Authors can add all necessary project details, contributors can join after approval, and all parties can communicate through private project chats.
The system includes ratings, project filtering, and contribution tracking to foster trust and collaboration.

---

## Core Features

1. **Project Management**

   * Authors can create projects with: title, purpose, description, technologies, tasks, GitHub link, and optional attachments.
   * Projects can be updated, deleted, or marked as pending, active, or fulfilled.
   * Authors can offer a price/reward for contributions.

2. **Contribution Requests**

   * Users can request to join projects as contributors.
   * Authors can accept or reject contribution requests.
   * Once accepted, contributors become part of the project’s collaboration space.

3. **Collaboration & Chat**

   * Each project has a dedicated private chat room for its author and contributors.
   * Authors can send highlighted/special messages (commands).
   * Contributors can communicate with each other within the project room.

4. **Profiles**

   * Each user has a profile with:

     * Name, bio, skills, and picture.
     * Projects authored.
     * Projects contributed to.
     * Contribution ratings.

5. **Rating System**

   * Authors can rate contributors on fulfilled contributions.
   * Contributors can rate authors after collaboration.
   * Ratings improve reputation and trust.

6. **Filtering & Discovery**

   * Users can browse/search projects.
   * Filter by difficulty, technologies, category, and tags.
   * Highlight trending/popular projects.

7. **Authentication & Authorization**

   * User registration/login with email/password.
   * Secure authentication, password encryption, and role-based permissions.

---

## Bonus / Extended Features

1. **Notifications**

   * Notify authors when someone requests to join.
   * Notify contributors when their request is accepted or rejected.
   * Notify project members about new chat messages, updates, and milestones.

2. **Task & Milestone Updates**

   * Authors and contributors can add tasks/milestones.
   * Track project progress collaboratively.

3. **Project Status Dashboard**

   * View project activity, contributor list, and progress at a glance.

4. **Trending Projects**

   * Show popular projects based on ratings, contributions, and activity.

5. **Attachments & Resources**

   * Authors can upload necessary files (docs, guides, diagrams) for contributors.

---

## User Stories

### Authors (Project Owners)

* Create and manage projects.
* Accept/reject contribution requests.
* Mark projects as pending, active, fulfilled, or deleted.
* Offer price/reward for contributions.
* Send highlighted messages in chat.
* Rate contributors after completion.

### Contributors

* Request to join projects.
* Collaborate in project chat.
* Access project tasks and milestones.
* Rate authors after collaboration.
* Build reputation through contributions.

### General Users

* Register/login and manage profile.
* Browse/search/filter projects.
* View project details before requesting to join.

---

## Non-Functional Requirements

1. **Security**: Protect user data, encrypt passwords, secure chats.
2. **Performance**: Fast search, smooth chat, low latency.
3. **Scalability**: Handle many concurrent projects and users.
4. **Usability**: Clean UI, simple flows for contribution.
5. **Maintainability**: Modular and easy-to-extend codebase.

---

## Future Enhancements

* GitHub/GitLab integration for commits and issues.
* Built-in issue tracker with task assignment.
* Recommendation system: suggest projects based on skills.
* Mobile app (Android/iOS).
