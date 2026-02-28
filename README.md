1️⃣ Application Setup Flow
Step 1: Backend Initialization

Install dependencies (npm install)

Connect to MongoDB

Setup Express server

Configure API routes (/api/projects, /api/tasks)

Start server (npm run dev)

Step 2: Frontend Initialization

Install client dependencies

Start Vite server (npm run dev)

API calls automatically proxied to backend

2️⃣ User Interaction Flow
🟢 Step 1: Create a Project

User enters project name & description

Frontend sends POST request → /api/projects

Backend:

Validates data

Saves project in MongoDB

Project appears in sidebar

🟢 Step 2: Select a Project

User clicks a project

Frontend fetches related tasks:

GET /api/tasks?projectId=xyz

Tasks are loaded into Kanban view

🟢 Step 3: Create Tasks

User fills task form:

Title

Description

Priority

Assigned user

Status (default: todo)

POST request → /api/tasks

Task saved in database

Automatically appears in Kanban board

3️⃣ Kanban Workflow Flow
🟡 Step 4: View Tasks by Status

Tasks are grouped into 4 columns:

todo

in-progress

review

done

Frontend filters tasks based on status.

🟡 Step 5: Change Task Status

User selects new status from dropdown

PUT request → /api/tasks/:id

Backend updates task status

UI updates instantly

 4️⃣ Team Collaboration Flow
🟣 Step 6: Add Comments

User clicks on project or task

Opens comment panel

User submits comment

POST request → /api/comments

Comment stored in MongoDB

Comments displayed under related task/project

 5️⃣ Analytics & Reporting Flow
🔵 Step 7: Calculate Metrics

Frontend fetches all tasks & projects.

System calculates:

Total projects

Total tasks

Completed tasks

Completion rate:

Completion Rate = (Completed Tasks / Total Tasks) * 100

Displayed in dashboard cards.

 6️⃣ Gantt Chart Flow
🟤 Step 8: Timeline Visualization

User switches to Gantt View

Tasks with:

startDate

dueDate
are rendered as horizontal bars

Each bar represents duration

Shows overall project timeline

 7️⃣ Backend Data Flow Summary

Client sends request

Express route receives request

Controller handles logic

Mongoose interacts with MongoDB

Response sent back as JSON

React updates UI

 8️⃣ Complete System Flow (High-Level)

Create Project

Add Tasks

Assign Members

Track via Kanban

Collaborate with Comments

Monitor Analytics

View Timeline in Gantt

