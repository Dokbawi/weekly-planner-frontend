# Weekly Planner - Frontend

React + TypeScript 기반 웹 프론트엔드

## 프로젝트 상태

**구현 완료** ✅ - 2025년 12월 22일
**API 통합 수정** 🔧 - 2025년 12월 28일

모든 핵심 기능이 구현되었으며, 추가로 출퇴근 시간 계산 기능이 포함되었습니다.
백엔드 API 스펙에 맞춰 프론트엔드 API 호출을 전면 수정했습니다.

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

### 최근 변경사항 (2025-12-28)

- **API 통합 수정**
  - JWT 토큰: `token` → `accessToken` 필드명 변경
  - Task API: 모든 엔드포인트에 `planId` 파라미터 필수 추가
  - Task 생성: `date`를 query parameter로 전달 (`/plans/{planId}/tasks?date=yyyy-MM-dd`)
  - 알림 API: 읽음 처리 메서드 PUT → POST 변경
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

알림 읽음 처리 메서드가 변경되었습니다:

```typescript
// 이전 (미구현)
PUT /notifications/{id}/read

// 현재 (구현됨)
POST /notifications/{id}/read
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
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;  // JWT accessToken
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    { name: 'auth-storage' }
  )
);
```

### planStore.ts
```typescript
import { create } from 'zustand';
import { WeeklyPlan, Task } from '@/types';

interface PlanState {
  currentPlan: WeeklyPlan | null;
  isLoading: boolean;
  error: string | null;

  setPlan: (plan: WeeklyPlan) => void;
  updateTask: (date: string, task: Task) => void;
  addTask: (date: string, task: Task) => void;
  removeTask: (date: string, taskId: string) => void;
  moveTask: (fromDate: string, toDate: string, taskId: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearPlan: () => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  currentPlan: null,
  isLoading: false,
  error: null,

  setPlan: (plan) => set({ currentPlan: plan }),

  updateTask: (date, task) => set((state) => {
    if (!state.currentPlan) return state;
    const dailyPlan = state.currentPlan.dailyPlans[date];
    if (!dailyPlan) return state;

    return {
      currentPlan: {
        ...state.currentPlan,
        dailyPlans: {
          ...state.currentPlan.dailyPlans,
          [date]: {
            ...dailyPlan,
            tasks: dailyPlan.tasks.map(t => t.id === task.id ? task : t)
          }
        }
      }
    };
  }),

  addTask: (date, task) => set((state) => {
    if (!state.currentPlan) return state;
    const dailyPlan = state.currentPlan.dailyPlans[date] || { date, tasks: [] };
    return {
      currentPlan: {
        ...state.currentPlan,
        dailyPlans: {
          ...state.currentPlan.dailyPlans,
          [date]: {
            ...dailyPlan,
            tasks: [...dailyPlan.tasks, task]
          }
        }
      }
    };
  }),

  removeTask: (date, taskId) => set((state) => {
    if (!state.currentPlan) return state;
    const dailyPlan = state.currentPlan.dailyPlans[date];
    if (!dailyPlan) return state;

    return {
      currentPlan: {
        ...state.currentPlan,
        dailyPlans: {
          ...state.currentPlan.dailyPlans,
          [date]: {
            ...dailyPlan,
            tasks: dailyPlan.tasks.filter(t => t.id !== taskId)
          }
        }
      }
    };
  }),

  moveTask: (fromDate, toDate, taskId) => set((state) => {
    if (!state.currentPlan) return state;
    const fromDailyPlan = state.currentPlan.dailyPlans[fromDate];
    if (!fromDailyPlan) return state;

    const task = fromDailyPlan.tasks.find(t => t.id === taskId);
    if (!task) return state;

    const toDailyPlan = state.currentPlan.dailyPlans[toDate] || { date: toDate, tasks: [] };

    return {
      currentPlan: {
        ...state.currentPlan,
        dailyPlans: {
          ...state.currentPlan.dailyPlans,
          [fromDate]: {
            ...fromDailyPlan,
            tasks: fromDailyPlan.tasks.filter(t => t.id !== taskId)
          },
          [toDate]: {
            ...toDailyPlan,
            tasks: [...toDailyPlan.tasks, task]
          }
        }
      }
    };
  }),

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  clearPlan: () => set({ currentPlan: null, error: null }),
}));
```

