#!/bin/bash

# Railway 프론트엔드 배포 스크립트
echo "🚂 Railway 프론트엔드 배포 시작..."

# 백엔드 URL 입력 받기
echo "백엔드 URL을 입력하세요 (예: https://hcimidfiprototype-production.up.railway.app):"
read BACKEND_URL

cd frontend

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
railway variables --set "VITE_API_URL=$BACKEND_URL"

# 배포
echo "🚀 배포 중..."
railway up

# 도메인 생성
echo "🌐 공개 도메인 생성 중..."
railway domain

echo "✅ 프론트엔드 배포 완료!"
echo "📝 위에 표시된 URL로 접속할 수 있습니다."

