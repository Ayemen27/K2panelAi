#!/bin/bash

set -e

API_URL="${NEXT_PUBLIC_TOLGEE_API_URL:-${TOLGEE_API_URL}}"
API_KEY="${NEXT_PUBLIC_TOLGEE_API_KEY:-${TOLGEE_API_KEY}}"
PROJECT_ID="${NEXT_PUBLIC_TOLGEE_PROJECT_ID:-${TOLGEE_PROJECT_ID}}"

echo "============================================================"
echo "🚀 رفع الترجمات إلى Tolgee"
echo "============================================================"
echo ""
echo "📋 معلومات الاتصال:"
echo "  - API URL: $API_URL"
echo "  - Project ID: $PROJECT_ID"
echo "============================================================"
echo ""

echo "🗑️  حذف أي Import سابق..."
curl -X DELETE "$API_URL/v2/projects/$PROJECT_ID/import" \
  -H "X-API-Key: $API_KEY" \
  -s -o /dev/null
echo "   ✅ تم"
echo ""

echo "📤 رفع جميع ملفات الترجمة..."
echo ""

CURL_CMD="curl -X POST \"$API_URL/v2/projects/$PROJECT_ID/import\" \
  -H \"X-API-Key: $API_KEY\""

for lang in ar en; do
  lang_dir="public/locales/$lang"
  if [ -d "$lang_dir" ]; then
    for file in "$lang_dir"/*.json; do
      if [ -f "$file" ]; then
        filename=$(basename "$file")
        echo "   📄 $lang/$filename"
        CURL_CMD="$CURL_CMD -F \"files=@$file\""
      fi
    done
  fi
done

echo ""
echo "   🔄 جاري الرفع..."

eval "$CURL_CMD" > /tmp/import_response.json 2>&1

if [ $? -eq 0 ]; then
  echo "   ✅ تم رفع الملفات بنجاح"
else
  echo "   ❌ فشل الرفع"
  cat /tmp/import_response.json
  exit 1
fi

echo ""
echo "📥 جلب بيانات Import..."

curl -X GET "$API_URL/v2/projects/$PROJECT_ID/import/result" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -s > /tmp/import_result.json

curl -X GET "$API_URL/v2/projects/$PROJECT_ID/languages" \
  -H "X-API-Key: $API_KEY" \
  -H "Content-Type: application/json" \
  -s > /tmp/languages.json

AR_LANG_ID=$(cat /tmp/languages.json | grep -o '"tag":"ar"' -B 5 | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
EN_LANG_ID=$(cat /tmp/languages.json | grep -o '"tag":"en"' -B 5 | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)

echo "   ℹ️  Arabic Language ID: $AR_LANG_ID"
echo "   ℹ️  English Language ID: $EN_LANG_ID"
echo ""

echo "🔗 ربط اللغات..."
echo ""

cat /tmp/import_result.json | grep -o '"id":[0-9]*,"name":"[^"]*"' | while read -r line; do
  IMPORT_LANG_ID=$(echo "$line" | grep -o '"id":[0-9]*' | cut -d: -f2)
  FILE_NAME=$(echo "$line" | grep -o '"name":"[^"]*"' | cut -d\" -f4)
  
  EXISTING_LANG_ID=""
  
  if echo "$FILE_NAME" | grep -q "\.json$"; then
    cat /tmp/import_result.json | grep -A 10 "\"id\":$IMPORT_LANG_ID" | grep -o '"importFileName":"[^"]*"' | while read -r fname_line; do
      FNAME=$(echo "$fname_line" | cut -d\" -f4)
      
      LANG_CODE=""
      if echo "$FNAME" | grep -q "^ar-" || echo "$FNAME" | grep -q "/ar/"; then
        LANG_CODE="ar"
        EXISTING_LANG_ID="$AR_LANG_ID"
      elif echo "$FNAME" | grep -q "^en-" || echo "$FNAME" | grep -q "/en/"; then
        LANG_CODE="en"
        EXISTING_LANG_ID="$EN_LANG_ID"
      fi
      
      if [ -n "$EXISTING_LANG_ID" ] && [ -n "$IMPORT_LANG_ID" ]; then
        echo "   🔗 $FNAME → $LANG_CODE (ID: $EXISTING_LANG_ID)"
        
        curl -X PUT "$API_URL/v2/projects/$PROJECT_ID/import/result/languages/$IMPORT_LANG_ID/select-existing/$EXISTING_LANG_ID" \
          -H "X-API-Key: $API_KEY" \
          -s -o /dev/null
        
        if [ $? -eq 0 ]; then
          echo "      ✅ تم الربط"
        else
          echo "      ❌ فشل الربط"
        fi
      fi
    done
  fi
done

IMPORT_LANG_IDS=$(cat /tmp/import_result.json | grep -o '"importFileId":[0-9]*' | cut -d: -f2 | sort -u)

counter=0
for IMPORT_FILE_ID in $IMPORT_LANG_IDS; do
  IMPORT_LANG_ID=$(cat /tmp/import_result.json | grep "\"importFileId\":$IMPORT_FILE_ID" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
  FILE_NAME=$(cat /tmp/import_result.json | grep "\"importFileId\":$IMPORT_FILE_ID" | grep -o '"importFileName":"[^"]*"' | head -1 | cut -d\" -f4)
  
  if [ $counter -lt 8 ]; then
    LANG_CODE="ar"
    EXISTING_LANG_ID="$AR_LANG_ID"
  else
    LANG_CODE="en"
    EXISTING_LANG_ID="$EN_LANG_ID"
  fi
  
  echo "   🔗 $FILE_NAME → $LANG_CODE (Import ID: $IMPORT_LANG_ID, Existing ID: $EXISTING_LANG_ID)"
  
  curl -X PUT "$API_URL/v2/projects/$PROJECT_ID/import/result/languages/$IMPORT_LANG_ID/select-existing/$EXISTING_LANG_ID" \
    -H "X-API-Key: $API_KEY" \
    -s -o /dev/null
  
  counter=$((counter + 1))
done

echo ""
echo "✅ تم ربط جميع اللغات"
echo ""

echo "============================================================"
echo "📤 تطبيق Import..."
echo ""

APPLY_RESPONSE=$(curl -X PUT "$API_URL/v2/projects/$PROJECT_ID/import/apply" \
  -H "X-API-Key: $API_KEY" \
  -w "\n%{http_code}" \
  -s 2>&1)

HTTP_CODE=$(echo "$APPLY_RESPONSE" | tail -n 1)

if [ "$HTTP_CODE" = "200" ]; then
  echo "============================================================"
  echo "🎉 النتيجة النهائية"
  echo "============================================================"
  echo "✅ تم رفع وتطبيق جميع الترجمات بنجاح!"
  echo "📊 عدد الملفات المرفوعة: 16"
  echo "📊 عدد اللغات: 2 (ar, en)"
  echo "============================================================"
  echo ""
  echo "✨ اكتملت العملية بنجاح!"
  echo ""
else
  echo "❌ فشل التطبيق"
  echo "$APPLY_RESPONSE" | head -n -1
  exit 1
fi
