# Weekly Planner - Frontend

React + TypeScript 기반 웹 프론트엔드

## 프로젝트 개요

주간 일정 관리 서비스의 웹 프론트엔드입니다.
상세 스펙은 `docs/` 서브모듈을 참조하세요.

### 참조 문서 (docs/ 서브모듈)
- `docs/api-contract.md` - REST API 스펙
- `docs/ui-spec.md` - 화면 명세
- `docs/domain-model.md` - 도메인 모델 (타입 정의용)

---

## 기술 스택

| 구분 | 기술 | 버전 |
|------|------|------|
| Framework | React | 18+ |
| Language | TypeScript | 5+ |
| Build | Vite | 5+ |
| Routing | React Router | 6+ |
| State | Zustand | 4+ |
| HTTP | Axios | 1+ |
| Styling | Tailwind CSS | 3+ |
| UI Components | shadcn/ui | - |
| Icons | Lucide React | - |
| DnD | @dnd-kit | - |
| Date | date-fns | - |
| Form | React Hook Form + Zod | - |

---

## 프로젝트 구조

```
src/
├── main.tsx
├── App.tsx
├── index.css                    # Tailwind 설정
│
├── api/
│   ├── client.ts                # Axios 인스턴스 + 인터셉터
│   ├── auth.ts                  # 인증 API
│   ├── plans.ts                 # 주간 계획 API
│   ├── tasks.ts                 # Task API
│   ├── notifications.ts         # 알림 API
│   └── reviews.ts               # 회고 API
│
├── types/
│   ├── index.ts                 # 공통 타입 export
│   ├── user.ts
│   ├── plan.ts
│   ├── task.ts
│   ├── changelog.ts
│   ├── notification.ts
│   └── review.ts
│
├── stores/
│   ├── authStore.ts             # 인증 상태
│   ├── planStore.ts             # 현재 주간 계획
│   ├── notificationStore.ts     # 알림 상태
│   └── uiStore.ts               # UI 상태 (사이드바, 모달 등)
│
├── hooks/
│   ├── useAuth.ts
│   ├── usePlan.ts
│   ├── useTasks.ts
│   ├── useNotifications.ts
│   └── useToast.ts
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
│   │   ├── TaskCheckbox.tsx     # 완료 체크박스
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
  token: string | null;
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
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
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
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
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
  create: (planId: string, data: CreateTaskRequest) =>
    apiClient.post<ApiResponse<Task>>(`/plans/${planId}/tasks`, data),
    
  update: (taskId: string, data: UpdateTaskRequest) =>
    apiClient.put<ApiResponse<Task>>(`/tasks/${taskId}`, data),
    
  updateStatus: (taskId: string, status: string, reason?: string) =>
    apiClient.put<ApiResponse<Task>>(`/tasks/${taskId}/status`, { status, reason }),
    
  move: (taskId: string, targetDate: string, reason?: string) =>
    apiClient.put<ApiResponse<Task>>(`/tasks/${taskId}/move`, { targetDate, reason }),
    
  delete: (taskId: string, reason?: string) =>
    apiClient.delete(`/tasks/${taskId}`, { params: { reason } }),
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
    try {
      await taskApi.updateStatus(taskId, status);
      loadPlan();
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleAddTask = async (data: CreateTaskRequest) => {
    if (!currentPlan) return;
    try {
      await taskApi.create(currentPlan.id, { ...data, date: dateStr });
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
        onDelete={(taskId) => taskApi.delete(taskId).then(loadPlan)}
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
    
    if (!over) return;
    
    const taskId = active.id as string;
    const targetDate = over.id as string;
    const sourceDate = findTaskDate(taskId);
    
    if (sourceDate === targetDate) return;
    
    try {
      await taskApi.move(taskId, targetDate);
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
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
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

## 구현 순서

### Phase 1: 기본 구조
1. Vite + React + TypeScript 프로젝트 생성
2. Tailwind CSS + shadcn/ui 설정
3. 라우팅 설정
4. API 클라이언트 + Zustand 스토어

### Phase 2: 인증
5. 로그인/회원가입 페이지
6. 인증 상태 관리
7. Protected Route

### Phase 3: 핵심 기능
8. 대시보드 페이지
9. 오늘 할 일 페이지
10. Task CRUD 컴포넌트
11. 주간 계획 페이지
12. 드래그 앤 드롭

### Phase 4: 회고 & 알림
13. 주간 회고 페이지
14. 변경 이력 타임라인
15. 차트 컴포넌트
16. 알림 컴포넌트

### Phase 5: 고도화
17. 반응형 레이아웃
18. 설정 페이지
19. 에러 처리 개선
20. 로딩 상태 개선

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

완료율 차트와 변경 유형 차트는 `recharts` 사용 권장:

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
