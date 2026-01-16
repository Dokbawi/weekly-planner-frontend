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

## Claude Code 활용 사례

이 프로젝트는 [Claude Code](https://claude.ai/claude-code)를 활용하여 개발되었습니다.

### 활용 방식

#### 1. CLAUDE.md를 통한 컨텍스트 공유

프로젝트 루트에 `CLAUDE.md` 파일을 생성하여 Claude가 프로젝트 맥락을 이해할 수 있도록 했습니다.

```markdown
# CLAUDE.md 포함 내용
- 프로젝트 개요 및 상태
- 기술 스택 및 버전
- 프로젝트 구조
- API 통합 현황 및 워크어라운드
- 타입 정의
- 주요 컴포넌트 구현 예시
```

**효과**: Claude가 새 세션에서도 프로젝트 구조와 컨벤션을 즉시 파악하여 일관된 코드 생성 가능

#### 2. docs/ 서브모듈 연동

API 스펙 문서를 서브모듈로 관리하여 Claude가 참조할 수 있도록 했습니다.

```
docs/
├── api-contract.md          # REST API 스펙
├── backend-integration-guide.md  # 백엔드 연동 가이드
├── domain-model.md          # 도메인 모델
└── ui-spec.md               # UI 명세
```

**효과**: API 스펙과 프론트엔드 구현 간 불일치 발견 및 자동 수정

#### 3. 버그 수정 워크플로우

1. **에러 로그 공유** → Claude가 원인 분석
2. **관련 파일 탐색** → 영향 범위 파악
3. **수정 및 빌드 검증** → 컴파일 에러 확인
4. **커밋 & 푸시** → 변경사항 반영

```bash
# 실제 사용 예시
User: "Dashboard에서 Invalid time value 에러 발생"
Claude:
  1. 에러 위치 파악 (Dashboard.tsx:125)
  2. 원인 분석 (dailyPlans 배열/객체 형식 불일치)
  3. normalizeDailyPlans() 함수 구현
  4. 관련 컴포넌트 일괄 수정
  5. 빌드 검증 후 커밋
```

#### 4. 효율적이었던 작업들

| 작업 유형 | 설명 |
|-----------|------|
| **API 연동 수정** | 백엔드 스펙 변경 시 관련 파일 일괄 수정 |
| **데이터 정규화** | 백엔드/프론트엔드 데이터 형식 차이 해결 |
| **null 안전 처리** | 여러 컴포넌트에 걸친 방어 코드 추가 |
| **문서 업데이트** | 코드 변경과 문서 동기화 |
| **Git 작업** | 커밋 메시지 작성, 서브모듈 관리 |

#### 5. 권장 사용 패턴

```bash
# 1. CLAUDE.md 최신 상태 유지
# 변경사항이 생기면 Claude에게 문서 업데이트 요청

# 2. 에러 발생 시 콘솔 로그 전체 공유
# 부분이 아닌 전체 에러 스택 공유

# 3. 빌드 검증 요청
# 수정 후 "npm run build 해줘"로 검증

# 4. 커밋 단위 명확히
# "이 버그 수정하고 커밋 푸시해줘"
```

### 개발 통계

- **총 파일**: 89개 (11,000+ 줄)
- **주요 기능**: 8개 페이지, 30+ 컴포넌트
- **API 연동**: 20+ 엔드포인트
- **버그 수정**: 데이터 정규화, null 처리, API 메서드 등

## 관련 문서

- [CLAUDE.md](./CLAUDE.md) - 상세 개발 가이드 (Claude 컨텍스트용)
- [docs/api-contract.md](./docs/api-contract.md) - REST API 스펙
- [docs/backend-integration-guide.md](./docs/backend-integration-guide.md) - 백엔드 연동 가이드

## 라이선스

MIT
