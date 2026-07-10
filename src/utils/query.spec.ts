import { describe, expect, it } from 'vitest'
import { getQueryPage, getQueryString } from './query'

// URL query는 외부 입력이므로 그대로 신뢰하지 않고 화면에서 사용할 값으로 정규화한다.
// 이 파일은 정상값뿐 아니라 음수, 숫자가 아닌 값, null 같은 경계 입력의 보정 규칙을 보호한다.
describe('getQueryPage', () => {
  it('숫자 문자열을 페이지 번호로 변환한다', () => {
    expect(getQueryPage('2')).toBe(2)
  })

  it('1보다 작은 페이지 번호는 1로 보정한다', () => {
    expect(getQueryPage('-1')).toBe(1)
  })

  it('숫자가 아닌 문자열은 1로 보정한다', () => {
    expect(getQueryPage('abc')).toBe(1)
  })
})

// 문자열이 아닌 route query 값은 필터 상태에 직접 넣지 않고 빈 문자열로 바꾼다.
describe('getQueryString', () => {
  it('문자열 값은 그대로 반환한다', () => {
    expect(getQueryString('selling')).toBe('selling')
  })

  it('문자열이 아닌 값은 빈 문자열로 보정한다', () => {
    expect(getQueryString(null)).toBe('')
  })
})
