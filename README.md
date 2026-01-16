# Weekly Planner Frontend

주간 일정 관리 서비스의 React 웹 프론트엔드입니다.

## 주요 기능

- **대시보드** - 주간 계획 현황 요약, 오늘의 할 일 미리보기
- **오늘 할 일** - 날짜별 Task 관리 (추가/수정/삭제/완료)
- **주간 계획** - 드래그 앤 드롭으로 Task 이동, 계획 확정
- **주간 회고** - 완료율 통계, 변경 이력 타임라인
- **알림** - Task 리마인더, 읽음 처리
- **출퇴근 시간 계산** - 루틴 기반 출발 시간 역산

## 기술 스택

| 구분 | 기술 |
|------|------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Routing | React Router 6 |
| State | Zustand |
| HTTP | Axios |
| Styling | Tailwind CSS |
| UI | shadcn/ui |
| DnD | @dnd-kit |
| Charts | Recharts |
| Form | React Hook Form + Zod |
| Date | date-fns |

## 시작하기

### 요구사항

- Node.js 18+
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일에서 VITE_API_URL 설정
```

### 개발 서버

```bash
npm run dev
# http://localhost:3000
```

### 빌드

```bash
# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview
```

### 린트

```bash
npm run lint
```

## 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_API_URL` | 백엔드 API URL | `http://localhost:8080/api/v1` |

## 프로젝트 구조

```
src/
├── api/              # API 클라이언트 및 엔드포인트
├── components/       # React 컴포넌트
│   ├── ui/           # shadcn/ui 기본 컴포넌트
│   ├── layout/       # 레이아웃 컴포넌트
│   ├── task/         # Task 관련 컴포넌트
│   ├── plan/         # 주간 계획 컴포넌트
│   ├── review/       # 회고 컴포넌트
│   ├── notification/ # 알림 컴포넌트
│   ├── commute/      # 출퇴근 시간 컴포넌트
│   └── common/       # 공통 컴포넌트
├── pages/            # 페이지 컴포넌트
├── stores/           # Zustand 스토어
├── types/            # TypeScript 타입 정의
├── hooks/            # 커스텀 훅
├── lib/              # 유틸리티 함수
└── constants/        # 상수 정의
```

## 페이지 라우팅

| 경로 | 페이지 | 인증 필요 |
|------|--------|-----------|
| `/` | 대시보드 | O |
| `/today` | 오늘 할 일 | O |
| `/planning` | 주간 계획 | O |
| `/review` | 주간 회고 | O |
| `/notifications` | 알림 목록 | O |
| `/commute` | 출퇴근 시간 | O |
| `/settings` | 설정 | O |
| `/login` | 로그인 | X |
| `/register` | 회원가입 | X |

## 관련 문서

- [CLAUDE.md](./CLAUDE.md) - 상세 개발 가이드
- [docs/api-contract.md](./docs/api-contract.md) - REST API 스펙
- [docs/backend-integration-guide.md](./docs/backend-integration-guide.md) - 백엔드 연동 가이드

## 라이선스

MIT
