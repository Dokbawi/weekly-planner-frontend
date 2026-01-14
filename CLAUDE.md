# Weekly Planner - Frontend

React + TypeScript 기반 웹 프론트엔드

## 프로젝트 상태

**구현 완료** ✅ - 2025년 12월 22일
**API 통합 수정** 🔧 - 2025년 12월 28일
**데이터 정규화 추가** 🔧 - 2026년 1월 14일

모든 핵심 기능이 구현되었으며, 추가로 출퇴근 시간 계산 기능이 포함되었습니다.
백엔드 API 스펙에 맞춰 프론트엔드 API 호출을 전면 수정했습니다.
백엔드 응답 형식(배열)을 프론트엔드 형식(객체)으로 정규화하는 로직이 추가되었습니다.

## Quick Start

```bash
# 의존성 설치
npm install

# 개발 서버 실행 (http://localhost:3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 미리보기
npm run preview

# 린트 검사
npm run lint
```

### 환경 변수 설정

`.env` 파일을 생성하여 백엔드 API URL을 설정하세요:

```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 최근 변경사항 (2026-01-14)

- **데이터 정규화 로직 추가**
  - `normalizeDailyPlans()`: dailyPlans 배열 → 객체 변환 (plans.ts)
  - `normalizeReview()`: dailyBreakdown 배열 → 객체 변환 (reviews.ts)
  - plan 목록 조회 후 상세 조회(`getById`)로 전체 데이터 확보
  - null/undefined 데이터 안전 처리 (Notifications, Review 컴포넌트)

- **API 메서드 수정**
  - 알림 API: 읽음 처리 PUT 메서드 사용 (api-contract.md 기준)
  - Task API: `reminderMinutesBefore` 필드 사용 (이전: `reminderMinutes`)

### 이전 변경사항 (2025-12-28)

- **API 통합 수정**
  - JWT 토큰: `token` → `accessToken` 필드명 변경
  - Task API: 모든 엔드포인트에 `planId` 파라미터 필수 추가
  - Task 생성: `date`를 query parameter로 전달 (`/plans/{planId}/tasks?date=yyyy-MM-dd`)
  - 백엔드 미구현 엔드포인트 자동 폴백 제거:
    - `/plans/current` → `/plans` 목록에서 현재 주 찾기
    - `/today` → `/plans` 목록에서 현재 주 찾기
    - `/reviews/current` → `/reviews` 목록에서 현재 주 찾기

- **테스트 파일 추가**
  - `test-api.js` - Node.js 기반 API 테스트 스크립트
  - `test-api-endpoints.html` - 브라우저 기반 API 테스트 페이지

- **서브모듈 설정**
  - `docs/` 서브모듈 정상 연결 확인
  - API 스펙, UI 스펙, 도메인 모델 참조 가능

## 프로젝트 개요

주간 일정 관리 서비스의 웹 프론트엔드입니다.
상세 스펙은 `docs/` 서브모듈을 참조하세요.

### 참조 문서 (docs/ 서브모듈)
- `docs/api-contract.md` - REST API 스펙
- `docs/ui-spec.md` - 화면 명세
- `docs/domain-model.md` - 도메인 모델 (타입 정의용)

## 구현된 주요 기능

### 인증 & 사용자 관리
- 회원가입 / 로그인
- JWT 토큰 기반 인증
- Protected Routes / Public Routes
- 자동 로그인 (localStorage)

### 대시보드
- 주간 계획 현황 요약
- 오늘의 할 일 미리보기
- 알림 목록

### 오늘 할 일 (Today)
- 날짜별 Task 목록 조회
- Task 추가/수정/삭제
- 완료 상태 토글
- 다른 날로 이동
- 우선순위 설정

### 주간 계획 (Planning)
- 주간 캘린더 뷰 (7일)
- 드래그 앤 드롭으로 Task 이동
- 계획 확정 기능
- 일별 Task 관리

### 주간 회고 (Review)
- 통계 요약 (완료율, 취소율, 변경 횟수)
- 일별 완료율 차트
- 변경 유형별 분석 차트
- 변경 이력 타임라인

### 알림 (Notifications)
- 알림 목록 조회
- 읽음 처리
- 헤더 알림 배지

### 출퇴근 시간 계산 (Commute) - NEW!
- 루틴 생성/수정/삭제
- 단계별 시간 설정 (준비, 도보, 버스, 지하철 등)
- 도착 시간 기준 출발 시간 역산
- 드래그 앤 드롭으로 단계 순서 변경
- 로컬 스토리지 저장 (백엔드 연동 선택적)

### 설정 (Settings)
- 프로필 정보 수정
- 비밀번호 변경
- 계정 삭제

---

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| Framework | React | 18+ |
| Language | TypeScript | 5+ |
| Build | Vite | 5+ |
| Routing | React Router | 6+ |
| State | Zustand | 5+ |
| HTTP | Axios | 1+ |
| Styling | Tailwind CSS | 3+ |
| UI Components | shadcn/ui | - |
| Icons | Lucide React | - |
| DnD | @dnd-kit | 6+ |
| Date | date-fns | 3+ |
| Form | React Hook Form + Zod | - |
| Charts | Recharts | 2+ |

---

## 프로젝트 구조

```
# 프로젝트 루트
.
├── src/                         # 소스 코드
├── docs/                        # 서브모듈 (스펙 문서)
├── test-api.js                  # Node.js API 테스트 스크립트
├── test-api-endpoints.html      # 브라우저 API 테스트 페이지
└── ...

