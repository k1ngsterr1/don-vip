#!/bin/bash

echo "🧹 Removing all console.* statements and empty lines..."

for folder in app entities features shared widgets i18n messages; do
  echo "🔍 Processing: $folder"

  # Удаляем все строки с console.log, warn, error, info, debug
  find "./$folder" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i '' -E '/console\.(log|warn|error|debug|info)\(.*\);?/d' {} +

  # Удаляем лишние пустые строки (оставляем максимум одну подряд)
  find "./$folder" -type f \( -name "*.ts" -o -name "*.tsx" \) -exec awk 'NF{p=0} !NF{p++; if(p>1) next} {print}' {} > {}.tmp \; -exec mv {}.tmp {} \;
done

echo "✅ Done. All console logs and extra empty lines removed."
