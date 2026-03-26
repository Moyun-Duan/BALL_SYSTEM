import { View, Text, Image, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import { User } from '@/types/domain'

const MOCK_USER: User = {
  id: 'u1',
  nickname: '运动小达人',
  avatarUrl: 'https://placehold.co/100', // Placeholder
  gender: 'male',
  bio: '喜欢羽毛球，篮球，欢迎约球！',
  tags: ['求虐', '羽毛球'],
  stamina: 95
}

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [userInfo, setUserInfo] = useState<User | null>(MOCK_USER)

  const handleLogin = () => {
    // Mock Login
    setIsLoggedIn(true)
    setUserInfo(MOCK_USER)
    Taro.showToast({ title: '登录成功', icon: 'success' })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserInfo(null)
  }

  const navigateToHistory = () => {
    if (!isLoggedIn) return
    // Taro.navigateTo({ url: '/pages/profile/history/index' })
    Taro.showToast({ title: '功能开发中', icon: 'none' })
  }

  return (
    <View className='profile-container'>
      {/* Header / User Info */}
      <View className='user-card'>
        {isLoggedIn && userInfo ? (
          <View className='user-info'>
            <Image className='avatar' src={userInfo.avatarUrl} />
            <View className='info-col'>
              <Text className='nickname'>{userInfo.nickname}</Text>
              <Text className='bio'>{userInfo.bio || '暂无简介'}</Text>
              <View className='tags-row'>
                {userInfo.tags?.map(t => <Text key={t} className='tag'>{t}</Text>)}
              </View>
            </View>
            <Button className='btn-edit' size='mini'>编辑</Button>
          </View>
        ) : (
          <View className='login-prompt' onClick={handleLogin}>
            <View className='avatar-placeholder' />
            <Text className='login-text'>点击登录</Text>
          </View>
        )}
      </View>

      {/* Stats Row */}
      {isLoggedIn && (
        <View className='stats-row card'>
          <View className='stat-item'>
            <Text className='num'>12</Text>
            <Text className='desc'>组局</Text>
          </View>
          <View className='stat-item'>
            <Text className='num'>{userInfo?.stamina}</Text>
            <Text className='desc'>信誉分</Text>
          </View>
          <View className='stat-item'>
            <Text className='num'>5</Text>
            <Text className='desc'>关注</Text>
          </View>
        </View>
      )}

      {/* Menu List */}
      <View className='menu-list card'>
        <View className='menu-item' onClick={navigateToHistory}>
          <Text className='icon'>📅</Text>
          <Text className='label'>约球历史</Text>
          <Text className='arrow'>&gt;</Text>
        </View>
        <View className='menu-item'>
          <Text className='icon'>⚙️</Text>
          <Text className='label'>设置</Text>
          <Text className='arrow'>&gt;</Text>
        </View>
        <View className='menu-item'>
          <Text className='icon'>💬</Text>
          <Text className='label'>联系客服</Text>
          <Text className='arrow'>&gt;</Text>
        </View>
      </View>

      {/* Logout Button */}
      {isLoggedIn && (
        <Button className='btn-logout' onClick={handleLogout}>退出登录</Button>
      )}
    </View>
  )
}
