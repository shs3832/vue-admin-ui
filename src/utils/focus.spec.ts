// @vitest-environment jsdom

import { afterEach, describe, expect, it } from 'vitest'
import { ref } from 'vue'
import { focusFirstErrorField } from './focus'

// focus()와 document.activeElement를 실제 DOM처럼 확인하기 위해 이 파일만 jsdom 환경에서 실행한다.
// 실제 폼에서는 Vue가 template ref에 input을 연결하지만, 유틸 테스트에서는 DOM과 ref를 직접 준비한다.
afterEach(() => {
  // 이전 테스트의 DOM과 포커스 상태가 다음 테스트에 영향을 주지 않도록 body를 비운다.
  document.body.innerHTML = ''
})

describe('focusFirstErrorField', () => {
  it('오류가 있는 첫 번째 필드로 포커스를 이동한다', () => {
    const nameInput = document.createElement('input')
    const categoryInput = document.createElement('input')
    const priceInput = document.createElement('input')

    // jsdom에서도 focus 결과를 document.activeElement로 확인하려면 요소를 document에 연결해야 한다.
    document.body.append(nameInput, categoryInput, priceInput)

    // Vue 컴포넌트가 렌더링 후 template ref에 DOM을 넣어준 상태를 테스트에서 직접 만든다.
    const nameInputRef = ref<HTMLElement | null>(nameInput)
    const categoryInputRef = ref<HTMLElement | null>(categoryInput)
    const priceInputRef = ref<HTMLElement | null>(priceInput)

    const errorFields = [
      {
        ref: nameInputRef,
      },
      {
        error: '카테고리는 필수입니다.',
        ref: categoryInputRef,
      },
      {
        error: '가격을 확인해주세요.',
        ref: priceInputRef,
      },
    ]

    // 첫 필드는 정상이고 두 번째와 세 번째에 오류가 있으므로 두 번째 input이 포커스를 받아야 한다.
    focusFirstErrorField(errorFields)

    expect(document.activeElement).toBe(categoryInput)
  })
})
