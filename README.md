# Vue Admin UI

`admin-api-be`와 연동되는 Vue 3 기반 관리자 UI 학습 프로젝트입니다.

이 프로젝트는 Vue 전문 개발자가 되는 것보다, Vue 기반 운영 UI 코드를 읽고 작은 기능 추가, 수정, 디버깅, UI 개선 요청에 대응할 수 있는 수준까지 익히는 것을 목표로 합니다.

## Tech Stack

- Vue 3.5.x
- Vite
- TypeScript
- Tailwind CSS
- Vue Router
- Pinia

## Backend API

```txt
https://admin-api-be.onrender.com
```

API base URL은 `.env`에서 관리합니다. 실제 환경 파일은 커밋하지 않고, 필요한 값은 `.env.example`을 기준으로 작성합니다.

## Project Setup

```sh
npm install
```

## Development

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

## Current Homework

### Homework 01. Project Setup

현재 단계에서는 기능 구현보다 기본 개발 환경과 프로젝트 구조를 확인합니다.

- Vue 3 + TypeScript + Vite 프로젝트 생성
- Tailwind CSS 전역 스타일 연결
- Vue Router 기본 route 구성
- `HomeView`, `AboutView` 임시 화면 연결
- `.env.example`에 API base URL 예시 작성
- 이후 과제를 위한 기본 폴더 구조 준비

## Source Structure

```txt
src/
  app/
  assets/
  components/
    layout/
    patterns/
    ui/
  features/
    auth/
    dashboard/
    products/
    users/
  lib/
    api/
    constants/
    utils/
  router/
  stores/
  styles/
  views/
```

처음부터 모든 폴더를 채우기보다, 이후 auth, dashboard, users, products 기능을 넣을 위치를 미리 정리하는 목적입니다.

## Learning Notes

이번 단계에서 확인할 핵심 개념은 다음과 같습니다.

- `main.ts`: Vue 앱을 생성하고 Router, Pinia를 연결한 뒤 `#app`에 mount하는 진입점
- `App.vue`: 전체 앱의 가장 바깥 컴포넌트
- `RouterLink`: 페이지 이동 링크
- `RouterView`: 현재 route에 맞는 view 컴포넌트가 렌더링되는 자리
- `src/styles/main.css`: Tailwind CSS를 불러오는 전역 스타일 파일

## Portfolio Direction

최종적으로는 실제 백엔드 API와 연동되는 관리자 UI를 구현하며, 반복되는 테이블, 검색, 필터, 폼, 상태 표시, 권한 UI를 공통 컴포넌트와 패턴으로 정리하는 것을 목표로 합니다.
