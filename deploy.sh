# Production Deployment Script for Azure VM
# รันใน VM Azure (Ubuntu/Debian) หลังจาก clone repo แล้ว

#!/bin/bash

echo "🚀 Starting Production Deployment..."

# สร้าง directory สำหรับ deploy
mkdir -p ~/deploy
cd ~/deploy

# Copy ไฟล์ที่จำเป็นจาก repo
cp ~/test/docker-compose.prod.yml .
cp ~/test/.env .

echo "📝 กำหนด Environment Variables สำหรับ Production"
echo "แก้ไขไฟล์ .env ตามความเหมาะสม:"
echo "  - Uncomment PRODUCTION VALUES section"
echo "  - แทนที่ YOUR_VM_PUBLIC_IP ด้วย VM IP จริง"
echo "  - DB_HOST, DB_USER, DB_PASSWORD (ถ้าต่างจาก default)"

# แสดงตัวอย่างการแก้ไข
echo ""
echo "ตัวอย่างการแก้ไข .env:"
echo "nano .env"
echo "  # Uncomment บรรทัดเหล่านี้:"
echo "  # NEXT_PUBLIC_API_URL=http://YOUR_VM_PUBLIC_IP:8080"
echo "  # SWAGGER_EXTERNAL_URL=http://YOUR_VM_PUBLIC_IP:8080"
echo "  # และเปลี่ยน YOUR_VM_PUBLIC_IP เป็น IP จริง"
echo ""
echo "# หลังแก้ไขแล้ว รันคำสั่งต่อไปนี้:"
echo "docker compose -f docker-compose.prod.yml pull"
echo "docker compose -f docker-compose.prod.yml up -d"
echo ""
echo "✅ Deployment Complete!"
echo "🌐 Frontend: http://YOUR_VM_IP:8000"
echo "🔧 Backend API: http://YOUR_VM_IP:8080"
echo "📚 Swagger Docs: http://YOUR_VM_IP:8080/swagger/index.html"