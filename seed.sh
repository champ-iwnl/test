#!/bin/bash
set -euo pipefail

# ... Load .env ...
if [ -f .env ]; then export $(sed 's/\r$//' .env | grep -v '^#' | xargs); fi
export PGPASSWORD="$DB_PASSWORD"

psql "host=$DB_HOST dbname=$DB_NAME user=$DB_USER" -v ON_ERROR_STOP=1 <<EOF

\timing on
SET synchronous_commit = off;
SET work_mem = '1GB'; 
SET maintenance_work_mem = '1GB';

BEGIN;

-- 1. เตรียม Temp Table (เก็บข้อมูลดิบทั้งหมด รวมตัวซ้ำ)
DROP TABLE IF EXISTS players_tmp;
CREATE UNLOGGED TABLE players_tmp (
    nickname TEXT,
    points_gained INTEGER, -- เปลี่ยนชื่อให้สื่อความหมาย (ค่าจาก CSV คือแต้มที่ได้ต่อรอบ)
    created_at TIMESTAMPTZ
);

\echo '🚚 Streaming ALL playing history from CSV...'
-- โหลดทุกแถว ไม่มีการตัดทิ้ง
\copy players_tmp(nickname, points_gained, created_at) FROM 'mock_data.csv' CSV HEADER;

-- 2. สร้าง User ที่ยังไม่มีในระบบ (Register New Players)
\echo '👤 Registering new players...'
INSERT INTO players (nickname, total_points, created_at, updated_at)
SELECT DISTINCT ON (nickname)
       nickname,
       0, -- เริ่มต้นเป็น 0 ก่อน เดี๋ยวค่อยบวกยอดทีหลัง
       created_at,
       NOW()
FROM players_tmp
ON CONFLICT (nickname) DO NOTHING; 
-- ถ้ามีชื่ออยู่แล้ว ไม่ต้องทำอะไร (DO NOTHING) ข้ามไปขั้นตอนบวกเลขเลย

-- 3. บันทึกประวัติการเล่นทั้งหมด (Insert Spin Logs)
\echo '🎰 Recording Gameplay (One row per CSV line)...'
INSERT INTO spin_logs (
    id, 
    player_id, 
    points_gained, 
    source, 
    created_at
)
SELECT
    gen_random_uuid(),    -- สร้าง ID ใหม่ให้ทุก Transaction
    p.id,                 -- Map หา ID ของผู้เล่น
    t.points_gained,      -- ยอดที่เล่นได้ในรอบนั้นๆ
    'GAME',               -- Source: MOCK
    t.created_at
FROM players_tmp t
JOIN players p ON t.nickname = p.nickname;
-- ตรงนี้ไม่มี DISTINCT แล้ว! CSV มีกี่แถว ยัดลง Log หมดเลย

-- 4. อัปเดตยอดเงินรวมของ Players (Sum Points)
\echo '💰 Updating Players Total Balance (Accumulate)...'
-- รวมยอดจาก CSV ว่าแต่ละคนได้ไปเท่าไหร่ แล้วไปบวกทบ (++) ใส่ตาราง players
UPDATE players p
SET 
    total_points = p.total_points + sub.total_gained,
    updated_at = NOW()
FROM (
    -- คำนวณยอดรวมของแต่ละคนจากไฟล์ CSV นี้
    SELECT nickname, SUM(points_gained) as total_gained
    FROM players_tmp
    GROUP BY nickname
) sub
WHERE p.nickname = sub.nickname;

\echo '🧹 Cleaning up...'
DROP TABLE players_tmp;

COMMIT;

\echo '✅ DONE! Logs recorded & Player balances updated.'
EOF