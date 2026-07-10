// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import ProductFilterBar from './ProductFilterBar.vue'

// ProductFilterBar는 권한을 직접 계산하지 않고 부모가 전달한 canCreateProduct 결과만 UI에 반영한다.
// 이 파일은 false일 때 버튼이 없고 true일 때 버튼이 생기는 양방향 렌더링 계약을 검증한다.
describe('ProductFilterBar', () => {
  it('상품 생성 권한이 없으면 상품 생성 버튼을 표시하지 않는다', () => {
    const wrapper = mount(ProductFilterBar, {
      props: {
        selectedCategory: '',
        selectedStatus: '',
        selectedSort: '',
        categories: [],
        statuses: [],
        canCreateProduct: false,
      },
    })

    // 렌더링된 모든 버튼의 문구를 배열로 만들어 상품 생성 버튼 포함 여부를 확인한다.
    const buttonLabels = wrapper.findAll('button').map((button) => {
      return button.text()
    })

    expect(buttonLabels).not.toContain('상품 생성')
  })

  it('상품 생성 권한이 있으면 상품 생성 버튼을 표시한다', () => {
    const wrapper = mount(ProductFilterBar, {
      props: {
        selectedCategory: '',
        selectedStatus: '',
        selectedSort: '',
        categories: [],
        statuses: [],
        canCreateProduct: true,
      },
    })

    const buttonLabels = wrapper.findAll('button').map((button) => {
      return button.text()
    })

    expect(buttonLabels).toContain('상품 생성')
  })
})
