# HCI Prototype - AI Gift Assistant

비즈니스 전문가를 위한 AI 기반 선물 추천 시스템

## 🏗️ 프로젝트 구조

```
HCI_prototype/
├── frontend/          # React + Vite 프론트엔드
├── backend/           # Node.js + Express 백엔드
└── package.json       # 모노레포 통합 스크립트
```

## 🚀 시작하기

### 1. 의존성 설치

```bash
# 루트에서 모든 패키지 설치
npm run install:all

# 또는 개별 설치
cd frontend && npm install
cd ../backend && npm install
```

### 2. 환경변수 설정

**Backend `.env` 파일 생성:**

```bash
cd backend
cp .env.example .env
# .env 파일을 열어서 GEMINI_API_KEY 입력
```

**Frontend `.env.local` 파일 (이미 생성됨):**

```
VITE_API_URL=http://localhost:3001
```

### 3. 개발 서버 실행

```bash
# 루트에서 프론트엔드 + 백엔드 동시 실행
npm run dev

# 또는 개별 실행
npm run dev:frontend  # http://localhost:3000
npm run dev:backend   # http://localhost:3001
```

## 📦 주요 기능

- ✨ **AI 선물 추천**: Gemini API를 활용한 맞춤형 선물 추천
- 📇 **연락처 관리**: 비즈니스 인맥 관리
- 💬 **채팅 기반 UI**: 자연스러운 대화형 인터페이스
- 📸 **명함 OCR**: 명함 스캔을 통한 자동 연락처 추가
- 📅 **일정 관리**: 이벤트 및 기념일 관리
- 🎁 **선물 히스토리**: 과거 선물 내역 추적

## 🛠️ 기술 스택

### Frontend

- React 19.2
- TypeScript
- Vite
- Framer Motion (애니메이션)
- Axios (HTTP 클라이언트)

### Backend

- Node.js
- Express
- TypeScript
- Google Generative AI (Gemini)
- CORS

## 📡 API 엔드포인트

### 연락처

- `GET /api/contacts` - 전체 조회
- `GET /api/contacts/:id` - 단일 조회
- `POST /api/contacts` - 생성
- `PUT /api/contacts/:id` - 수정
- `DELETE /api/contacts/:id` - 삭제

### 선물

- `POST /api/gifts/recommend` - AI 추천
- `POST /api/gifts/:contactId` - 히스토리 추가
- `POST /api/gifts/ocr/scan` - 명함 OCR

### 채팅

- `GET /api/chats` - 전체 대화 목록
- `GET /api/chats/:contactId` - 특정 대화
- `POST /api/chats/:contactId` - 대화 저장

### 일정

- `GET /api/events` - 전체 조회
- `POST /api/events` - 생성
- `PUT /api/events/:id` - 수정
- `DELETE /api/events/:id` - 삭제

### 인증

- `POST /api/auth/login` - 로그인
- `GET /api/auth/profile` - 프로필 조회
- `PUT /api/auth/profile` - 프로필 수정

## 📝 개발 가이드

### 프론트엔드 개발

```bash
cd frontend
npm run dev
```

- Components는 `src/components/`에 카테고리별로 구성
- API 호출은 `src/services/` 사용
- 타입 정의는 `src/types/index.ts`

### 백엔드 개발

```bash
cd backend
npm run dev  # nodemon으로 자동 재시작
```

- Routes는 `src/routes/`
- Controllers는 `src/controllers/`
- Models는 `src/models/` (메모리 기반)
- Services는 `src/services/` (외부 API 연동)

## 🔧 빌드

```bash
# 프론트엔드 + 백엔드 빌드
npm run build

# 개별 빌드
npm run build:frontend  # dist/ 폴더에 생성
npm run build:backend   # dist/ 폴더에 생성
```

## 🐛 문제 해결

### 포트가 이미 사용 중인 경우

```bash
# 3000 포트 프로세스 종료
lsof -ti:3000 | xargs kill -9

# 3001 포트 프로세스 종료
lsof -ti:3001 | xargs kill -9
```

### CORS 에러

- `backend/.env`의 `CORS_ORIGIN`이 올바른지 확인
- 프론트엔드 주소와 일치해야 함 (기본: http://localhost:3000)

### API 연결 실패

- 백엔드 서버가 실행 중인지 확인
- `frontend/.env.local`의 `VITE_API_URL` 확인

## 🚀 Railway 배포

### 자동 배포 스크립트 사용

1. **Railway에 로그인**
```bash
railway login
```

2. **백엔드 배포**
```bash
./deploy-backend.sh
```

3. **프론트엔드 배포**
```bash
./deploy-frontend.sh
# 백엔드 URL 입력 (Railway 대시보드에서 확인)
```

### 수동 배포

자세한 배포 가이드는 [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md)를 참고하세요.

## 📄 라이선스

MIT License

## 👥 기여

프로토타입 프로젝트입니다.

**작성자**: taehwan (@peter0524-lab)

---

**Note**: 현재는 메모리 기반 데이터 저장을 사용합니다. 서버 재시작 시 데이터가 초기화됩니다.