src/
├── main.tsx
├── App.tsx
├── index.css                    # Tailwind 설정
│
├── api/
│   ├── client.ts                # Axios 인스턴스 + 인터셉터
│   ├── auth.ts                  # 인증 API
│   ├── plans.ts                 # 주간 계획 API (워크어라운드 포함)
│   ├── tasks.ts                 # Task API (planId 필수)
│   ├── notifications.ts         # 알림 API
│   ├── reviews.ts               # 회고 API (워크어라운드 포함)
│   ├── today.ts                 # 오늘 할 일 API (워크어라운드 포함)
│   └── commute.ts               # 출퇴근 시간 API
│
├── types/
│   ├── index.ts                 # 공통 타입 export
│   ├── user.ts
│   ├── plan.ts
│   ├── task.ts
│   ├── changelog.ts
│   ├── notification.ts
│   ├── review.ts
│   ├── api.ts                   # API 응답 타입
│   └── commute.ts               # 출퇴근 루틴 타입
│
├── stores/
│   ├── authStore.ts             # 인증 상태
│   ├── planStore.ts             # 현재 주간 계획
│   ├── notificationStore.ts     # 알림 상태
│   ├── commuteStore.ts          # 출퇴근 루틴 상태
│   └── uiStore.ts               # UI 상태 (사이드바, 모달 등)
│
├── hooks/
│   └── useToast.ts              # Toast 알림 훅
│
├── components/
│   ├── ui/                      # shadcn/ui 컴포넌트
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── checkbox.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   │
│   ├── layout/
│   │   ├── Layout.tsx           # 전체 레이아웃
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   │
│   ├── task/
│   │   ├── TaskItem.tsx         # 단일 Task
│   │   ├── TaskList.tsx         # Task 목록
│   │   ├── TaskForm.tsx         # 추가/수정 폼
│   │   └── TaskMoveDialog.tsx   # 이동 모달
│   │
│   ├── plan/
│   │   ├── WeekCalendar.tsx     # 주간 캘린더 뷰
│   │   ├── DayColumn.tsx        # 일별 컬럼
│   │   ├── ConfirmDialog.tsx    # 확정 확인 모달
│   │   └── PlanStatusBadge.tsx
│   │
│   ├── review/
│   │   ├── StatsSummary.tsx     # 통계 요약 카드
│   │   ├── CompletionChart.tsx  # 완료율 차트
│   │   ├── ChangeTimeline.tsx   # 변경 이력 타임라인
│   │   └── ChangeTypeChart.tsx  # 변경 유형별 차트
│   │
│   ├── notification/
│   │   ├── NotificationBadge.tsx
│   │   ├── NotificationDropdown.tsx
│   │   └── NotificationItem.tsx
│   │
│   ├── commute/                 # 출퇴근 시간 계산
│   │   ├── RoutineCard.tsx      # 루틴 카드
│   │   ├── RoutineForm.tsx      # 루틴 폼
│   │   ├── StepEditor.tsx       # 단계 편집기
│   │   ├── TimeCalculator.tsx   # 시간 계산기
│   │   └── ScheduleDisplay.tsx  # 스케줄 표시
│   │
│   └── common/
│       ├── LoadingSpinner.tsx
│       ├── ErrorMessage.tsx
│       ├── EmptyState.tsx
│       └── ProgressBar.tsx
│
├── pages/
│   ├── Dashboard.tsx            # /
│   ├── Today.tsx                # /today
│   ├── Planning.tsx             # /planning
│   ├── Review.tsx               # /review
│   ├── Notifications.tsx        # /notifications
│   ├── Commute.tsx              # /commute (출퇴근 시간 계산)
│   ├── Settings.tsx             # /settings
│   ├── Login.tsx                # /login
│   └── Register.tsx             # /register
│
├── lib/
│   ├── utils.ts                 # cn() 등 유틸
│   └── date.ts                  # 날짜 유틸
│
└── constants/
    ├── routes.ts
    └── config.ts
