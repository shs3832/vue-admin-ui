import { describe, expect, it } from 'vitest'
import { getQueryPage, getQueryString } from './query'

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

describe('getQueryString', () => {
  it('문자열 값은 그대로 반환한다', () => {
    expect(getQueryString('selling')).toBe('selling')
  })

  it('문자열이 아닌 값은 빈 문자열로 보정한다', () => {
    expect(getQueryString(null)).toBe('')
  })
})