---

## API 클라이언트 (api/)

### client.ts
```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request 인터셉터 - 토큰 추가
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response 인터셉터 - 에러 처리
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error.response?.data?.error || error);
  }
);
```

### tasks.ts
```typescript
import { apiClient } from './client';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '@/types';
import { ApiResponse } from '@/types/api';

export const taskApi = {
  // 모든 Task 작업은 planId가 필요 (백엔드 API 스펙)
  create: (planId: string, date: string, data: Omit<CreateTaskRequest, 'date'>) =>
    apiClient.post<ApiResponse<Task>>(`/plans/${planId}/tasks?date=${date}`, data),

  update: (planId: string, taskId: string, data: UpdateTaskRequest) =>
    apiClient.put<ApiResponse<Task>>(`/plans/${planId}/tasks/${taskId}`, data),

  updateStatus: (planId: string, taskId: string, status: string, reason?: string) =>
    apiClient.put<ApiResponse<Task>>(`/plans/${planId}/tasks/${taskId}`, { status, reason }),

  move: (planId: string, taskId: string, targetDate: string, reason?: string) =>
    apiClient.post<ApiResponse<Task>>(`/plans/${planId}/tasks/${taskId}/move`, { targetDate, reason }),

  delete: (planId: string, taskId: string, reason?: string) =>
    apiClient.delete(`/plans/${planId}/tasks/${taskId}`, { params: { reason } }),
};
```

---

## 주요 컴포넌트 구현

### TaskItem.tsx
```tsx
import { useState } from 'react';
import { Task } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Clock, Bell, GripVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TaskItemProps {
  task: Task;
  onStatusChange: (status: string) => void;
  onEdit: () => void;
  onMove: () => void;
  onDelete: () => void;
  isDragging?: boolean;
}

export function TaskItem({
  task,
  onStatusChange,
  onEdit,
  onMove,
  onDelete,
  isDragging
}: TaskItemProps) {
  const isCompleted = task.status === 'COMPLETED';

  return (
    <div className={cn(
      "flex items-center gap-3 p-3 bg-white rounded-lg border",
      isCompleted && "opacity-60",
      isDragging && "shadow-lg"
    )}>
      {/* 드래그 핸들 */}
      <GripVertical className="w-4 h-4 text-gray-400 cursor-grab" />

      {/* 체크박스 */}
      <Checkbox
        checked={isCompleted}
        onCheckedChange={(checked) =>
          onStatusChange(checked ? 'COMPLETED' : 'PENDING')
        }
      />

      {/* 시간 */}
      {task.scheduledTime && (
        <span className="text-sm text-gray-500 w-12">
          {task.scheduledTime}
        </span>
      )}

      {/* 제목 */}
      <span className={cn(
        "flex-1",
        isCompleted && "line-through text-gray-400"
      )}>
        {task.title}
      </span>

      {/* 알림 아이콘 */}
      {task.reminder?.enabled && (
        <Bell className="w-4 h-4 text-gray-400" />
      )}

      {/* 우선순위 뱃지 */}
      <PriorityBadge priority={task.priority} />

      {/* 더보기 메뉴 */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onEdit}>수정</DropdownMenuItem>
          <DropdownMenuItem onClick={onMove}>다른 날로 이동</DropdownMenuItem>
          <DropdownMenuItem onClick={onDelete} className="text-red-600">
            삭제
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    LOW: 'bg-gray-100 text-gray-600',
    MEDIUM: 'bg-blue-100 text-blue-600',
    HIGH: 'bg-orange-100 text-orange-600',
    URGENT: 'bg-red-100 text-red-600',
  };

  return (
    <span className={cn(
      "text-xs px-2 py-0.5 rounded",
      colors[priority as keyof typeof colors]
    )}>
      {priority}
    </span>
  );
}
```