```

---

## API 통합 현황 및 워크어라운드

### 백엔드 미구현 엔드포인트

다음 엔드포인트들은 백엔드에 아직 구현되지 않았습니다:

1. **`GET /plans/current`** - 현재 주간 계획 조회
   - **워크어라운드**: `GET /plans` 목록을 가져와서 `weekStartDate`가 현재 주에 해당하는 plan 찾기
   - **구현 위치**: `src/api/plans.ts`

2. **`GET /today`** - 오늘의 할 일 조회
   - **워크어라운드**: `GET /plans`로 현재 주 plan을 찾고 `dailyPlans`에서 오늘 날짜 추출
   - **구현 위치**: `src/api/today.ts`

3. **`GET /reviews/current`** - 현재 주 회고 조회
   - **워크어라운드**: `GET /reviews` 목록을 가져와서 `weekStartDate`가 현재 주에 해당하는 review 찾기
   - **구현 위치**: `src/api/reviews.ts`

### Task API 필수 파라미터

모든 Task 관련 API는 `planId`를 필수로 요구합니다:

```typescript
// Task 생성 - date를 query parameter로 전달
POST /plans/{planId}/tasks?date=yyyy-MM-dd
{
  "title": "할 일",
  "description": "설명",
  "priority": "MEDIUM"
  // ... 기타 필드
}

// Task 수정
PUT /plans/{planId}/tasks/{taskId}
{
  "title": "수정된 제목",
  "reason": "변경 사유"
}

// Task 상태 변경
PUT /plans/{planId}/tasks/{taskId}
{
  "status": "COMPLETED",
  "reason": "완료"
}

// Task 이동
POST /plans/{planId}/tasks/{taskId}/move
{
  "targetDate": "2025-12-30",
  "reason": "다음 날로 이동"
}

// Task 삭제
DELETE /plans/{planId}/tasks/{taskId}?reason=삭제사유
```

### 알림 API 변경

알림 읽음 처리는 PUT 메서드를 사용합니다 (api-contract.md 기준):

```typescript
PUT /notifications/{id}/read
PUT /notifications/read-all
```

### 인증 토큰 필드명

로그인/회원가입 응답에서 토큰 필드명이 변경되었습니다:

```typescript
// 응답 구조
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",  // 이전: "token"
    "user": {
      "id": "user-id",
      "email": "user@example.com",
      "name": "사용자"
    }
  }
}
```

### 백엔드 응답 데이터 정규화

백엔드에서 `dailyPlans`가 **배열**로 오지만 프론트엔드는 **객체(Record)**를 기대합니다.
이를 위해 `normalizeDailyPlans()` 함수로 변환합니다:

```typescript
// 백엔드 응답 (배열)
dailyPlans: [
  { date: '2026-01-12', tasks: [] },
  { date: '2026-01-13', tasks: [...] },
]

