#!/usr/bin/env bash
# Fetch only maintainer-supplied, authorised media. No third-party mirror/plugin execution.
set -euo pipefail
OUT=research/youtube
mkdir -p "$OUT" /tmp/yt
IN=$(find research/youtube/input -maxdepth 1 -type f 2>/dev/null | grep -Ei '\.(mp3|m4a|wav|mp4|webm|mov|aac|ogg|opus)$' | head -1 || true)
if [ -n "$IN" ]; then
  cp -- "$IN" /tmp/yt/input-media
elif [ -n "${MEDIA_URL:-}" ]; then
  case "$MEDIA_URL" in https://*) ;; *) echo 'MEDIA_URL must use HTTPS' >&2; exit 1 ;; esac
  curl --fail --location --proto '=https' --proto-redir '=https' --max-time 300 --max-filesize 524288000 --output /tmp/yt/input-media -- "$MEDIA_URL"
else
  echo '請提供有權使用的影音網址或 research/youtube/input/ 本機檔案。' > "$OUT/STATUS.txt"
  exit 0
fi
ffmpeg -nostdin -loglevel error -y -i /tmp/yt/input-media -ac 1 -ar 16000 /tmp/yt/audio16k.wav
ffprobe -v error -show_entries format=duration -of csv=p=0 /tmp/yt/audio16k.wav > "$OUT/duration.txt"
printf 'audio ready for transcription\n' > "$OUT/STATUS.txt"