### ChangeTimeline.tsx
```tsx
import { ChangeLog } from '@/types';
import { format, parseISO } from 'date-fns';
import { ko } from 'date-fns/locale';

interface ChangeTimelineProps {
  changes: ChangeLog[];
}

export function ChangeTimeline({ changes }: ChangeTimelineProps) {
  // 날짜별 그룹핑
  const grouped = changes.reduce((acc, change) => {
    const date = change.targetDate;
    if (!acc[date]) acc[date] = [];
    acc[date].push(change);
    return acc;
  }, {} as Record<string, ChangeLog[]>);

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([date, logs]) => (
        <div key={date}>
          <h3 className="font-medium text-gray-900 mb-3">
            {format(parseISO(date), 'M월 d일 (E)', { locale: ko })}
          </h3>
          <div className="space-y-2 pl-4 border-l-2 border-gray-200">
            {logs.map((log) => (
              <ChangeLogItem key={log.id} log={log} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChangeLogItem({ log }: { log: ChangeLog }) {
  const time = format(parseISO(log.changedAt), 'HH:mm');

  return (
    <div className="relative pl-4">
      <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-500" />
      <div className="text-sm">
        <span className="text-gray-500">{time}</span>
        <span className="mx-2">"{log.taskTitle}"</span>
        <span className="text-gray-700">{getChangeDescription(log)}</span>
        {log.reason && (
          <p className="text-gray-500 text-xs mt-1">사유: {log.reason}</p>
        )}
      </div>
    </div>
  );
}

function getChangeDescription(log: ChangeLog): string {
  switch (log.changeType) {
    case 'STATUS_CHANGED':
      const statusChange = log.changes.find(c => c.field === 'status');
      if (statusChange?.newValue === 'COMPLETED') return '완료 처리';
      if (statusChange?.newValue === 'CANCELLED') return '취소됨';
      return '상태 변경';
    case 'TIME_CHANGED':
      const timeChange = log.changes.find(c => c.field === 'scheduledTime');
      return `시간 변경 (${timeChange?.previousValue} → ${timeChange?.newValue})`;
    case 'MOVED_TO_ANOTHER_DAY':
      return '다른 날로 이동됨';
    case 'TASK_CREATED':
      return '추가됨';
    case 'TASK_DELETED':
      return '삭제됨';
    case 'PRIORITY_CHANGED':
      return '우선순위 변경';
    default:
      return '수정됨';
  }
}
```

---

## 페이지 구현

### Today.tsx
```tsx
import { useEffect, useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaskList } from '@/components/task/TaskList';
import { TaskForm } from '@/components/task/TaskForm';
import { usePlanStore } from '@/stores/planStore';
import { planApi } from '@/api/plans';
import { taskApi } from '@/api/tasks';
import { cn } from '@/lib/utils';
import { CreateTaskRequest } from '@/types';

export default function Today() {
  const [date, setDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { currentPlan, setPlan, setLoading } = usePlanStore();

  const dateStr = format(date, 'yyyy-MM-dd');
  const dailyPlan = currentPlan?.dailyPlans[dateStr];
  const tasks = dailyPlan?.tasks || [];

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true);
    try {
      const response = await planApi.getCurrent();
      setPlan(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    if (!currentPlan) return;
    try {
      await taskApi.updateStatus(currentPlan.id, taskId, status);
      loadPlan();
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddTask = async (data: CreateTaskRequest) => {
    if (!currentPlan) return;
    try {
      // planId와 date를 별도로 전달
      await taskApi.create(currentPlan.id, dateStr, data);
      setIsFormOpen(false);
      loadPlan();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* 날짜 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => setDate(d => subDays(d, 1))}>
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <div className="text-center">
          <h1 className="text-2xl font-bold">
            {format(date, 'M월 d일 (E)', { locale: ko })}
          </h1>
          {currentPlan && (
            <span className={cn(
              "text-sm px-2 py-1 rounded",
              currentPlan.status === 'CONFIRMED'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100'
            )}>
              {currentPlan.status === 'CONFIRMED' ? '확정됨' : '작성 중'}
            </span>
          )}
        </div>
        <Button variant="ghost" onClick={() => setDate(d => addDays(d, 1))}>
          <ChevronRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Task 목록 */}
      <TaskList
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onEdit={(task) => {/* 편집 모달 */}}
        onMove={(task) => {/* 이동 모달 */}}
        onDelete={(taskId) => {
          if (!currentPlan) return;
          taskApi.delete(currentPlan.id, taskId).then(loadPlan);
        }}
      />

      {/* 추가 버튼 */}
      <Button
        onClick={() => setIsFormOpen(true)}
        className="w-full mt-4"
        variant="outline"
      >
        <Plus className="w-4 h-4 mr-2" />
        할 일 추가
      </Button>

      {/* 추가 폼 모달 */}
      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAddTask}
      />
    </div>
  );
}
```

