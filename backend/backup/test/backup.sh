#!/bin/bash

# Cron: backup every 12 hours
# 0 */12 * * *

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/Users/effywang/Desktop/thirdyearII/WebSoftwareProduction/course-project-tried-asking-gpt/backend/backup/backup_$DATE"
MONGO_URI="mongodb+srv://junqiwang:HNn8R8ULr8MSnC10@user.urp1feo.mongodb.net/test"

mongodump --uri "$MONGO_URI" --out "$BACKUP_DIR"

echo "Backup completed: $BACKUP_DIR"
