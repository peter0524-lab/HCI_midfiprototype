#!/bin/bash

# Railway 백엔드 배포 스크립트
echo "🚂 Railway 백엔드 배포 시작..."

cd backend

# Railway 프로젝트 초기화 (처음만)
if [ ! -f ".railway" ]; then
    echo "📦 Railway 프로젝트 초기화 중..."
    railway init
fi

# 환경 변수 설정
echo "🔧 환경 변수 설정 중..."
railway variables set API_KEY=AIzaSyCJWzwhCar0-3npoJ0MwaRFd4Extt5Mo-w
railway variables set CORS_ORIGIN=*

# 배포
echo "🚀 배포 중..."
railway up

echo "✅ 백엔드 배포 완료!"
echo "📝 Railway 대시보드에서 URL을 확인하세요."