### Review.tsx
```tsx
import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { reviewApi } from '@/api/reviews';
import { WeeklyReview } from '@/types';
import { StatsSummary } from '@/components/review/StatsSummary';
import { CompletionChart } from '@/components/review/CompletionChart';
import { ChangeTimeline } from '@/components/review/ChangeTimeline';
import { ChangeTypeChart } from '@/components/review/ChangeTypeChart';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export default function Review() {
  const [review, setReview] = useState<WeeklyReview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReview();
  }, []);

  const loadReview = async () => {
    try {
      const response = await reviewApi.getCurrent();
      setReview(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!review) return <EmptyState message="회고 데이터가 없습니다" />;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">📊 주간 회고</h1>
        <p className="text-gray-500">
          {format(new Date(review.weekStartDate), 'yyyy년 M월 d일')} ~
          {format(new Date(review.weekEndDate), 'M월 d일')}
        </p>
      </div>

      {/* 통계 요약 */}
      <StatsSummary statistics={review.statistics} />

      {/* 차트 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="font-medium mb-4">일별 완료율</h2>
          <CompletionChart dailyBreakdown={review.dailyBreakdown} />
        </div>
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="font-medium mb-4">변경 유형 분석</h2>
          <ChangeTypeChart changesByType={review.statistics.changesByType} />
        </div>
      </div>

      {/* 변경 이력 타임라인 */}
      <div className="bg-white p-6 rounded-lg border">
        <h2 className="font-medium mb-4">변경 이력</h2>
        <ChangeTimeline changes={review.changeHistory} />
      </div>
    </div>
  );
}
```

### Commute.tsx (출퇴근 시간 계산)
```tsx
import { useState } from 'react'
import { useCommuteStore } from '@/stores/commuteStore'
import { CommuteRoutine } from '@/types'
import { Button } from '@/components/ui/button'
import { RoutineForm, RoutineCard, TimeCalculator } from '@/components/commute'
import { Plus, Train } from 'lucide-react'

export default function Commute() {
  const { routines, selectedRoutine, addRoutine, deleteRoutine, selectRoutine } =
    useCommuteStore()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRoutine, setEditingRoutine] = useState<CommuteRoutine | null>(null)

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Train className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold">출퇴근 시간 계산기</h1>
            <p className="text-sm text-gray-500">
              루틴을 저장하고 도착 시간에 맞춰 출발 시간을 계산하세요
            </p>
          </div>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          새 루틴
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 루틴 목록 */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700">저장된 루틴</h2>
          {routines.map((routine) => (
            <RoutineCard
              key={routine.id}
              routine={routine}
              isSelected={selectedRoutine?.id === routine.id}
              onSelect={() => selectRoutine(routine)}
              onEdit={() => setEditingRoutine(routine)}
              onDelete={() => deleteRoutine(routine.id)}
            />
          ))}
        </div>

        {/* 시간 계산기 */}
        <div className="space-y-4">
          <h2 className="font-semibold text-gray-700">시간 계산</h2>
          {selectedRoutine && <TimeCalculator routine={selectedRoutine} />}
        </div>
      </div>

      {/* 추가/수정 폼 */}
      <RoutineForm
        open={isFormOpen || !!editingRoutine}
        onClose={() => {
          setIsFormOpen(false)
          setEditingRoutine(null)
        }}
        routine={editingRoutine || undefined}
        isEdit={!!editingRoutine}
      />
    </div>
  )
}
```

