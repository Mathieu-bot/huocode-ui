#!/usr/bin/env bash
set -euo pipefail

BACKEND="${1:-../huocode}"
TARGET="$PWD/src/api-client"
GENERATED="$BACKEND/build/gen-ts"
FILES=(api.ts base.ts common.ts configuration.ts index.ts)

if [[ ! -x "$BACKEND/gradlew" ]]; then
  echo "No gradlew at $BACKEND — pass the backend repo path as the first argument." >&2
  exit 1
fi

echo "Generating the client from $BACKEND/doc/api.yml"
(cd "$BACKEND" && ./gradlew generateTsClient --console=plain -q)

if [[ ! -d "$GENERATED" ]]; then
  echo "Generator reported success but $GENERATED is missing." >&2
  exit 1
fi

mkdir -p "$TARGET"
for file in "${FILES[@]}"; do
  cp "$GENERATED/$file" "$TARGET/$file"
done

echo "Copied ${#FILES[@]} files into src/api-client. Review the diff before committing."
