# Weekly Planner - Frontend

React + TypeScript 기반 주간 일정 관리 SPA

## 관련 문서 (작업별 필수 참조)

| 작업 | 참조 문서 | 우선순위 |
|------|----------|----------|
| API 호출 작성/수정 | `docs/api-contract.md` | **필수** |
| 타입 정의 수정 | `docs/domain-model.md` | **필수** |
| 비즈니스 로직 이해 | `docs/business-rules.md` | 권장 |
| 새 API 필요 시 | `docs/backend-api-requests.md`에 추가 | 필수 |
| UI 컴포넌트 작업 | `docs/ui-spec.md` | 권장 |

---

## 1. 프로젝트 컨텍스트

### Quick Start
```bash
npm install && npm run dev   # http://localhost:3000
npm run build                # 프로덕션 빌드
npm run lint                 # 린트 검사
```

### 환경 변수
```env
VITE_API_URL=http://localhost:8080/api/v1
```

### 기술 스택
| 구분 | 기술 |
|------|------|
| Core | React 18 + TypeScript 5 + Vite 5 |
| State | Zustand 5 (persist 미들웨어) |
| Styling | Tailwind CSS 3 + shadcn/ui |
| DnD | @dnd-kit/core + @dnd-kit/sortable |
| Form | React Hook Form + Zod |
| HTTP | Axios (인터셉터로 JWT 자동 첨부) |

---

## 2. API 작업 시 참조

> **상세 스펙**: `docs/api-contract.md` 필수 참조

### 핵심 규칙
1. **모든 Task API는 `planId` 필수**
2. **Task 생성 시 `date`는 query parameter**
3. **알림 읽음 처리는 PUT 메서드**

### Task API 패턴
```typescript
// 생성 - date를 query param으로
POST /plans/{planId}/tasks?date=yyyy-MM-dd

// 수정
PUT /plans/{planId}/tasks/{taskId}
{ title, status, priority, reason }

// 이동 (원본은 POSTPONED, 새 날짜에 복사본 생성)
POST /plans/{planId}/tasks/{taskId}/move
{ targetDate, reason }

// 삭제
DELETE /plans/{planId}/tasks/{taskId}?reason=...
```

### 인증 토큰
- 로그인 응답: `{ accessToken, tokenType, expiresIn }`
- 헤더: `Authorization: Bearer {accessToken}`
- 401 응답 시 자동 로그아웃 (`src/api/client.ts`)

### 데이터 정규화 (중요)
백엔드는 `dailyPlans`를 **배열**로 반환, 프론트엔드는 **객체(Record)** 기대:
```typescript
// src/api/plans.ts - normalizeDailyPlans()
// src/api/reviews.ts - normalizeReview()
// src/api/plans.ts - normalizeTask() (reminderMinutesBefore → reminder 변환)
```

---

## 3. 컴포넌트 작업 시 참조

### 프로젝트 구조
```
src/
├── api/              # API 클라이언트 (Axios + 정규화 함수)
├── components/
│   ├── ui/           # shadcn/ui 컴포넌트 (수정 금지)
│   ├── layout/       # Layout, Header, Sidebar, MobileNav
│   ├── task/         # TaskItem, TaskList, TaskForm, TaskMoveDialog
│   ├── plan/         # WeekCalendar, DayColumn, ConfirmDialog
│   ├── review/       # StatsSummary, CompletionChart, ChangeTimeline
│   ├── notification/ # NotificationBadge, NotificationDropdown
│   ├── template/     # TemplateList, TemplateForm, TemplateApplyDialog, SaveAsTemplateDialog
│   └── commute/      # RoutineCard, RoutineForm, TimeCalculator
├── pages/            # Dashboard, Today, Planning, Review, Settings, Login, Register
├── stores/           # authStore, planStore, notificationStore, commuteStore
├── types/            # 타입 정의 (docs/domain-model.md와 동기화)
└── lib/              # utils.ts (cn 함수), date.ts
```

### 상태 관리 (Zustand)
```typescript
// authStore - JWT 토큰 + persist (localStorage)
// planStore - 현재 주간 계획, Task CRUD 액션
// templateStore - 주간 템플릿 CRUD
// notificationStore - 알림 상태
// commuteStore - 출퇴근 루틴 (localStorage)
```

### 드래그 앤 드롭
- **주간 계획 날짜 간 이동**: `@dnd-kit/core` (DndContext + DragOverlay)
- **같은 날짜 내 정렬**: `@dnd-kit/sortable` (SortableContext)
- 구현 위치: `src/components/plan/WeekCalendar.tsx`, `src/pages/Today.tsx`

### Optimistic Update 패턴
```typescript
// 1. UI 먼저 업데이트
updateTask(taskId, { status: 'COMPLETED' })
// 2. API 호출
await taskApi.update(planId, taskId, { status: 'COMPLETED' })
// 3. 실패 시 롤백
catch { updateTask(taskId, { status: previousStatus }) }
```

---

## 4. 타입 작업 시 참조

> **상세 정의**: `docs/domain-model.md` 필수 참조

### 주요 타입 (src/types/)
```typescript
// task.ts
TaskStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'POSTPONED'
Priority: 'LOW' | 'MEDIUM' | 'HIGH'

// plan.ts
PlanStatus: 'DRAFT' | 'CONFIRMED'
WeeklyPlan.dailyPlans: Record<string, DailyPlan>  // key: "yyyy-MM-dd"

// changelog.ts
ChangeType: 'TASK_CREATED' | 'TASK_UPDATED' | 'TASK_DELETED' | 'MOVED_TO_ANOTHER_DAY' | ...
```

---

## 5. 빌드/배포 참조

### 빌드 최적화
```typescript
// vite.config.ts - 프로덕션에서 console, debugger 제거
esbuild: {
  drop: mode === 'production' ? ['console', 'debugger'] : [],
}
```

### Git Submodule (docs)
```bash
# 최신 문서 가져오기
git submodule update --remote docs

# 문서 수정 후 푸시
cd docs && git add . && git commit -m "docs: ..." && git push
cd .. && git add docs && git commit -m "chore: update docs submodule"
```

---

## 6. 주요 구현 파일 참조

| 기능 | 파일 위치 |
|------|----------|
| API 클라이언트 + 인터셉터 | `src/api/client.ts` |
| Task API + 정규화 | `src/api/tasks.ts`, `src/api/plans.ts` |
| 인증 스토어 | `src/stores/authStore.ts` |
| 주간 계획 스토어 | `src/stores/planStore.ts` |
| Protected/Public Route | `src/App.tsx` |
| 주간 캘린더 DnD | `src/components/plan/WeekCalendar.tsx` |
| Task 정렬 DnD | `src/pages/Today.tsx` |
| 변경 이력 타임라인 | `src/components/review/ChangeTimeline.tsx` |
| 주간 템플릿 API | `src/api/templates.ts` |
| 주간 템플릿 스토어 | `src/stores/templateStore.ts` |
| 주간 템플릿 페이지 | `src/pages/Templates.tsx` |