**출퇴근 시간 계산 기능:**
- 출퇴근 루틴을 단계별로 등록 (준비, 도보, 버스, 지하철 등)
- 도착 시간을 입력하면 자동으로 출발 시간 역산
- 여유 시간(offset) 조정 가능
- 드래그 앤 드롭으로 단계 순서 변경
- 로컬 스토리지에 루틴 저장 (백엔드 연동 선택적)
- 각 단계별 시작/종료 시간 표시

---

## 드래그 앤 드롭 (주간 계획)

### WeekCalendar.tsx (with @dnd-kit)
```tsx
import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { DayColumn } from './DayColumn';
import { TaskItem } from '../task/TaskItem';
import { usePlanStore } from '@/stores/planStore';
import { taskApi } from '@/api/tasks';
import { Task } from '@/types';

export function WeekCalendar() {
  const { currentPlan } = usePlanStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const findTask = (taskId: string): Task | null => {
    if (!currentPlan) return null;
    for (const dailyPlan of Object.values(currentPlan.dailyPlans)) {
      const task = dailyPlan.tasks.find(t => t.id === taskId);
      if (task) return task;
    }
    return null;
  };

  const findTaskDate = (taskId: string): string | null => {
    if (!currentPlan) return null;
    for (const [date, dailyPlan] of Object.entries(currentPlan.dailyPlans)) {
      if (dailyPlan.tasks.some(t => t.id === taskId)) return date;
    }
    return null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTask(active.id as string);
    setActiveTask(task);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over || !currentPlan) return;

    const taskId = active.id as string;
    const targetDate = over.id as string;
    const sourceDate = findTaskDate(taskId);

    if (sourceDate === targetDate) return;

    try {
      // planId 필수 전달
      await taskApi.move(currentPlan.id, taskId, targetDate);
      // Plan 리로드
    } catch (error) {
      console.error(error);
    }
  };

  const getWeekDates = (startDate?: string): string[] => {
    if (!startDate) return [];
    const dates: string[] = [];
    const start = new Date(startDate);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  const weekDates = getWeekDates(currentPlan?.weekStartDate);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-7 gap-2">
        {weekDates.map((date) => (
          <DayColumn
            key={date}
            date={date}
            dailyPlan={currentPlan?.dailyPlans[date]}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <TaskItem
            task={activeTask}
            isDragging
            onStatusChange={() => {}}
            onEdit={() => {}}
            onMove={() => {}}
            onDelete={() => {}}
          />
        )}
      </DragOverlay>
    </DndContext>
  );
}
```

---

## 라우팅 설정

### App.tsx
```tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Layout } from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Today from '@/pages/Today';
import Planning from '@/pages/Planning';
import Review from '@/pages/Review';
import Notifications from '@/pages/Notifications';
import Commute from '@/pages/Commute';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        {/* Private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="today" element={<Today />} />
          <Route path="planning" element={<Planning />} />
          <Route path="review" element={<Review />} />
          <Route path="review/:weekStartDate" element={<Review />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="commute" element={<Commute />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
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

```tsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function CompletionChart({ dailyBreakdown }) {
  const data = Object.entries(dailyBreakdown).map(([date, stats]) => ({
    date: format(parseISO(date), 'E', { locale: ko }),
    completionRate: stats.completionRate,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data}>
        <XAxis dataKey="date" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Bar dataKey="completionRate" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
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