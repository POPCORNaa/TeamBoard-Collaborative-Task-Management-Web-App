# Resilience Plan

This document describes how our system detects, mitigates, and recovers from common failures.
The backend stack includes:
- Node.js + Express API
- MongoDB Atlas
- Health and readiness endpoints (`/health`, `/ready`)
- Automated database backups (`backup.sh`)

---

## 1. Failure: Database Crash / Unavailable (MongoDB Atlas)

### Detection
How will we know the database is down?
- [x] `/ready` endpoint returns `NOT_READY`
- [x] MongoDB connection state changes (e.g., disconnected)
- [x] API logs show connection errors
- [x] Error alerts from MongoDB Atlas dashboard

### Immediate Impact
Which parts of the app are affected?
- [x] Any API endpoints requiring DB queries fail
- [x] Users cannot create, update, or delete data
- [x] Read operations may fail unless using cached data
- [x] App is technically “alive” but not “ready”

### Mitigation
What can we do to reduce impact?
- [x] Keep `/health` alive to show the app is still responding
- [x] Use `/ready` for load balancers to stop sending traffic
- [x] Show user-friendly messages instead of server errors
- [x] Retry DB connection automatically with Mongoose

### Recovery
How do we restore service?
- [x] Wait for MongoDB Atlas to reconnect
- [x] Restart backend if connection does not auto-recover
- [x] Restore lost data using `mongorestore`
- [x] Verify readiness via `/ready` returning `READY`

---

## 2. Failure: Backend API Crash

### Detection
- [x] `/health` endpoint stops responding
- [x] Server logs show unhandled exceptions
- [x] No response from the Node.js process
- [x] Hosting platform alerts (e.g., Render, Railway, Docker logs)

### Immediate Impact
- [x] All API routes become unavailable
- [x] No data can be retrieved or written
- [x] Frontend receives 500 or timeout errors

### Mitigation
- [x] Use PM2 or hosting auto-restart features
- [x] Return meaningful error messages from middleware
- [x] Log the crash for debugging

### Recovery
- [x] Restart backend server
- [x] Fix the code that caused the crash (if applicable)
- [x] Verify server is responding to `/health`

---

## 3. Failure: Network / Connectivity Outage

### Detection
- [x] Requests to MongoDB Atlas time out
- [x] API logs show network errors
- [x] `/ready` becomes `NOT_READY`

### Immediate Impact
- [x] Backend cannot talk to the database
- [x] Read/write operations fail
- [x] Users may see slow or stuck loading states

### Mitigation
- [x] Implement request timeouts
- [x] Serve cached data (if available)
- [x] Display fallback notifications to the user

### Recovery
- [x] Once network recovers, DB reconnects automatically
- [x] Verify connection using `/ready`
- [x] Check logs for incomplete operations

---

## 4. Failure: Data Loss / Accidental Deletion

### Detection
- [x] Missing collections or documents in Atlas
- [x] Errors when querying expected data
- [x] Monitoring alerts or user reports

### Immediate Impact
- [x] API endpoints depending on missing collections fail
- [x] Some features break (e.g., lists return empty)
- [x] Analytics or history data may be incomplete

### Mitigation
- [x] Use MongoDB backups (generated via `backup.sh`)
- [x] Avoid destructive scripts without confirmation
- [x] Keep multiple snapshots using timestamps

### Recovery
- [x] Restore data using:
  ```bash
  mongorestore --uri "$MONGO_URI" backup_folder/
