import { View, Text, Button } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

const QUICK_LINKS = [
  {
    code: 'LOB',
    title: '进入大厅',
    desc: '浏览当前开放球局',
    action: () => Taro.switchTab({ url: '/pages/lobby/index' })
  },
  {
    code: 'NEW',
    title: '发起组局',
    desc: '创建一个可直接补位的房间',
    action: () => Taro.navigateTo({ url: '/pages/room/create/index' })
  },
  {
    code: 'ME',
    title: '个人中心',
    desc: '管理历史和信誉',
    action: () => Taro.switchTab({ url: '/pages/profile/index' })
  }
]

export default function Index() {
  return (
    <View className='page-shell landing-page'>
      <View className='hero-panel landing-hero'>
        <Text className='section-eyebrow section-eyebrow--light'>Ball System</Text>
        <Text className='display-title'>完整的约球前端骨架已经搭好</Text>
        <Text className='hero-copy'>大厅负责筛选，房间负责分队，创建页负责把信息写清楚，个人页负责回收用户关系和历史状态。</Text>
      </View>

      {QUICK_LINKS.map((item) => (
        <View key={item.code} className='paper-card landing-card' onClick={item.action}>
          <Text className='landing-card__code'>{item.code}</Text>
          <Text className='section-title'>{item.title}</Text>
          <Text className='body-copy'>{item.desc}</Text>
        </View>
      ))}

      <Button className='pill-button pill-button--dark landing-button' onClick={QUICK_LINKS[0].action}>现在去大厅</Button>
    </View>
  )
}
