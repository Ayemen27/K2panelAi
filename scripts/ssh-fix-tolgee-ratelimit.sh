#!/bin/bash

# Get SSH credentials from environment
SSH_HOST="${SSH_HOST}"
SSH_USER="${SSH_USER}"
SSH_PASSWORD="${SSH_PASSWORD}"

echo "🔍 البحث عن ملف Tolgee configuration على السيرفر..."
echo ""

# Find Tolgee installation directory and configuration file
sshpass -p "${SSH_PASSWORD}" ssh -o StrictHostKeyChecking=no ${SSH_USER}@${SSH_HOST} << 'ENDSSH'
  echo "📂 البحث عن Tolgee..."
  
  # Search for Tolgee directory
  TOLGEE_DIRS=$(find / -type d -name "*tolgee*" 2>/dev/null | head -5)
  echo "المجلدات المحتملة:"
  echo "$TOLGEE_DIRS"
  echo ""
  
  # Search for configuration files
  echo "📄 البحث عن ملفات Configuration..."
  CONFIG_FILES=$(find / -name "application.properties" -o -name "application.yml" -o -name "application.yaml" 2>/dev/null | grep -i tolgee | head -5)
  echo "$CONFIG_FILES"
  echo ""
  
  # Search for Docker containers
  echo "🐳 البحث عن Docker containers..."
  if command -v docker &> /dev/null; then
    docker ps | grep tolgee
    echo ""
    
    # Check if Tolgee is running in Docker
    TOLGEE_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i tolgee)
    if [ ! -z "$TOLGEE_CONTAINER" ]; then
      echo "✅ وجدت Tolgee container: $TOLGEE_CONTAINER"
      echo ""
      echo "🔧 عرض environment variables الحالية:"
      docker exec $TOLGEE_CONTAINER env | grep -i rate
      echo ""
      echo "📝 تعديل Rate Limit..."
      # إعادة تشغيل مع تعطيل rate limit
      docker exec $TOLGEE_CONTAINER sh -c 'echo "tolgee.rate-limit.enabled=false" >> /config/application.properties' 2>/dev/null || echo "لا يمكن الكتابة مباشرة"
    fi
  else
    echo "❌ Docker غير مثبت"
  fi
  
  # Search in common locations
  echo ""
  echo "🔍 البحث في المسارات الشائعة..."
  for path in /opt/tolgee /home/*/tolgee /var/lib/tolgee /usr/local/tolgee; do
    if [ -d "$path" ]; then
      echo "✅ وجدت: $path"
      ls -la "$path" 2>/dev/null | head -10
    fi
  done
ENDSSH

echo ""
echo "✅ انتهى الفحص"