// 프론트엔드 기대 (객체)
dailyPlans: {
  '2026-01-12': { date: '...', tasks: [] },
  '2026-01-13': { date: '...', tasks: [...] },
}
```

**구현 위치:**
- `src/api/plans.ts`: `normalizeDailyPlans()` 함수
- `src/api/reviews.ts`: `normalizeReview()` 함수

**주의:** plan을 가져올 때 목록 API(`GET /plans`)는 `dailyPlans` 상세 정보를 포함하지 않을 수 있으므로, `getCurrent()` 후 `getById()`로 상세 조회합니다.

### 백엔드 TODO

프론트엔드가 정상적으로 작동하려면 다음 엔드포인트를 백엔드에 구현해야 합니다:

- [ ] `GET /plans/current` - 현재 주간 계획 직접 조회
- [ ] `GET /today` - 오늘의 할 일 직접 조회
- [ ] `GET /reviews/current` - 현재 주 회고 직접 조회

또는 현재의 워크어라운드(목록 조회 후 필터링)를 계속 사용할 수 있습니다.

---

## 타입 정의 (types/)

### task.ts
```typescript
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface ReminderSettings {
  enabled: boolean;
  minutesBefore: number;
  notifiedAt?: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  scheduledTime?: string;      // "HH:mm"
  estimatedMinutes?: number;
  reminder?: ReminderSettings;
  status: TaskStatus;
  priority: Priority;
  tags: string[];
  order: number;
  createdAt: string;
  completedAt?: string;
}

export interface CreateTaskRequest {
  date: string;                // "yyyy-MM-dd"
  title: string;
  description?: string;
  scheduledTime?: string;
  estimatedMinutes?: number;
  reminder?: {
    enabled: boolean;
    minutesBefore: number;
  };
  priority?: Priority;
  tags?: string[];
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  scheduledTime?: string;
  estimatedMinutes?: number;
  reminder?: ReminderSettings;
  priority?: Priority;
  tags?: string[];
  reason?: string;             // 변경 사유 (선택)
}
```

### plan.ts
```typescript
import { Task } from './task';

export type PlanStatus = 'DRAFT' | 'CONFIRMED' | 'COMPLETED';
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';

export interface DailyPlan {
  date: string;
  dayOfWeek: DayOfWeek;
  tasks: Task[];
  memo?: string;
}

