import { shallow } from '@vue/test-utils'
import SyBlock from '@/components/block'

describe('SyBlock.vue', () => {
  it('should has class sy-block', () => {
    const wrapper = shallow(SyBlock)
    expect(wrapper.classes()).toContain('sy-block')
  })
})

describe('SyBlock.vue', () => {
  it('size will add inline style to modify width', () => {
    const size = 50
    const wrapper = shallow(SyBlock, {
      propsData: { size }
    })
    expect(wrapper.vm.customStyles).toEqual({
      width: `calc(${size}% - 20px)`,
      flexBasis: 'auto'
    })
  })
})
