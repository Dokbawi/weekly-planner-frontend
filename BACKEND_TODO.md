# Backend API TODO

백엔드에 구현이 필요한 API 목록입니다.
프론트엔드에서 해당 기능을 사용하려면 백엔드 구현이 선행되어야 합니다.

**Last Updated:** 2026-01-19

---

## 미구현 API 목록

### 1. 출퇴근 계산기 (Commute Routines) - **전체 미구현**

출퇴근 시간 계산 기능을 위한 API입니다. 현재 프론트엔드는 로컬 스토리지에 저장합니다.

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| GET | `/commute-routines` | 루틴 목록 조회 | HIGH |
| GET | `/commute-routines/{routineId}` | 특정 루틴 조회 | HIGH |
| POST | `/commute-routines` | 루틴 생성 | HIGH |
| PUT | `/commute-routines/{routineId}` | 루틴 수정 | HIGH |
| DELETE | `/commute-routines/{routineId}` | 루틴 삭제 | HIGH |
| POST | `/commute-routines/{routineId}/calculate` | 출발 시간 계산 | MEDIUM |
| POST | `/commute-routines/{routineId}/add-to-tasks` | 루틴을 Task로 추가 | LOW |

**Request/Response 스펙:**

```typescript
// CommuteRoutine
interface CommuteRoutine {
  id: string
  name: string
  destination: string
  steps: CommuteStep[]
  totalMinutes: number
  defaultArrivalTime?: string  // "HH:mm"
  createdAt: string
  updatedAt: string
}

interface CommuteStep {
  id: string
  label: string
  durationMinutes: number
  type: 'prepare' | 'walk' | 'bus' | 'subway' | 'taxi' | 'car' | 'bike' | 'other'
  order: number
}

// POST /commute-routines - Request
interface CreateCommuteRoutineRequest {
  name: string
  destination: string
  steps: Omit<CommuteStep, 'id'>[]
  defaultArrivalTime?: string
}

// POST /commute-routines/{routineId}/calculate - Request
interface CalculateRequest {
  arrivalTime: string  // "HH:mm"
  offsetMinutes?: number  // 여유 시간 (기본: 0)
}

// POST /commute-routines/{routineId}/calculate - Response
interface CalculateResponse {
  routineId: string
  arrivalTime: string
  offsetMinutes: number
  departureTime: string
  totalMinutes: number
  schedule: ScheduleStep[]
}

interface ScheduleStep {
  stepId: string
  label: string
  type: string
  startTime: string  // "HH:mm"
  endTime: string    // "HH:mm"
  durationMinutes: number
}
```

---

### 2. Task 순서 변경 (Reorder) - **미구현**

드래그 앤 드롭으로 Task 순서를 변경하는 기능입니다.

| Method | Endpoint | Description | Priority |
|--------|----------|-------------|----------|
| PUT | `/plans/{planId}/tasks/reorder` | Task 순서 변경 | MEDIUM |

**Request 스펙:**

```typescript
// PUT /plans/{planId}/tasks/reorder
interface ReorderRequest {
  date: string        // 해당 날짜
  taskIds: string[]   // 정렬된 Task ID 배열
}
```

---

### 3. 편의 API - **워크어라운드 있음**

다음 API들은 프론트엔드에서 목록 조회 후 필터링으로 대체 중입니다.
직접 구현하면 성능이 개선됩니다.

| Method | Endpoint | Description | Workaround | Priority |
|--------|----------|-------------|------------|----------|
| GET | `/plans/current` | 현재 주 계획 조회 | `/plans` 목록에서 필터링 | LOW |
| GET | `/today` | 오늘 할 일 조회 | `/plans` 목록에서 필터링 | LOW |
| GET | `/reviews/current` | 현재 주 회고 조회 | `/reviews` 목록에서 필터링 | LOW |

---

## 확인 필요 API

### PUT /plans/{planId}/memo - **동작 확인 필요**

메모 저장 시 400 에러 발생. API가 구현되었는지 확인 필요.

**에러 메시지:** `Failed to load resource: the server responded with a status of 400`

**Request 스펙 (api-contract.md 기준):**
```json
{
  "date": "2025-01-12",
  "memo": "오늘은 집중해서 일하기"
}
```

---

## 구현 완료 API

다음 API들은 백엔드에 구현되어 정상 동작합니다:

- [x] Authentication (`/auth/*`)
- [x] Weekly Plans (`/plans/*`)
- [x] Tasks (`/plans/{planId}/tasks/*`)
- [x] Change Logs (`/plans/{planId}/changes`)
- [x] Weekly Review (`/reviews/{planId}`)
- [x] Notifications (`/notifications/*`)

---

## 프론트엔드 참고사항

### 출퇴근 계산기 로컬 스토리지 저장

백엔드 API가 구현되기 전까지 출퇴근 루틴은 `localStorage`에 저장됩니다.
- 저장 키: `commute-routines`
- 데이터 형식: `CommuteRoutine[]`

백엔드 API가 구현되면 `src/stores/commuteStore.ts`에서 API 호출로 전환하면 됩니다.

### Task 순서 변경 로컬 처리

순서 변경 API가 없으면 UI에서만 순서가 변경되고 새로고침 시 원래대로 돌아갑니다.
프론트엔드 `src/api/tasks.ts`의 `reorder` 함수가 이미 준비되어 있습니다.

---

## 문서 업데이트 요청

백엔드에 API가 구현되면 `docs/api-contract.md`에 스펙을 추가해주세요.
