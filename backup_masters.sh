#!/usr/bin/env bash
# backup_masters.sh — copies raw WAV/AIFF masters to cloud storage.
# Requires rclone installed and configured with a remote (e.g. Google Drive)
# before this script works: https://rclone.org/drive/
#
# This is NOT automatic. It runs only when you execute it manually.
# No scheduler exists in this setup — cron or a cloud function would be
# needed for true automation, and both require infrastructure outside
# this project.
#
# Usage: ./tools/backup_masters.sh /path/to/masters/folder your-remote-name

set -e

SOURCE="$1"
REMOTE="$2"

if [ -z "$SOURCE" ] || [ -z "$REMOTE" ]; then
  echo "Usage: $0 <source_folder> <rclone_remote_name>"
  exit 1
fi

rclone copy "$SOURCE" "$REMOTE:nevere-masters" --progress
echo "Backup complete: $SOURCE -> $REMOTE:nevere-masters"