export interface WeeklyPlan {
  id: string;
  weekStartDate: string;
  weekEndDate: string;
  status: PlanStatus;
  dailyPlans: Record<string, DailyPlan>;  // key: "yyyy-MM-dd"
  confirmedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### changelog.ts
```typescript
export type ChangeType =
  | 'TASK_CREATED'
  | 'TASK_UPDATED'
  | 'TASK_DELETED'
  | 'STATUS_CHANGED'
  | 'TIME_CHANGED'
  | 'MOVED_TO_ANOTHER_DAY'
  | 'PRIORITY_CHANGED';

export interface FieldChange {
  field: string;
  previousValue?: string;
  newValue?: string;
}

export interface ChangeLog {
  id: string;
  targetDate: string;
  taskId: string;
  taskTitle: string;
  changeType: ChangeType;
  changes: FieldChange[];
  reason?: string;
  changedAt: string;
}
```

### commute.ts
```typescript
export type StepType = 'prepare' | 'walk' | 'bus' | 'subway' | 'taxi' | 'car' | 'bike' | 'other'

export interface CommuteStep {
  id: string
  label: string
  durationMinutes: number
  type: StepType
  order: number
}

export interface CommuteRoutine {
  id: string
  name: string
  destination: string
  steps: CommuteStep[]
  totalMinutes: number
  defaultArrivalTime?: string
  createdAt: string
  updatedAt: string
}

export interface CalculateResponse {
  routineId: string
  arrivalTime: string
  offsetMinutes: number
  schedule: ScheduleStep[]
  departureTime: string
  totalMinutes: number
}

export interface ScheduleStep {
  stepId: string
  label: string
  type: StepType
  startTime: string  // "HH:mm"
  endTime: string    // "HH:mm"
  durationMinutes: number
}
```

---

## 상태 관리 (stores/)

### authStore.ts

JWT 토큰 기반 인증 상태 관리 (Zustand + persist middleware)

**구현 파일**: `src/stores/authStore.ts`

```typescript
// src/stores/authStore.ts:14-26
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      // ...
    }),
    { name: 'auth-storage' }
  )
)
```

### planStore.ts

주간 계획 상태 관리 (Zustand)

**구현 파일**: `src/stores/planStore.ts` (lines 19-124)

주요 기능:
- `setPlan`: 현재 주간 계획 설정
- `updateTask`: 특정 날짜의 Task 업데이트
- `addTask`: 특정 날짜에 Task 추가
- `removeTask`: Task 삭제
- `moveTask`: Task를 다른 날짜로 이동

전체 구현은 파일 참조.

---

## API 클라이언트 (api/)

### client.ts

Axios 인스턴스 + 인터셉터 설정

**구현 파일**: `src/api/client.ts` (lines 1-33)

주요 기능:
- Request 인터셉터: JWT 토큰 자동 추가
- Response 인터셉터: 401 에러 시 자동 로그아웃

```typescript
// src/api/client.ts:13-21
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

### tasks.ts

Task API 호출 함수들 (모든 엔드포인트는 planId 필수)

**구현 파일**: `src/api/tasks.ts` (lines 4-38)

```typescript
// src/api/tasks.ts:10-17
create: (planId: string, date: string, data: Omit<CreateTaskRequest, 'date'>) =>
  apiClient.post(`/plans/${planId}/tasks?date=${date}`, data),

update: (planId: string, taskId: string, data: UpdateTaskRequest) =>
  apiClient.put(`/plans/${planId}/tasks/${taskId}`, data),
// ...
```

---

## 주요 컴포넌트 구현

### TaskItem.tsx

개별 Task 항목 컴포넌트

**구현 파일**: `src/components/task/TaskItem.tsx` (lines 39-116)

주요 기능:
- 체크박스로 완료 상태 토글
- 드래그 핸들 (DnD 지원)
- 시간, 우선순위, 알림 표시
- 수정/이동/삭제 드롭다운 메뉴

```tsx
// src/components/task/TaskItem.tsx:54-69
<div className={cn(
  'flex items-center gap-3 p-3 bg-white rounded-lg border',
  isCompleted && 'opacity-60',
  isDragging && 'shadow-lg ring-2 ring-primary/20'
)}>
  <div {...dragHandleProps}>
    <GripVertical className="h-4 w-4 text-gray-400" />
  </div>
  <Checkbox checked={isCompleted} onCheckedChange={handleCheckChange} />
  {/* ... 전체 구현은 파일 참조 */}
</div>
```

### ChangeTimeline.tsx

변경 이력 타임라인 컴포넌트

**구현 파일**: `src/components/review/ChangeTimeline.tsx` (lines 59-142)

주요 기능:
- 날짜별로 변경 이력 그룹핑 (lines 60-68)
- 변경 타입별 아이콘 표시 (lines 18-57)
- 변경 사유 표시

```tsx
// src/components/review/ChangeTimeline.tsx:100-123
const getChangeDescription = (): string => {
  switch (log.changeType) {
    case 'STATUS_CHANGED':
      return '완료 처리' // or '취소됨'
    case 'TIME_CHANGED':
      return `시간 변경 (이전 → 새로운)`
    // ...
  }
}
```

---

## 페이지 구현

### Today.tsx

오늘의 할 일 페이지

**구현 파일**: `src/pages/Today.tsx` (lines 18-245)

주요 기능:
- 날짜 네비게이션 (이전/다음 날) - lines 175-188
- Task 목록 표시 - lines 191-197
- Task 추가/수정/이동/삭제 - lines 52-151
- 일일 메모 작성 - lines 206-217

```tsx
// src/pages/Today.tsx:52-61
const handleStatusChange = async (taskId: string, status: TaskStatus) => {
  if (!currentPlan) return
  try {
    await taskApi.updateStatus(currentPlan.id, taskId, status)
    loadPlan()
  } catch (error) {
    toast({ variant: 'destructive', title: '상태 변경 실패' })
  }
}
```

### Review.tsx

주간 회고 페이지

**구현 파일**: `src/pages/Review.tsx` (lines 15-99)

주요 기능:
- 주간 회고 데이터 로드 - lines 25-39
- 통계 요약 표시 - line 65
- 일별 완료율 차트 - lines 69-76
- 변경 유형별 차트 - lines 78-85
- 변경 이력 타임라인 - lines 89-96

### Commute.tsx

출퇴근 시간 계산 페이지

**구현 파일**: `src/pages/Commute.tsx` (lines 9-144)

주요 기능:
- 루틴 목록 관리 - lines 82-109
- 시간 계산기 - lines 113-124
- 루틴 추가/수정 폼 - lines 16-52, 128-141

출퇴근 시간 계산 기능:
- 루틴을 단계별로 등록 (준비, 도보, 버스, 지하철 등)
- 도착 시간 입력 시 출발 시간 자동 역산
- 여유 시간(offset) 조정
- 드래그 앤 드롭으로 단계 순서 변경
- 로컬 스토리지에 루틴 저장

---

## 드래그 앤 드롭 (주간 계획)

### WeekCalendar.tsx

@dnd-kit을 사용한 주간 캘린더 뷰 (Task 드래그 앤 드롭)

**구현 파일**: `src/components/plan/WeekCalendar.tsx` (lines 28-116)

주요 기능:
- DndContext로 드래그 앤 드롭 컨텍스트 설정 - lines 79-84
- 드래그 시작 시 activeTask 설정 - lines 56-61
- 드래그 종료 시 Task 이동 API 호출 - lines 63-76
- 7일 캘린더 그리드 렌더링 - lines 85-97
- DragOverlay로 드래그 중인 Task 표시 - lines 100-113

```tsx
// src/components/plan/WeekCalendar.tsx:48-54
const findTask = (taskId: string): { task: Task; date: string } | null => {
  for (const [date, dailyPlan] of Object.entries(plan.dailyPlans)) {
    const task = dailyPlan.tasks.find((t) => t.id === taskId)
    if (task) return { task, date }
  }
  return null
}
```

---

## 라우팅 설정

### App.tsx

React Router 기반 라우팅 설정

**구현 파일**: `src/App.tsx` (lines 35-103)

주요 기능:
- PrivateRoute: 인증된 사용자만 접근 가능 (lines 15-23)
- PublicRoute: 미인증 사용자만 접근 가능 (lines 25-33)
- 중첩 라우팅: Layout 안에 보호된 페이지들 (lines 80-96)

```tsx
// src/App.tsx:15-23
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

// src/App.tsx:25-33
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? <Navigate to="/" replace /> : <>{children}</>
}
```

---

## 환경 설정

### .env
```env
VITE_API_URL=http://localhost:8080/api/v1
```

### .env.production
```env
VITE_API_URL=https://api.your-domain.com/api/v1
```

### vite.config.ts
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
```

### tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

---

## 구현 현황

### ✅ Phase 1: 기본 구조 (완료)
1. ✅ Vite + React + TypeScript 프로젝트 생성
2. ✅ Tailwind CSS + shadcn/ui 설정
3. ✅ 라우팅 설정
4. ✅ API 클라이언트 + Zustand 스토어

### ✅ Phase 2: 인증 (완료)
5. ✅ 로그인/회원가입 페이지
6. ✅ 인증 상태 관리
7. ✅ Protected Route + Public Route

### ✅ Phase 3: 핵심 기능 (완료)
8. ✅ 대시보드 페이지
9. ✅ 오늘 할 일 페이지
10. ✅ Task CRUD 컴포넌트
11. ✅ 주간 계획 페이지
12. ✅ 드래그 앤 드롭 (@dnd-kit)

### ✅ Phase 4: 회고 & 알림 (완료)
13. ✅ 주간 회고 페이지
14. ✅ 변경 이력 타임라인
15. ✅ 차트 컴포넌트 (recharts)
16. ✅ 알림 컴포넌트

### ✅ Phase 5: 고도화 (완료)
17. ✅ 반응형 레이아웃
18. ✅ 설정 페이지
19. ✅ 에러 처리
20. ✅ 로딩 상태 관리

### ✅ Phase 6: 추가 기능 (완료)
21. ✅ 출퇴근 시간 계산기 (Commute)
   - 루틴 관리 (생성, 수정, 삭제)
   - 시간 역산 계산
   - 드래그 앤 드롭 단계 순서 변경
   - 로컬 스토리지 저장

### ✅ Phase 7: API 통합 및 테스트 (완료)
22. ✅ 백엔드 API 스펙에 맞춰 API 호출 수정
   - Task API에 planId 파라미터 추가
   - 인증 토큰 필드명 변경 (token → accessToken)
   - 알림 읽음 처리 메서드 변경 (PUT → POST)
