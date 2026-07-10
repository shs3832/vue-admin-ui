# Vue Admin UI

`admin-api-be`와 연동되는 Vue 3 기반 관리자 UI 포트폴리오/학습 프로젝트입니다.

이 프로젝트는 Vue 전문 개발자가 되는 것보다, Vue 기반 운영 UI 코드를 읽고 작은 기능 추가, 수정, 디버깅, UI 개선 요청에 대응할 수 있는 수준까지 익히는 것을 목표로 합니다.

현재는 로그인, 대시보드, 사용자 관리, 상품 관리, 알림, 활동 로그까지 실제 API와 연결된 관리자 UI 흐름을 구현했습니다.

심화 과정에서는 API client, refresh token, permissions 기반 UI, route meta layout, form/dialog 접근성, URL query 기반 목록 상태 복원, meta API 기반 필터 옵션, 상품 단건 status 변경까지 확장하며 운영 UI에서 반복되는 구조를 정리하고 있습니다.

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

## Demo Account

외부 리뷰어가 배포된 관리자 UI를 확인할 수 있도록 테스트 전용 계정을 제공합니다.

```txt
Email: account_test@test.com
Password: account!@12
```

이 계정은 포트폴리오 시연과 기능 확인을 위한 용도입니다.

## Features

### Auth

- 로그인 화면
- access token 기반 인증 상태 관리
- Pinia auth store
- 새로고침 후 `/api/auth/me`를 통한 인증 상태 확인
- refresh token cookie 기반 재인증 흐름
- 로그인/보호 페이지 route guard
- 401 인증 만료 처리 공통화
- 로그아웃 처리

### Dashboard

- dashboard summary API 연동
- summary card UI
- loading/error 상태 처리

### Users

- 사용자 목록 조회
- role/status badge
- 검색, role/status filter
- sort
- URL query 기반 검색/필터/정렬/페이지 상태 복원
- meta API 기반 role/status count 표시
- pagination
- empty/loading/error 상태 처리
- 사용자 생성 form
- 사용자 수정 form
- 사용자 삭제 confirm dialog
- permissions 기반 생성/수정/삭제 버튼 노출

### Products

- 상품 목록 조회
- 상품 상태 badge
- 가격/재고/이미지 표시
- category/status filter
- sort
- URL query 기반 필터/정렬/페이지 상태 복원
- meta API 기반 category/status filter option 표시
- permissions 기반 상품 단건 status 변경
- 상태 변경 성공 후 상품 목록과 meta count 동기화
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

### Component Preview

- 공통 UI 컴포넌트 미리보기 라우트
- LoadingState/ErrorState/EmptyState 상태별 preview
- Users/Products/Notifications badge variant 확인
- 운영 화면과 분리된 내부 UI 확인 페이지

## Implementation Notes

### API Client and Error Flow

API 요청은 `src/api/client.ts`의 공통 client를 통해 처리합니다.

- API base URL과 Authorization header 구성
- JSON body와 `FormData` body 분기
- `204 No Content` 응답 처리
- 실패 응답을 `ApiError`로 정규화
- 서버 `fieldErrors`를 form field error로 연결
- refresh/logout 요청을 위한 `credentials` 옵션 지원

이 구조를 통해 view에서는 `response.ok`, `response.json()` 분기를 반복하지 않고 성공 데이터와 에러 표현에 집중할 수 있게 했습니다.

### Auth and Permissions

로그인, `/auth/me`, `/auth/refresh` 응답의 user 정보는 `src/types/auth.ts`의 `AuthUser` 타입으로 관리합니다.

백엔드에서 내려주는 `permissions` 객체를 기준으로 users/products 주요 액션 버튼을 노출합니다.

- `users.create/update/delete`
- `products.create/update`

프론트의 permissions 처리는 UX를 위한 1차 제어이며, 실제 권한 검증은 백엔드의 403 응답이 담당합니다.

### Route Meta Layout

각 route의 `meta.title`, `meta.description`을 기반으로 `AppShell`에서 공통 `PageHeader`를 렌더링합니다.

Vue Router의 `RouteMeta` 타입은 `src/types/router.d.ts`에서 확장했고, `document.title`도 route meta 기반으로 갱신합니다.

### Accessibility Flow

폼과 다이얼로그의 키보드/스크린리더 흐름을 보강했습니다.

- form label과 input id 연결
- `aria-invalid`, `aria-describedby` 적용
- validation 실패 시 첫 번째 에러 field로 focus 이동
- `src/utils/focus.ts`의 `focusFirstErrorField()`로 focus 로직 분리
- `ConfirmDialog`에 `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-describedby` 적용
- `useId()`로 dialog title/description id 충돌 방지
- dialog open 시 취소 버튼으로 focus 이동
- `Escape`로 닫기
- 취소/ESC 닫기 시 dialog를 열었던 삭제 버튼으로 focus 복귀

### List Query Flow

