# 🚂 Railway 배포 가이드

이 프로젝트를 Railway에 배포하는 방법입니다.

## 📋 사전 준비사항

- ✅ Railway 계정 (https://railway.app)
- ✅ Railway CLI 설치 완료
- ✅ Git 레포지토리 push 완료
- ✅ Google Gemini API 키: `AIzaSyCJWzwhCar0-3npoJ0MwaRFd4Extt5Mo-w`

## 🔧 1단계: Railway 로그인

```bash
railway login
```

브라우저가 열리면 GitHub 계정(`peter0524-lab`)으로 로그인하세요.

## 🎯 2단계: 백엔드 배포

```bash
cd backend
railway init
# 프로젝트 이름: hci-prototype-backend
railway up
```

### 환경 변수 설정

Railway 대시보드에서 설정하거나 CLI로 설정:

```bash
railway variables set API_KEY=AIzaSyCJWzwhCar0-3npoJ0MwaRFd4Extt5Mo-w
railway variables set CORS_ORIGIN=*
# 또는 프론트엔드 배포 후: railway variables set CORS_ORIGIN=https://your-frontend-url.railway.app
```

백엔드가 배포되면 URL을 복사하세요 (예: `https://hci-prototype-backend.railway.app`)

## 🎨 3단계: 프론트엔드 배포

```bash
cd ../frontend
railway init
# 프로젝트 이름: hci-prototype-frontend
```

### 환경 변수 설정

백엔드 URL을 환경 변수로 설정:

```bash
railway variables set VITE_API_URL=https://hci-prototype-backend.railway.app
```

### 배포

```bash
railway up
```

## ✅ 4단계: 배포 확인

### 백엔드 헬스체크

```bash
curl https://your-backend-url.railway.app/health
```

### 프론트엔드 접속

브라우저에서 `https://your-frontend-url.railway.app` 접속

## 🔄 재배포 방법

코드 수정 후:

```bash
# 백엔드 재배포
cd backend
railway up

# 프론트엔드 재배포
cd ../frontend
railway up
```

또는 Git push로 자동 배포 (Railway GitHub 연동 시):

```bash
git add .
git commit -m "업데이트"
git push
```

## 📝 환경 변수 요약

### Backend

- `API_KEY`: Google Gemini API 키 (필수)
- `CORS_ORIGIN`: 프론트엔드 URL (예: `*` 또는 구체적 URL)
- `PORT`: 자동 설정 (Railway가 제공)

### Frontend

- `VITE_API_URL`: 백엔드 URL (꼭 설정해야 함!)

## 🐛 트러블슈팅

### 빌드 실패 시

```bash
# 로컬에서 먼저 테스트
cd backend
npm install
npm run build
npm start

cd ../frontend
npm install
npm run build
npm start
```

### 로그 확인

```bash
railway logs
```

### 환경 변수 확인

```bash
railway variables
```

## 🌐 접속 정보

배포 완료 후 Railway 대시보드에서 URL 확인:

- Backend: `https://[project-name].railway.app`
- Frontend: `https://[project-name].railway.app`

---

**작성자**: taehwan (@peter0524-lab)
**날짜**: 2025-11-07
