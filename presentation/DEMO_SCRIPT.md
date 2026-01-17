# Demo Script - Task Manager Application

## Introduction (30 seconds)
"This is our collaborative Task Manager application. It allows users to register, create tasks, form teams, and collaborate on projects together."

---

## 1. Authentication Demo (2 minutes)

### Register
1. Open the application at `http://172.16.5.10/`
2. Show theme and language switchers on login page
3. Click "Register" link
4. Fill in: Name, Email, Password
5. Click "Register" button
6. **Show:** Automatically redirected to Dashboard

### Logout & Login
1. Click "Logout" button
2. Click "Login"
3. Enter credentials
4. **Show:** Successfully logged in

---

## 2. Theme & Language Demo (1 minute)

### Theme Switching
1. Click theme dropdown (top right)
2. Switch between: Light → Dark → Ocean → Sunset
3. **Show:** Colors change throughout the app
4. **Note:** Theme preference is saved in localStorage

### Language Switching
1. Click language dropdown
2. Switch: English → 中文
3. **Show:** All UI text changes to Chinese
4. Switch back to English

---

## 3. Analytics Dashboard Demo (30 seconds)

1. Point to the analytics cards at top of Dashboard
2. **Show:**
   - Total Tasks count
   - Completed count (green)
   - In Progress count (yellow)
   - Pending count (red)
3. "These numbers update in real-time as we manage tasks"

---

## 4. Task Management Demo (3 minutes)

### Create Personal Task
1. Click "+ Add Task"
2. Fill in:
   - Title: "Complete project documentation"
   - Description: "Write README and API docs"
   - Priority: High
   - Due Date: [select date]
   - Team: Personal Task (default)
3. Click "Create"
4. **Show:** Task appears with red priority badge

### Create Team Task
1. Click "+ Add Task"
2. Fill in:
   - Title: "Review team code"
   - Priority: Medium
   - Team: Select a team from dropdown
3. Click "Create"
4. **Show:** Task appears with team badge (gray left border)

### Edit Task
1. Click "Edit" on a task
2. Change priority from High to Medium
3. Click "Update"
4. **Show:** Task updated, priority badge changes to yellow

### Change Task Status
1. Use status dropdown on any task
2. Change: To Do → In Progress → Done
3. **Show:**
   - Card border color changes
   - Analytics numbers update automatically

### Delete Task
1. Click "Delete" on a task
2. Confirm deletion
3. **Show:** Task removed, analytics update

---

## 5. Team Collaboration Demo (3 minutes)

### Create Team
1. Click "Teams" in navigation
2. Click "+ Create Team"
3. Fill in:
   - Name: "Development Team"
   - Description: "Our project team"
4. Click "Create"
5. **Show:** Team created with auto-generated invite code

### Join Team (with another account)
1. Copy the invite code (e.g., "XXF71T")
2. Login with different account (or incognito window)
3. Go to Teams → "Join Team"
4. Enter the invite code
5. **Show:** Now appears as team member

### View Team Tasks
1. Click "View Tasks" button on team card
2. **Show:**
   - Team tasks displayed with count
   - Edit and Delete buttons available
3. Edit a team task
4. Delete a team task

### Leave Team
1. Click "Leave Team" button
2. Confirm
3. **Show:** Removed from team

---

## 6. Calendar View Demo (1 minute)

1. Click "Calendar" in navigation
2. **Show:** Tasks with due dates appear on calendar
3. Switch views: Month → Week → Day
4. Point out task colors indicate priority
5. Click on a calendar event

---

## 7. Responsive Design Demo (30 seconds)

1. Resize browser window or use DevTools (F12)
2. **Show:** Layout adapts to mobile size
3. Navigation and forms remain usable

---

## Summary

### Core Features ✅
- User Authentication (Register, Login, Logout)
- Task Management (Create, Edit, Delete)
- Assign Tasks to Users/Teams
- Set Due Dates and Priorities
- Team Collaboration (Create, Join, Leave)
- View Team-specific Task Boards

### Optional Features ✅
- Custom Themes (4 themes)
- Multilingual Support (English, Chinese)
- Calendar View
- Analytics Dashboard
- Responsive UI

---

## Q&A
"Any questions about the application?"
