# Commit Message Rule

커밋 메시지는 Conventional Commit prefix와 한글 요약을 함께 사용한다.

```txt
<type>: <한글 요약>
```

## Types

- `feat`: 기능 추가
- `fix`: 버그 수정
- `refactor`: 동작 변경 없는 구조 개선
- `docs`: 문서 수정
- `style`: 포맷, 스타일 수정
- `chore`: 설정, 빌드, 기타 작업
- `test`: 테스트 추가/수정

## Examples

```txt
feat: 상품 이미지 업로드 기능 추가
fix: 새로고침 시 404 발생 문제 수정
refactor: API 요청 함수 구조 정리
docs: README 사용 방법 정리
chore: Netlify 배포 설정 추가
test: 목록 상태 계산 테스트 추가
```

## Rule

AI가 커밋 메시지를 생성할 때도 반드시 한글 요약을 사용한다.

영문 prefix는 변경 성격을 분류하기 위해 유지하고, 설명은 나중에 빠르게 복기할 수 있도록 한글로 작성한다.

## Type Selection Guide

사용자에게 보이는 문제를 해결했다면 `fix`를 우선 사용한다.

```txt
fix: 새로고침 시 404 발생 문제 수정
```

새 기능이나 화면이 추가되었다면 `feat`를 사용한다.

```txt
feat: 컴포넌트 프리뷰 페이지 추가
```

동작은 그대로 두고 구조만 개선했다면 `refactor`를 사용한다.

```txt
refactor: 인증 API 요청 함수 분리
```

문서만 수정했다면 `docs`를 사용한다.

```txt
docs: 포트폴리오 심화 로드맵 정리
```

배포 설정, 빌드 설정, 개발 환경 정리처럼 사용자 기능과 직접 연결되지 않는 작업은 `chore`를 사용한다.

```txt
chore: Netlify 배포 설정 추가
```
