# คำสั่งสำหรับ Build และ Push Images
# รันใน local machine ก่อน deploy

# กำหนด VM Public IP (แก้ไขตามจริง)
VM_IP=${VM_IP:-"YOUR_VM_PUBLIC_IP"}

echo "Building with production URL: http://$VM_IP:8080"

# แจ้งให้ user แก้ไข .env ก่อน build
echo "⚠️  กรุณาแก้ไข .env ให้ uncomment PRODUCTION VALUES และเปลี่ยน YOUR_VM_PUBLIC_IP เป็น $VM_IP"
echo "   nano .env"
echo ""

read -p "Press enter เมื่อแก้ไข .env เสร็จแล้ว..."

## 1. Build images ด้วย production URL
echo "Building frontend with API URL: http://$VM_IP:8080"
docker compose build --build-arg NEXT_PUBLIC_API_URL=http://$VM_IP:8080 frontend

## 2. Build backend (ถ้าต้องการ)
echo "Building backend..."
docker compose build backend

## 3. Push images ไปยัง Docker Hub
echo "Pushing images to registry..."
docker push ppasinb/test-frontend:latest
docker push ppasinb/test-backend:latest

echo "✅ Images pushed successfully!"
echo ""
echo "📋 คำสั่งสำหรับ deploy ใน VM Azure:"
echo "  # SSH เข้า VM"
echo "  ssh user@$VM_IP"
echo ""
echo "  # Clone หรือ copy files"
echo "  git clone https://github.com/your-repo/test.git"
echo "  cd test"
echo ""
echo "  # รัน deploy script"
echo "  cd test"
echo "  chmod +x deploy.sh"
echo "  ./deploy.sh"
echo ""
echo "🌐 URLs:"
echo "  Frontend: http://$VM_IP:8000"
echo "  Backend API: http://$VM_IP:8080"
echo "  Swagger: http://$VM_IP:8080/swagger/index.html"
