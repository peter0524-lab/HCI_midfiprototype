#!/bin/bash

# Railway 프론트엔드 배포 스크립트
echo "🚂 Railway 프론트엔드 배포 시작..."

# 백엔드 URL 입력 받기
echo "백엔드 URL을 입력하세요 (예: https://hci-prototype-backend.railway.app):"
read BACKEND_URL

cd frontend

# Railway 프로젝트 초기화 (처음만)
if [ ! -f ".railway" ]; then
    echo "📦 Railway 프로젝트 초기화 중..."
    railway init
fi

# 환경 변수 설정
echo "🔧 환경 변수 설정 중..."
railway variables set VITE_API_URL=$BACKEND_URL

# 배포
echo "🚀 배포 중..."
railway up

echo "✅ 프론트엔드 배포 완료!"
echo "📝 Railway 대시보드에서 URL을 확인하세요."