Users와 Products 목록은 검색, 필터, 정렬, 페이지 상태를 URL query와 동기화합니다.

- 새로고침 후에도 같은 목록 조건 복원
- URL 공유 시 같은 검색 결과 확인
- 뒤로가기/앞으로가기 흐름 유지
- 사용자가 새 검색/필터/정렬을 수행하면 page를 1로 초기화
- `limit=10`은 백엔드/API 정책으로 보고 URL에는 노출하지 않음

query 값은 화면에서 허용하는 값인지 검증한 뒤 상태에 반영합니다. 예를 들어 role/status/sort는 allow-list로 확인하고, page는 양의 정수만 허용합니다.

페이지네이션 UI는 `src/components/ui/PaginationBar.vue`로 공통화했고, 많은 페이지가 있을 때도 숫자 버튼은 최대 5개만 표시합니다.

### Meta API Filter Options

Users와 Products 필터 옵션은 백엔드 meta API 응답을 사용합니다.

- Users: role/status option과 count
- Products: category option, status option과 count

이를 통해 프론트에 고정된 필터 목록만 두지 않고, 백엔드 데이터 상태에 맞춰 운영자가 선택할 수 있는 조건을 표시합니다.

### Product Status Action

Products 목록에서는 `products.updateStatus` 권한이 있는 운영자에게 단건 상태 변경 액션을 제공합니다.

```txt
상품 선택
-> ConfirmDialog에서 다음 status 선택
-> PATCH /products/:id/status
-> 상품 목록과 products meta 동시 재조회
```

현재 상태와 같은 값은 요청 전에 차단하고, 상태 변경 실패는 목록 전체 오류와 분리해 dialog 안에 표시합니다. 요청 중에는 select와 확인/취소 버튼을 비활성화하고 ESC 닫기를 막아, 이미 시작된 요청이 취소된 것처럼 보이는 혼란을 줄였습니다.

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
formatDateTime('2026-06-24T00:00:00.000Z')
```

날짜 표시 규칙을 한 곳에 모아 Notifications, Activity Logs 등에서 재사용할 수 있게 했습니다.

금액 표시는 `src/utils/currency.ts`의 `formatCurrency` 유틸로 분리하여 상품 목록과 대시보드 매출 카드에서 같은 규칙을 사용합니다.

### Structure Refactor

Homework 13에서는 기능이 늘어나며 흩어지기 쉬운 API, type, formatting, list state 책임을 정리했습니다.

- API 요청 함수는 `src/api`로 이동
- TypeScript 타입 정의는 `src/types`로 이동
- 날짜/금액 formatting은 `src/utils`에서 관리
- 반복되는 list loading/empty 상태 계산은 `src/composables/useListStatus.ts`로 분리
- route query parsing은 `src/utils/query.ts`에서 관리
- pagination UI는 `src/components/ui/PaginationBar.vue`로 공통화

Pagination 계산과 URL query 동기화는 Users/Products에서 반복되기 시작했기 때문에 공통 UI와 query helper로 분리했습니다. 다만 도메인별 필터/정렬 allow-list는 각 View에 남겨 화면별 정책을 명확히 유지했습니다.

## Project Structure

```txt
src/
  api/
    activityLogs.ts
    auth.ts
    client.ts
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
  component-preview/
    ComponentPreview.vue
  composables/
    useListStatus.ts
  router/
  stores/
  styles/
  types/
    activityLogs.ts
    api.ts
    auth.ts
    dashboard.ts
    notifications.ts
    products.ts
    router.d.ts
    users.ts
  utils/
    currency.ts
    date.ts
    focus.ts
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
- API client 기반 요청/응답/에러 처리 공통화
- refresh token 기반 인증 복원 흐름
- 이미지 업로드 UX 개선
- permissions 기반 UI 노출
- route meta 기반 PageHeader/layout 정리
- form/dialog 접근성 focus flow 개선
- URL query 기반 목록 상태 복원
- sort/pagination/meta API 기반 필터 옵션
- permissions와 ConfirmDialog 기반 상품 단건 status 변경
- loading/empty/error 상태 처리
- API/type/formatting/list state 책임 분리
- 공통 LoadingState/ErrorState/EmptyState UI 패턴 정리
- Component Preview를 통한 공통 UI 상태와 badge variant 문서화
- 백엔드 응답 구조 기반 TypeScript 타입 정의
- 읽기 전용 운영 로그/알림 화면 구현
- 단순 CRUD를 넘어 운영자가 조건을 공유하고 복원할 수 있는 목록 UI 구현

## Remaining Improvements

- Users/Products input, select, outline button, table row 시각 대비 개선
- 반복 스타일이 충분히 쌓인 뒤 BaseButton/BaseInput/FormField 공통화 검토
- checkbox 선택 상태와 bulk status action 검토
- 핵심 유틸/composable/API error handling 테스트 추가
- Component Preview 확장
- React/Next 재구현 설계
- README 최종 스크린샷/시연 이미지 추가
