#!/bin/bash

OUTPUT="project_code.txt"

rm -f "$OUTPUT"

find . \
  -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.env" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./$OUTPUT" \
  ! -name "package-lock.json" \
  -print0 | while IFS= read -r -d '' file; do
    echo "===== $file =====" >> "$OUTPUT"
    cat "$file" >> "$OUTPUT"
    echo -e "\n\n" >> "$OUTPUT"
done

echo "Export abgeschlossen: $OUTPUT"