23. ✅ 백엔드 미구현 엔드포인트 워크어라운드 구현
   - `/plans/current` → `/plans` 목록에서 필터링
   - `/today` → `/plans` 목록에서 필터링
   - `/reviews/current` → `/reviews` 목록에서 필터링
24. ✅ API 테스트 도구 추가
   - Node.js 기반 테스트 스크립트
   - 브라우저 기반 테스트 페이지

---

## Git Submodule 설정

```bash
# docs 서브모듈 추가
git submodule add https://github.com/{username}/weekly-planner-docs.git docs

# 클론 시 서브모듈 포함
git clone --recurse-submodules https://github.com/{username}/weekly-planner-frontend.git

# 서브모듈 업데이트
git submodule update --remote docs
```

---

## 참고: shadcn/ui 설치

```bash
# shadcn/ui 초기화
npx shadcn-ui@latest init

# 필요한 컴포넌트 설치
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add card
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add progress
```

---

## 참고: 차트 라이브러리

완료율 차트와 변경 유형 차트는 `recharts` 사용:

```bash
npm install recharts
```

**구현 파일**:
- `src/components/review/CompletionChart.tsx` (lines 18-51) - 일별 완료율 막대 차트
- `src/components/review/ChangeTypeChart.tsx` - 변경 유형별 파이 차트

```tsx
// src/components/review/CompletionChart.tsx:28-33
const getBarColor = (rate: number) => {
  if (rate >= 80) return '#10b981'  // green
  if (rate >= 60) return '#3b82f6'  // blue
  if (rate >= 40) return '#f59e0b'  // amber
  return '#ef4444'  // red
}
```

---

## 구현 상세

### 실제 구현 사항

이 프로젝트는 2025년 12월 22일에 완전히 구현되었으며, 2025년 12월 28일에 백엔드 API 스펙에 맞춰 전면 수정되었습니다.

**주요 구현 특징:**
- **89개 파일** 생성 (11,000+ 줄의 코드)
- **shadcn/ui** 기반 UI 컴포넌트 시스템
- **Zustand** 기반 상태 관리
- **@dnd-kit** 드래그 앤 드롭 (Task 이동, 출퇴근 단계 순서 변경)
- **recharts** 차트 시각화
- **React Hook Form + Zod** 폼 검증
- **date-fns** 날짜 처리
- **Tailwind CSS** 스타일링

**추가 구현 기능:**
- 출퇴근 시간 계산기 (Commute) - 로컬 저장 + 백엔드 연동 가능
- Public Route 가드 (인증된 사용자는 로그인/회원가입 페이지 접근 불가)
- Toast 알림 시스템
- 반응형 모바일 네비게이션
- 로딩/에러 상태 처리

**백엔드 통합 (2025-12-28 업데이트):**
- API 클라이언트는 `VITE_API_URL` 환경 변수로 설정
- 모든 API 호출은 axios 인터셉터를 통해 자동으로 JWT 토큰 추가
- 401 에러 시 자동 로그아웃 및 로그인 페이지 리다이렉트
- **Task API**: 모든 엔드포인트에 `planId` 파라미터 필수 전달
- **인증**: `accessToken` 필드명 사용 (이전: `token`)
- **알림**: 읽음 처리 `POST` 메서드 사용 (이전: `PUT`)
- **워크어라운드**: 백엔드 미구현 엔드포인트(`/plans/current`, `/today`, `/reviews/current`)는 목록 조회 후 필터링으로 대체

**테스트 도구:**
- `test-api.js` - Node.js 기반 API 엔드포인트 테스트 스크립트
- `test-api-endpoints.html` - 브라우저 기반 인터랙티브 API 테스트 페이지

### 다음 단계 (선택사항)

프로젝트를 더 발전시키고 싶다면:

1. **테스트 추가**
   - Vitest + React Testing Library
   - E2E 테스트 (Playwright)

2. **성능 최적화**
   - React.memo, useMemo, useCallback
   - 코드 스플리팅
   - 이미지 최적화

3. **접근성 개선**
   - ARIA 레이블
   - 키보드 네비게이션
   - 스크린 리더 지원

4. **국제화 (i18n)**
   - react-i18next
   - 다국어 지원

5. **PWA 지원**
   - Service Worker
   - 오프라인 모드
   - 모바일 설치