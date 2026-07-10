// @vitest-environment jsdom

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import PaginationBar from './PaginationBar.vue'

// 이 파일은 Vue 컴포넌트를 실제 DOM 형태로 렌더링하므로 Node 기본 환경 대신 jsdom을 사용한다.
// mount는 테스트용 부모처럼 props를 전달하고, wrapper는 렌더링 결과 탐색과 이벤트 실행을 담당한다.
describe('PaginationBar', () => {
  it('페이지 요약 정보를 표시한다', () => {
    const wrapper = mount(PaginationBar, {
      props: {
        pagination: {
          page: 1,
          limit: 10,
          total: 42,
          totalPages: 5,
        },
      },
    })

    expect(wrapper.get('p').text()).toBe('총 42개, 1 / 5 페이지')
  })

  it('첫 페이지에서 페이지 번호를 최대 5개 표시한다', () => {
    const wrapper = mount(PaginationBar, {
      props: {
        pagination: {
          page: 1,
          limit: 10,
          total: 80,
          totalPages: 8,
        },
      },
    })

    // visiblePages를 직접 검사하지 않고 사용자가 실제로 보는 버튼 문구와 순서를 검증한다.
    const buttonLabels = wrapper.findAll('button').map((button) => {
      return button.text()
    })

    expect(buttonLabels).toEqual(['이전', '1', '2', '3', '4', '5', '다음'])
  })

  it('중간 페이지에서 현재 페이지를 중심으로 5개 번호를 표시한다', () => {
    const wrapper = mount(PaginationBar, {
      props: {
        pagination: {
          page: 4,
          limit: 10,
          total: 80,
          totalPages: 8,
        },
      },
    })

    const buttonLabels = wrapper.findAll('button').map((button) => {
      return button.text()
    })

    expect(buttonLabels).toEqual(['이전', '2', '3', '4', '5', '6', '다음'])
  })

  it('마지막 페이지에서 전체 페이지를 넘지 않는 5개 번호를 표시한다', () => {
    const wrapper = mount(PaginationBar, {
      props: {
        pagination: {
          page: 8,
          limit: 10,
          total: 80,
          totalPages: 8,
        },
      },
    })

    const buttonLabels = wrapper.findAll('button').map((button) => {
      return button.text()
    })

    expect(buttonLabels).toEqual(['이전', '4', '5', '6', '7', '8', '다음'])
  })

  it('다음 버튼을 클릭하면 다음 페이지 번호를 emit한다', async () => {
    const wrapper = mount(PaginationBar, {
      props: {
        pagination: {
          page: 4,
          limit: 10,
          total: 80,
          totalPages: 8,
        },
      },
    })

    await wrapper.get('button:last-child').trigger('click')

    // emitted 결과는 [이벤트 발생 횟수][각 이벤트에 전달된 인자] 형태의 중첩 배열이다.
    expect(wrapper.emitted('changePage')).toEqual([[5]])
  })

  it('첫 페이지에서는 이전 버튼을 비활성화한다', () => {
    const wrapper = mount(PaginationBar, {
      props: {
        pagination: {
          page: 1,
          limit: 10,
          total: 80,
          totalPages: 8,
        },
      },
    })

    const previousButton = wrapper.get('button:first-child')

    // attributes()는 속성이 없으면 undefined를 반환하므로 존재 여부를 toBeDefined로 확인한다.
    expect(previousButton.attributes('disabled')).toBeDefined()
  })

  it('마지막 페이지에서는 다음 버튼을 비활성화한다', () => {
    const wrapper = mount(PaginationBar, {
      props: {
        pagination: {
          page: 8,
          limit: 10,
          total: 80,
          totalPages: 8,
        },
      },
    })

    const nextButton = wrapper.get('button:last-child')

    expect(nextButton.attributes('disabled')).toBeDefined()
  })
})
