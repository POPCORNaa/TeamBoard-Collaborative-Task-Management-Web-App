# Team Reflection - Task Manager Project

## Project Overview

We developed a collaborative Task Manager web application as part of our DevOps course. The application enables users to manage tasks, collaborate in teams, and track productivity.

---

## What We Built

### Core Features ✅
| Feature | Description |
|---------|-------------|
| User Authentication | Register, Login, Logout with JWT |
| Task Management | Create, Edit, Delete tasks |
| Task Assignment | Assign to self or team |
| Due Dates & Priorities | High/Medium/Low with color coding |
| Team Collaboration | Create, Join, Leave teams |
| Team Task Boards | View team-specific tasks |

### Optional Features ✅
| Feature | Description |
|---------|-------------|
| Custom Themes | 4 themes (Light, Dark, Ocean, Sunset) |
| Multilingual | English and Chinese support |
| Calendar View | Visualize tasks by due date |
| Analytics Dashboard | Task statistics |
| Responsive UI | Mobile-friendly design |

---

## Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, React Router |
| Styling | CSS Variables, Responsive Design |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| Auth | JWT (JSON Web Tokens) |
| Containerization | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Monitoring | Grafana LGTM Stack, OpenTelemetry |
| Version Control | Git, GitHub |

---


---

## Challenges & Solutions

### Challenge 1: Team Task Display
**Problem:** Tasks not showing in team boards
**Solution:** Added `team` field to Task model and updated API endpoints

### Challenge 2: Docker Networking
**Problem:** Frontend couldn't reach backend API
**Solution:** Added Nginx reverse proxy configuration:
```nginx
location /api {
    proxy_pass http://backend:3000;
}
```

### Challenge 3: MongoDB Connection
**Problem:** Database timeouts in production
**Solution:** Used MongoDB Atlas with proper connection string and retry logic

### Challenge 4: State Management
**Problem:** Auth state lost on page refresh
**Solution:** Implemented React Context with localStorage persistence

### Challenge 5: Time Management
**Problem:** Pushed everything to the last three days
**Solution:** Follow the step



---

## Key Learnings

### Technical Skills

1. **Docker & Containerization**
   - Multi-stage builds for smaller images
   - Docker Compose for multi-service apps
   - Container networking

2. **CI/CD Pipelines**
   - GitHub Actions workflow syntax
   - Automated testing in pipeline
   - Secure deployment with secrets

3. **Monitoring & Observability**
   - OpenTelemetry instrumentation
   - Grafana dashboard creation
   - Log aggregation with Loki

4. **Full-Stack Development**
   - React hooks and context
   - Express API design
   - MongoDB with Mongoose

### DevOps Practices

1. **Infrastructure as Code**
   - Docker Compose files
   - CI/CD workflow definitions

2. **Automated Testing**
   - Unit tests with Jest/Vitest
   - Integration tests with Supertest

3. **Environment Management**
   - Development vs Production configs
   - Secret management

4. **Continuous Deployment**
   - Automatic deployment on merge
   - Rollback capabilities

### Soft Skills

1. **Problem Solving**
   - Debugging across multiple services
   - Reading logs and stack traces

2. **Documentation**
   - Writing clear READMEs
   - API documentation

3. **Time Management**
   - Balancing features vs DevOps
   - Prioritizing tasks

---

## What Worked Well

1. **Docker from Day 1**
   - Consistent environments
   - Easy deployment

2. **GitHub Actions**
   - Automated testing caught bugs early
   - One-click deployments

3. **Component-Based Architecture**
   - Reusable React components
   - Easy to add features

4. **LGTM Stack**
   - Great visibility into production
   - Easy to identify issues

---

## What We Would Do Differently

1. **Start CI/CD Earlier**
   - Set up pipeline before feature development
   - Catch issues sooner

2. **More Automated Tests**
   - Add E2E tests from beginning
   - Higher code coverage

3. **Better Planning**
   - Define API contracts first
   - Create design mockups

4. **Database Schema Planning**
   - Plan relationships upfront
   - Avoid schema changes later

---

## Future Improvements

| Feature | Priority | Effort |
|---------|----------|--------|
| E2E Testing (Cypress) | High | Medium |
| Real-time Updates (WebSocket) | Medium | High |
| Email Notifications | Medium | Medium |
| Mobile App (React Native) | Low | High |
| Advanced Analytics | Low | Medium |
| File Attachments | Low | Medium |
| 2FA Authentication | Medium | Medium |

---

## Metrics

### Code Statistics
- Frontend: ~2000 lines of code
- Backend: ~800 lines of code
- Tests: ~200 lines of code
- Config Files: ~300 lines

### Pipeline Statistics
- Average build time: ~3-5 minutes
- Deploy time: ~2 minutes
- Test pass rate: 100%

---

## Conclusion

This project provided valuable hands-on experience in modern DevOps practices. We successfully built a functional application with:

- ✅ Complete CI/CD pipeline
- ✅ Containerized deployment
- ✅ Production monitoring
- ✅ Automated testing
- ✅ Collaborative features

The most important lesson: **DevOps is about culture, not just tools.** Automation, collaboration, and continuous improvement are the keys to successful software delivery.

---

## Team Members

- Wangjunqi Inka

---

## Acknowledgments

- Course instructors for guidance
- Anthropic Claude for development assistance
- Open source communities
