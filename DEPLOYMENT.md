# 🚀 Production Deployment Guide

## ภาพรวมการ Deploy

แอปนี้ใช้ **Docker + Docker Compose** สำหรับ deployment ใน production บน Azure VM โดยมีขั้นตอนดังนี้:

1. **Build & Push Images** ใน local machine
2. **Deploy ใน VM Azure** ผ่าน SSH

## 📋 Prerequisites

- Azure VM (Ubuntu/Debian) พร้อม Docker & Docker Compose
- Azure PostgreSQL Database
- Git (สำหรับ clone repo)
- SSH access ถึง VM

## 🔧 ขั้นตอนการ Deploy

### Step 1: เตรียม Images (Local Machine)

```bash
# แก้ไข VM_IP ใน build-and-push.sh ก่อน
nano build-and-push.sh
# แก้ไข VM_IP="YOUR_VM_PUBLIC_IP"

# Build และ Push images
chmod +x build-and-push.sh
./build-and-push.sh
```

### Step 2: Deploy ใน VM Azure

```bash
# SSH เข้า VM
ssh user@YOUR_VM_IP

# Clone repository
git clone https://github.com/your-username/test.git
cd test

# แก้ไข .env สำหรับ production
nano .env
# Uncomment PRODUCTION VALUES section และเปลี่ยน YOUR_VM_PUBLIC_IP

# รัน deploy script
chmod +x deploy.sh
./deploy.sh

# หรือรัน manual commands:
mkdir -p ~/deploy
cd ~/deploy
cp ~/test/docker-compose.prod.yml .
cp ~/test/.env.production .env

# แก้ไข environment variables
nano .env
# แก้ไข:
# - NEXT_PUBLIC_API_URL=http://YOUR_VM_IP:8080
# - SWAGGER_EXTERNAL_URL=http://YOUR_VM_IP:8080
# - DB_HOST, DB_USER, DB_PASSWORD (ถ้าต่างจาก default)

# Pull และ run containers
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

## 🌐 URLs หลัง Deploy

- **Frontend**: http://YOUR_VM_IP:8000
- **Backend API**: http://YOUR_VM_IP:8080
- **Swagger Docs**: http://YOUR_VM_IP:8080/swagger/index.html
- **Health Check**: http://YOUR_VM_IP:8080/health

## 🔍 ตรวจสอบ Status

```bash
# ดู container status
docker compose -f docker-compose.prod.yml ps

# ดู logs
docker compose -f docker-compose.prod.yml logs -f

# Restart services
docker compose -f docker-compose.prod.yml restart
```

## ⚙️ Environment Variables

ตอนนี้รวม environment variables ทั้งหมดไว้ในไฟล์ `.env` เดียว

### สำหรับ Development:
- Uncomment DEVELOPMENT VALUES section ใน `.env`

### สำหรับ Production:
- Uncomment PRODUCTION VALUES section ใน `.env`
- แทนที่ `YOUR_VM_PUBLIC_IP` ด้วย IP จริง

| Section | Variable | Development | Production | Description |
|---------|----------|-------------|------------|-------------|
| Frontend | `NEXT_PUBLIC_API_URL` | http://localhost:8081 | http://VM_IP:8080 | Frontend API URL |
| Backend | `DB_HOST` | spinhead.postgres.database.azure.com | spinhead.postgres.database.azure.com | Database host |
| Backend | `SWAGGER_EXTERNAL_URL` | - | http://VM_IP:8080 | Swagger URL |

## 🛠️ Troubleshooting

### Container ไม่ start
```bash
# ดู logs
docker compose -f docker-compose.prod.yml logs

# ตรวจสอบ environment variables
cat ~/deploy/.env
```

### Database connection failed
```bash
# ตรวจสอบ database credentials ใน .env
# ตรวจสอบ Azure PostgreSQL firewall rules
```

### Frontend ไม่โหลด
```bash
# ตรวจสอบ NEXT_PUBLIC_API_URL ใน .env
# ตรวจสอบ backend service running
docker compose -f docker-compose.prod.yml ps backend
```

## 🔄 Update Deployment

```bash
# ใน local machine: rebuild และ push
./build-and-push.sh

# ใน VM: pull และ restart
cd ~/deploy
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```