# Weekly Planner API Reference

## 기본 정보

- **Base URL**: `http://localhost:8080/api/v1`
- **인증 방식**: Bearer Token (JWT)
- **Content-Type**: `application/json`

## 인증 헤더

```
Authorization: Bearer {token}
```

## 응답 형식

### 성공 응답
```json
{
    "success": true,
    "data": { ... }
}
```

### 에러 응답
```json
{
    "success": false,
    "error": {
        "code": "ERROR_CODE",
        "message": "에러 메시지"
    }
}
```

## API 엔드포인트

### 1. 인증 (Authentication)

#### 1.1 회원가입
- **URL**: `POST /auth/register`
- **인증**: 불필요
- **Request Body**:
```json
{
    "email": "user@example.com",
    "password": "password123",
    "name": "홍길동"
}
```
- **Response**: `201 Created`
```json
{
    "success": true,
    "data": {
        "id": "user_123",
        "email": "user@example.com",
        "name": "홍길동",
        "createdAt": "2024-01-01T00:00:00Z"
    }
}
```

#### 1.2 로그인
- **URL**: `POST /auth/login`
- **인증**: 불필요
- **Request Body**:
```json
{
    "email": "user@example.com",
    "password": "password123"
}
```
- **Response**: `200 OK`
```json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "expiresAt": "2024-01-02T00:00:00Z",
        "user": {
            "id": "user_123",
            "email": "user@example.com",
            "name": "홍길동"
        }
    }
}
```

#### 1.3 현재 사용자 정보
- **URL**: `GET /auth/me`
- **인증**: 필요
- **Response**: `200 OK`
```json
{
    "success": true,
    "data": {
        "id": "user_123",
        "email": "user@example.com",
        "name": "홍길동",
        "settings": {
            "planningDay": "SUNDAY",
            "reviewDay": "SATURDAY",
            "weekStartDay": "MONDAY",
            "timezone": "Asia/Seoul",
            "defaultReminderMinutes": 10,
            "notificationEnabled": true
        }
    }
}
```

#### 1.4 사용자 설정 수정
- **URL**: `PUT /auth/settings`
- **인증**: 필요
- **Request Body**:
```json
{
    "planningDay": "SUNDAY",
    "reviewDay": "SATURDAY",
    "timezone": "Asia/Seoul",
    "defaultReminderMinutes": 15,
    "notificationEnabled": true
}
```

### 2. 주간 계획 (Weekly Plans)

#### 2.1 현재 주 계획 조회
- **URL**: `GET /plans/current`
- **인증**: 필요
- **설명**: 현재 주의 계획을 조회. 없으면 자동 생성
- **Response**: `200 OK`
```json
{
    "success": true,
    "data": {
        "id": "plan_123",
        "weekStartDate": "2024-01-01",
        "weekEndDate": "2024-01-07",
        "status": "DRAFT",
        "dailyPlans": {
            "2024-01-01": {
                "date": "2024-01-01",
                "dayOfWeek": "MONDAY",
                "tasks": [],
                "memo": null
            }
        },
        "confirmedAt": null,
        "createdAt": "2024-01-01T00:00:00Z"
    }
}
```

#### 2.2 특정 주간 계획 조회
- **URL**: `GET /plans/{planId}`
- **인증**: 필요

#### 2.3 주간 계획 목록
- **URL**: `GET /plans`
- **인증**: 필요
- **Query Parameters**:
  - `page`: 페이지 번호 (0부터 시작)
  - `size`: 페이지 크기 (기본값: 10)
  - `status`: 상태 필터 (DRAFT, CONFIRMED, COMPLETED)

#### 2.4 계획 확정
- **URL**: `PUT /plans/{planId}/confirm`
- **인증**: 필요
- **설명**: 계획을 확정하고 변경사항 추적 시작

#### 2.5 일일 메모 수정
- **URL**: `PUT /plans/{planId}/memo`
- **인증**: 필요
- **Request Body**:
```json
{
    "date": "2024-01-01",
    "memo": "오늘은 집중해서 일하기"
}
```

### 3. 할 일 관리 (Tasks)

#### 3.1 Task 목록 조회
- **URL**: `GET /plans/{planId}/tasks`
- **인증**: 필요
- **Query Parameters**:
  - `date`: 특정 날짜 필터 (yyyy-MM-dd)
  - `status`: 상태 필터

#### 3.2 Task 추가
- **URL**: `POST /plans/{planId}/tasks`
- **인증**: 필요
- **Request Body**:
```json
{
    "date": "2024-01-01",
    "title": "프로젝트 미팅",
    "description": "Q1 계획 논의",
    "scheduledTime": "14:00",
    "estimatedMinutes": 60,
    "reminder": {
        "enabled": true,
        "minutesBefore": 10
    },
    "priority": "HIGH",
    "tags": ["work", "meeting"]
}
```

#### 3.3 Task 수정
- **URL**: `PUT /tasks/{taskId}`
- **인증**: 필요
- **Request Body**:
```json
{
    "title": "프로젝트 미팅 (변경)",
    "scheduledTime": "15:00",
    "reason": "시간 변경됨"
}
```

