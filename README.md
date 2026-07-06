# Vue Admin UI

`admin-api-be`와 연동되는 Vue 3 기반 관리자 UI 포트폴리오/학습 프로젝트입니다.

이 프로젝트는 Vue 전문 개발자가 되는 것보다, Vue 기반 운영 UI 코드를 읽고 작은 기능 추가, 수정, 디버깅, UI 개선 요청에 대응할 수 있는 수준까지 익히는 것을 목표로 합니다.

현재는 로그인, 대시보드, 사용자 관리, 상품 관리, 알림, 활동 로그까지 실제 API와 연결된 관리자 UI 흐름을 구현했습니다.

## Tech Stack

- Vue 3.5.x
- Vite
- TypeScript
- Tailwind CSS
- Vue Router
- Pinia
- Fetch API

## Backend API

```txt
https://admin-api-be.onrender.com
```

API base URL은 환경 변수로 관리합니다. 실제 `.env` 파일은 커밋하지 않고, `.env.example`을 기준으로 작성합니다.

```env
VITE_APP_API_URL=http://localhost:5002
```

## Features

### Auth

- 로그인 화면
- access token 기반 인증 상태 관리
- Pinia auth store
- 새로고침 후 `/api/auth/me`를 통한 인증 상태 확인
- 로그인/보호 페이지 route guard
- 로그아웃 처리

### Dashboard

- dashboard summary API 연동
- summary card UI
- loading/error 상태 처리

### Users

- 사용자 목록 조회
- role/status badge
- 검색, role/status filter
- pagination
- empty/loading/error 상태 처리
- 사용자 생성 form
- 사용자 수정 form
- 사용자 삭제 confirm dialog
- admin role 기반 관리 버튼 노출

### Products

- 상품 목록 조회
- 상품 상태 badge
- 가격/재고/이미지 표시
- 상품 생성 form
- 상품 수정 form
- 이미지 업로드 API 연동
- 이미지 preview
- nullable `thumbnailUrl` 처리
- 업로드 실패와 submit 실패 분리

### Notifications

- 알림 목록 조회
- 알림 type badge
- 읽음/안읽음 표시
- 날짜 formatting
- loading/empty/error 상태 처리

### Activity Logs

- 활동 로그 목록 조회
- actor/action/target/createdAt 표시
- target badge 표현
- 날짜 formatting
- loading/empty/error 상태 처리

## Implementation Notes

### File Upload Flow

초기 구현에서는 파일 선택 시점에 바로 업로드했지만, 이미지 변경이나 등록 취소 시 불필요한 업로드가 발생할 수 있었습니다.

현재는 파일 선택 시에는 `File` 객체와 preview URL만 저장하고, 최종 submit 시점에 선택된 파일을 한 번만 업로드합니다.

```txt
파일 선택
-> File 객체 저장
-> preview 생성
-> submit
-> /uploads 요청
-> 응답 URL을 thumbnailUrl에 저장
-> /products 생성/수정 요청
```

업로드 실패 시 상품 생성/수정 요청을 중단하여 데이터 불일치를 줄입니다.

### Read-only Operational Views

Notifications와 Activity Logs는 데이터를 수정하는 화면이 아니라, 운영 상태를 빠르게 읽는 화면입니다.

- Notifications: 알림 종류, 제목, 메시지, 읽음 여부, 발생 시각
- Activity Logs: 누가, 무엇을, 어느 영역에서, 언제 했는지

백엔드 코드값은 프론트에서 label/tone으로 매핑해 사용자가 빠르게 상태를 파악할 수 있게 구성했습니다.

### Date Formatting

서버에서 내려오는 `createdAt` 문자열은 `src/utils/date.ts`의 `formatDateTime` 유틸로 변환합니다.

```ts
formatDateTime("2026-06-24T00:00:00.000Z")
```

날짜 표시 규칙을 한 곳에 모아 Notifications, Activity Logs 등에서 재사용할 수 있게 했습니다.

금액 표시는 `src/utils/currency.ts`의 `formatCurrency` 유틸로 분리하여 상품 목록과 대시보드 매출 카드에서 같은 규칙을 사용합니다.

### Structure Refactor

Homework 13에서는 기능이 늘어나며 흩어지기 쉬운 API, type, formatting, list state 책임을 정리했습니다.

- API 요청 함수는 `src/api`로 이동
- TypeScript 타입 정의는 `src/types`로 이동
- 날짜/금액 formatting은 `src/utils`에서 관리
- 반복되는 list loading/empty 상태 계산은 `src/composables/useListStatus.ts`로 분리

Pagination 상태는 반복 후보로 확인했지만, 아직 숫자 페이지네이션/limit 변경/URL query sync가 없으므로 view 안에 유지했습니다.

## Project Structure

```txt
src/
  api/
    activityLogs.ts
    auth.ts
    dashboard.ts
    notifications.ts
    products.ts
    users.ts
  components/
    common/
    dashboard/
    layout/
    notifications/
    products/
    ui/
    users/
  composables/
    useListStatus.ts
  router/
  stores/
  styles/
  types/
    activityLogs.ts
    api.ts
    dashboard.ts
    notifications.ts
    products.ts
    users.ts
  utils/
    currency.ts
    date.ts
  views/
    activity-logs/
    notifications/
    products/
    users/
```

## Getting Started

```sh
npm install
```

```sh
npm run dev
```

개발 서버 실행 후 브라우저에서 Vite가 안내하는 로컬 주소를 확인합니다.

## Type Check

```sh
npm run type-check
```

## Build

```sh
npm run build
```

## Portfolio Direction

이 프로젝트는 실제 백엔드 API와 연동되는 운영 Admin UI를 구현하며, 반복되는 테이블, 검색, 필터, 폼, 상태 표시, 권한 UI를 Vue 3와 TypeScript 기반 패턴으로 정리하는 것을 목표로 합니다.

포트폴리오에서 강조할 수 있는 포인트는 다음과 같습니다.

- 실제 API 연동 기반 관리자 UI 구현
- 사용자/상품 CRUD 흐름 구현
- 이미지 업로드 UX 개선
- 권한에 따른 UI 노출
- loading/empty/error 상태 처리
- API/type/formatting/list state 책임 분리
- 공통 LoadingState/ErrorState/EmptyState UI 패턴 정리
- 백엔드 응답 구조 기반 TypeScript 타입 정의
- 읽기 전용 운영 로그/알림 화면 구현

## Remaining Improvements

- API fetch wrapper 또는 Axios instance 도입
- access token 만료/refresh token 흐름 반영
- PageHeader route meta 기반 공통화
- SideBar active 메뉴 처리
- Users/Products form 공통화
- 숫자 페이지네이션/limit 변경/URL query sync 도입 시 pagination composable 검토
- README 최종 스크린샷/시연 이미지 추가
