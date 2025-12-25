# Task: Implementation Plan for "Groups" Feature and Hebrew Localization

## Objective
Act as a Senior Full-Stack Developer and Architect. Create a detailed implementation plan to add a **Groups** ecosystem to the recipe platform and perform a full **Hebrew (RTL) localization**.
### Project Context & Core Task
**Current State:** A single-admin recipe website designed for personal/private use.
**Goal:** Transform the platform into a multi-user, community-driven application.
**Key Shift:** The core logic must change from a "Global/Admin-only" view to a "Group-based" access model. Users should see and interact with recipes based on the specific groups they belong to, moving away from a single-user controlled environment.

---

## 1. Feature Requirements: Groups System
* **Navigation:** Add a "Groups" navigation icon/link leading to a "My Groups" dashboard.
* **Creation & Privacy:** * Ability to create a group.
    * Toggle between **Public** (searchable/joinable) and **Private** (invite-only).
* **Permissions & Logic:**
    * **Default Behavior:** Only the Group Creator (Admin) can add recipes.
    * **Permission Management:** Admin can toggle "Contributor" status for other members.
* **Invitations:**
    * Search and add users by Username/Email.
    * Generate a unique invite link for the group.
* **Recipe Visibility:** Update the recipe creation flow to include visibility options: **Private**, **Specific Group**, or **Public**.

## 2. Localization & UI/UX (Hebrew/RTL)
* **RTL Transformation:** Full layout flip to Right-to-Left (RTL). Adjust text alignment, flex-direction, and icons.
* **i18n Implementation:** Convert all hardcoded strings to a translation system (e.g., i18next) for Hebrew support.
* **Theme Support:** Ensure all new and existing components support **Dark/Light Mode**.
* **Accessibility:** Maintain WCAG 2.1 compliance (ARIA labels, focus states, and keyboard navigation).

---

## 3. Requested Output (The Plan)
Please provide a structured technical plan including:

### A. Database Schema
Define updates for `Groups`, `Memberships`, `Permissions`, and modifications to the `Recipes` table/collection to handle group associations.

### B. API Design
Outline the REST/GraphQL endpoints needed for:
* Group CRUD operations.
* Member management and permission toggles.
* Invite link generation and validation.

### C. Frontend Architecture
* **RTL Strategy:** Suggest a method (e.g., Tailwind RTL, CSS Logical Properties) for the flip.
* **Component Breakdown:** List new components needed (e.g., `GroupCard`, `InviteModal`, `MemberList`).
* **State Management:** How to handle group data and localization state.

### D. Step-by-Step Roadmap
Break the execution into logical phases (e.g., Database -> Backend -> i18n -> UI Components -> RTL Styling).
