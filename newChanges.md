# Task: Refactor User Roles, Group Management, and Ethnicity Categorization

Please implement the following architectural and feature changes to the application.

---

## 1. Administrative Hierarchy Update
Replace the existing "Website Admin" with a **SysAdmin** role.
* **Global Access:** The SysAdmin should have permission to access all areas of the site.
* **User/Group Control:** Enable the SysAdmin to view all users and groups, and provide the ability to edit or delete any user account.

---

## 2. Group Management Logic
Implement a dynamic management system for groups:
* **Automatic Ownership:** The user who creates a group is automatically assigned as the **Group Manager**.
* **Configurable Settings:** Managers must be able to define the following upon creation and edit them later via a **Settings Icon**:
    * **Privacy:** Toggle between `Private` or `Public`.
    * **Contribution Rules:** Toggle whether "Everyone" or "Only Managers" can add recipes.
    * **Metadata:** Group Name, Description, and Group Image.
* **User Management:** Managers can add/delete members and promote other members to the "Manager" role.
* **Content Moderation:** Managers have the authority to edit or delete any recipe in their group (while the original author maintains their own edit/delete rights).

---

## 3. Recipe Property Refactor: Ethnicity
Replace the boolean `isYemeni` property with a flexible `ethnicity` field.
* **Data Model:** Change `isYemeni` (boolean) to `ethnicity` (string, optional).
* **Input Interface:** In the recipe form, provide a selection tool that allows users to:
    * Choose from a list of **existing ethnicities** already stored in the database.
    * Type in and **add a new ethnicity** if their choice isn't listed.
* **Navigation:** Remove the "Yemeni Food" section from the homepage. Replace it with a link to a new page: **"Browse by Ethnicity"**, which organizes recipes by these tags.

---

## 4. Technical Requirements
* **Migration:** Ensure any existing recipes marked `isYemeni: true` are migrated to `ethnicity: "Yemeni"`.
* **Permissions:** Update the backend middleware/policies to enforce the new SysAdmin and Group Manager permission levels.
* **UI/UX:** Add the Group Settings icon and the new Ethnicity navigation link.
