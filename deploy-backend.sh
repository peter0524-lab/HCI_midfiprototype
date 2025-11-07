#!/bin/bash

# Railway 백엔드 배포 스크립트
echo "🚂 Railway 백엔드 배포 시작..."

cd backend

# Railway 프로젝트 초기화 (처음만)
if [ ! -f ".railway" ]; then
    echo "📦 Railway 프로젝트 초기화 중..."
    railway init
fi

# 서비스 연결
echo "🔗 서비스 연결 중..."
railway service

# 환경 변수 설정 (올바른 문법)
echo "🔧 환경 변수 설정 중..."
railway variables --set "API_KEY=AIzaSyCJWzwhCar0-3npoJ0MwaRFd4Extt5Mo-w" --set "CORS_ORIGIN=*"

# 배포
echo "🚀 배포 중..."
railway up

# 도메인 생성/확인
echo "🌐 공개 도메인 확인 중..."
railway domain

echo "✅ 백엔드 배포 완료!"
echo "📝 위에 표시된 URL을 복사해서 프론트엔드 배포 시 사용하세요."

