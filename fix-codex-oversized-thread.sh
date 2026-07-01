#!/bin/zsh
set -euo pipefail

BAD="/Users/zhousaihan/.codex/sessions/2026/05/21/rollout-2026-05-21T11-42-29-019e48a0-aaa4-7d72-bb7c-5cf860268d33.jsonl"
STAMP="$(date +%Y%m%d-%H%M%S)-oversized-thread"
BACKUP_DIR="/Users/zhousaihan/.codex/quarantine/$STAMP"

if [[ ! -f "$BAD" ]]; then
  echo "The oversized Codex thread file was not found. Nothing to do."
  exit 0
fi

SIZE_BYTES="$(stat -f%z "$BAD")"
echo "Found Codex thread file: $BAD"
echo "Size: $SIZE_BYTES bytes"

mkdir -p "$BACKUP_DIR"

cp /Users/zhousaihan/.codex/state_5.sqlite "$BACKUP_DIR/state_5.sqlite.before-quarantine"
cp /Users/zhousaihan/.codex/config.toml "$BACKUP_DIR/config.toml.before-quarantine"

mv "$BAD" "$BACKUP_DIR/$(basename "$BAD")"

# Keep the original session metadata in place so Codex does not see a missing path.
head -n 1 "$BACKUP_DIR/$(basename "$BAD")" > "$BAD"

sqlite3 /Users/zhousaihan/.codex/state_5.sqlite "
update threads
set archived=1,
    archived_at=strftime('%s','now'),
    title='已隔离超大历史线程 - 原文件已备份',
    preview='这个线程文件异常增大到 16GB，已隔离备份以避免 Codex 执行任务时崩溃。'
where id='019e48a0-aaa4-7d72-bb7c-5cf860268d33';
"

echo
echo "Done. Original file was moved to:"
echo "$BACKUP_DIR/$(basename "$BAD")"
echo
echo "Now fully quit and reopen Codex."