#### 3.4 Task 상태 변경
- **URL**: `PUT /tasks/{taskId}/status`
- **인증**: 필요
- **Request Body**:
```json
{
    "status": "COMPLETED",
    "reason": null
}
```
- **상태 값**: PENDING, IN_PROGRESS, COMPLETED, CANCELLED, POSTPONED

#### 3.5 Task 이동
- **URL**: `PUT /tasks/{taskId}/move`
- **인증**: 필요
- **Request Body**:
```json
{
    "targetDate": "2024-01-02",
    "reason": "오늘 시간 부족"
}
```

#### 3.6 Task 삭제
- **URL**: `DELETE /tasks/{taskId}`
- **인증**: 필요
- **Query Parameters**:
  - `reason`: 삭제 사유 (선택)

### 4. 변경 이력 (Change Logs)

#### 4.1 변경 이력 조회
- **URL**: `GET /plans/{planId}/changes`
- **인증**: 필요
- **Query Parameters**:
  - `date`: 특정 날짜 필터
  - `type`: 변경 유형 필터
  - `page`: 페이지 번호
  - `size`: 페이지 크기

### 5. 주간 회고 (Weekly Review)

#### 5.1 현재 주 회고
- **URL**: `GET /reviews/current`
- **인증**: 필요
- **Response**: 통계, 일별 분석, 변경 이력 포함

#### 5.2 특정 주 회고
- **URL**: `GET /reviews/{weekStartDate}`
- **인증**: 필요
- **Path Parameter**: weekStartDate (yyyy-MM-dd)

### 6. 알림 (Notifications)

#### 6.1 알림 목록
- **URL**: `GET /notifications`
- **인증**: 필요
- **Query Parameters**:
  - `unreadOnly`: 읽지 않은 것만 (기본값: false)
  - `page`: 페이지 번호
  - `size`: 페이지 크기

#### 6.2 읽지 않은 알림 수
- **URL**: `GET /notifications/unread/count`
- **인증**: 필요

#### 6.3 알림 읽음 처리
- **URL**: `PUT /notifications/{notificationId}/read`
- **인증**: 필요

#### 6.4 전체 알림 읽음
- **URL**: `PUT /notifications/read-all`
- **인증**: 필요

### 7. 오늘 할 일 (Today)

#### 7.1 오늘 할 일 조회
- **URL**: `GET /today`
- **인증**: 필요
- **설명**: 현재 주 계획에서 오늘 날짜의 할 일 조회

## 에러 코드

| Code | HTTP Status | Description |
|------|-------------|-------------|
| UNAUTHORIZED | 401 | 인증 필요 |
| FORBIDDEN | 403 | 권한 없음 |
| NOT_FOUND | 404 | 리소스 없음 |
| VALIDATION_ERROR | 400 | 입력값 오류 |
| ALREADY_CONFIRMED | 400 | 이미 확정된 계획 |
| INTERNAL_ERROR | 500 | 서버 오류 |

## 테스트 예시

### cURL 예시

#### 로그인
```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### 현재 주 계획 조회
```bash
curl -X GET http://localhost:8080/api/v1/plans/current \
  -H "Authorization: Bearer {token}"
```

#### Task 추가
```bash
curl -X POST http://localhost:8080/api/v1/plans/{planId}/tasks \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-01",
    "title": "새로운 할 일",
    "priority": "MEDIUM"
  }'
```

## JavaScript/TypeScript 예시

```typescript
// Axios 사용 예시
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

// 로그인
async function login(email: string, password: string) {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, {
    email,
    password
  });

  if (response.data.success) {
    const { token, user } = response.data.data;
    // 토큰 저장
    localStorage.setItem('token', token);
    return user;
  }
}

// API 요청 (인증 필요)
async function getCurrentPlan() {
  const token = localStorage.getItem('token');

  const response = await axios.get(`${API_BASE_URL}/plans/current`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  return response.data.data;
}

// Task 추가
async function addTask(planId: string, taskData: any) {
  const token = localStorage.getItem('token');

  const response = await axios.post(
    `${API_BASE_URL}/plans/${planId}/tasks`,
    taskData,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    }
  );

  return response.data.data;
}
```

## 주의사항

1. **인증**: 로그인/회원가입을 제외한 모든 API는 JWT 토큰 필요
2. **날짜 형식**: `yyyy-MM-dd` (예: 2024-01-01)
3. **시간 형식**: `HH:mm` (예: 14:30)
4. **페이징**: 페이지 번호는 0부터 시작
5. **상태 값**: 대문자로 전송 (PENDING, COMPLETED 등)

## 개발 팁

1. **토큰 관리**: localStorage나 sessionStorage에 토큰 저장
2. **인터셉터 사용**: Axios 인터셉터로 자동 토큰 추가
3. **에러 처리**: 401 에러 시 자동 로그아웃 처리
4. **타입 정의**: TypeScript 사용 시 응답 타입 정의 권장