import { View, Text, Button, Input, Picker, Textarea } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import { User } from '@/types/domain'

const GENDER_LABELS = ['男', '女', '未知']
const AVATAR_THEMES = [
  { key: 'cyan', label: '青色' },
  { key: 'orange', label: '橙色' },
  { key: 'yellow', label: '黄色' },
  { key: 'blue', label: '蓝色' }
] as const

const avatarThemeClassMap = {
  cyan: '',
  orange: 'avatar-token--orange',
  yellow: 'avatar-token--yellow',
  blue: 'avatar-token--blue'
}

const MOCK_HISTORY = [
  { id: 'h1', title: '夜场双打补位', date: '2026-04-18', status: '已完成', role: '房主' },
  { id: 'h2', title: '半场 3v3 冲刺局', date: '2026-04-15', status: '已参加', role: '队员' },
  { id: 'h3', title: '午后网球练习', date: '2026-04-10', status: '已取消', role: '申请中断' }
]

const INITIAL_USER: User = {
  id: 'u1',
  nickname: '运动小达人',
  avatarUrl: '',
  gender: 'male',
  bio: '喜欢羽毛球和篮球，愿意提前确认人数和到场时间。',
  tags: ['新手友好', '靠谱到场'],
  stamina: 95,
  avatarTheme: 'cyan',
  badmintonPartnerCode: 'HZD-BD-22',
  tennisPartnerCode: 'HZD-TN-19'
}

const genderToIndex = (gender: User['gender']) => {
  if (gender === 'female') {
    return 1
  }
  if (gender === 'unknown') {
    return 2
  }
  return 0
}

const indexToGender = (index: number): User['gender'] => {
  if (index === 1) {
    return 'female'
  }
  if (index === 2) {
    return 'unknown'
  }
  return 'male'
}

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState<User | null>(INITIAL_USER)
  const [draftUser, setDraftUser] = useState<User>(INITIAL_USER)

  const handleLogin = () => {
    setIsLoggedIn(true)
    setUserInfo(INITIAL_USER)
    setDraftUser(INITIAL_USER)
    Taro.showToast({ title: '登录成功', icon: 'success' })
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsEditing(false)
    setUserInfo(null)
    Taro.showToast({ title: '已退出登录', icon: 'none' })
  }

  const handleStartEdit = () => {
    if (!userInfo) return
    setDraftUser(userInfo)
    setIsEditing(true)
  }

  const handleSave = () => {
    setUserInfo(draftUser)
    setIsEditing(false)
    Taro.showToast({ title: '资料已保存', icon: 'success' })
  }

  const openHistory = () => {
    if (!isLoggedIn) return
    Taro.showToast({ title: '历史已在下方展示', icon: 'none' })
  }

  return (
    <View className='page-shell profile-page'>
      <View className='hero-panel profile-hero'>
        {isLoggedIn && userInfo ? (
          <View>
            <Text className='section-eyebrow section-eyebrow--light'>Profile</Text>
            <View className='profile-head'>
              <View className={`avatar-token profile-avatar ${avatarThemeClassMap[userInfo.avatarTheme || 'cyan']}`}>
                {userInfo.nickname.slice(0, 1)}
              </View>
              <View className='profile-head__meta'>
                <Text className='display-title profile-name'>{userInfo.nickname}</Text>
                <Text className='hero-copy'>{userInfo.bio}</Text>
              </View>
            </View>

            <View className='chip-row profile-tags'>
              {(userInfo.tags || []).map((tag) => (
                <Text key={tag} className='chip chip--light'>{tag}</Text>
              ))}
            </View>

            <View className='metric-grid profile-metrics'>
              <View className='metric-card'>
                <Text className='metric-card__label'>信誉分</Text>
                <Text className='metric-card__value'>{userInfo.stamina || 95}</Text>
                <Text className='metric-card__desc'>作为快速组队参考</Text>
              </View>
              <View className='metric-card'>
                <Text className='metric-card__label'>羽毛球同伴码</Text>
                <Text className='metric-card__value'>{userInfo.badmintonPartnerCode || '--'}</Text>
                <Text className='metric-card__desc'>羽毛球房间加入时可查看</Text>
              </View>
              <View className='metric-card'>
                <Text className='metric-card__label'>网球同伴码</Text>
                <Text className='metric-card__value'>{userInfo.tennisPartnerCode || '--'}</Text>
                <Text className='metric-card__desc'>网球房间同样支持</Text>
              </View>
            </View>
          </View>
        ) : (
          <View>
            <Text className='section-eyebrow section-eyebrow--light'>Profile</Text>
            <Text className='display-title'>登录后可设置资料与查看历史</Text>
            <Text className='hero-copy'>个人页支持设置头像、昵称、性别、简介，以及维护羽毛球和网球的同伴码。</Text>
            <Button className='pill-button pill-button--secondary profile-login-button' onClick={handleLogin}>登录</Button>
          </View>
        )}
      </View>

      {isLoggedIn && userInfo && (
        <>
          <View className='paper-card'>
            <View className='profile-card-head'>
              <View>
                <Text className='section-eyebrow'>Settings</Text>
                <Text className='section-title'>个人资料</Text>
              </View>
              {isEditing ? (
                <Button className='pill-button pill-button--primary profile-card-head__button' onClick={handleSave}>保存</Button>
              ) : (
                <Button className='pill-button pill-button--secondary profile-card-head__button' onClick={handleStartEdit}>编辑</Button>
              )}
            </View>

            {isEditing ? (
              <View>
                <View className='avatar-theme-row'>
                  {AVATAR_THEMES.map((theme) => (
                    <View
                      key={theme.key}
                      className={`avatar-theme-pill ${draftUser.avatarTheme === theme.key ? 'avatar-theme-pill--active' : ''}`}
                      onClick={() => setDraftUser({ ...draftUser, avatarTheme: theme.key })}
                    >
                      {theme.label}
                    </View>
                  ))}
                </View>

                <View className='detail-info-row'>
                  <Text className='detail-info-row__label'>昵称</Text>
                  <Input
                    className='detail-info-row__value profile-input'
                    maxlength={12}
                    value={draftUser.nickname}
                    onInput={(e) => setDraftUser({ ...draftUser, nickname: e.detail.value })}
                  />
                </View>

                <View className='detail-info-row'>
                  <Text className='detail-info-row__label'>性别</Text>
                  <Picker
                    mode='selector'
                    range={GENDER_LABELS}
                    value={genderToIndex(draftUser.gender)}
                    onChange={(e) => setDraftUser({ ...draftUser, gender: indexToGender(Number(e.detail.value)) })}
                  >
                    <View className='detail-info-row__value profile-input'>{GENDER_LABELS[genderToIndex(draftUser.gender)]}</View>
                  </Picker>
                </View>

                <View className='detail-info-row'>
                  <Text className='detail-info-row__label'>羽毛球同伴码</Text>
                  <Input
                    className='detail-info-row__value profile-input'
                    value={draftUser.badmintonPartnerCode || ''}
                    onInput={(e) => setDraftUser({ ...draftUser, badmintonPartnerCode: e.detail.value.toUpperCase() })}
                  />
                </View>

                <View className='detail-info-row'>
                  <Text className='detail-info-row__label'>网球同伴码</Text>
                  <Input
                    className='detail-info-row__value profile-input'
                    value={draftUser.tennisPartnerCode || ''}
                    onInput={(e) => setDraftUser({ ...draftUser, tennisPartnerCode: e.detail.value.toUpperCase() })}
                  />
                </View>

                <View className='profile-bio-edit'>
                  <Text className='profile-bio-edit__label'>个人简介</Text>
                  <Textarea
                    className='profile-bio-edit__textarea'
                    maxlength={120}
                    value={draftUser.bio || ''}
                    onInput={(e) => setDraftUser({ ...draftUser, bio: e.detail.value })}
                  />
                </View>
              </View>
            ) : (
              <View>
                <View className='detail-info-row'>
                  <Text className='detail-info-row__label'>昵称</Text>
                  <Text className='detail-info-row__value'>{userInfo.nickname}</Text>
                </View>
                <View className='detail-info-row'>
                  <Text className='detail-info-row__label'>性别</Text>
                  <Text className='detail-info-row__value'>{GENDER_LABELS[genderToIndex(userInfo.gender)]}</Text>
                </View>
                <View className='detail-info-row'>
                  <Text className='detail-info-row__label'>个人简介</Text>
                  <Text className='detail-info-row__value'>{userInfo.bio}</Text>
                </View>
              </View>
            )}
          </View>

          <View className='paper-card'>
            <View className='profile-card-head'>
              <View>
                <Text className='section-eyebrow'>History</Text>
                <Text className='section-title'>约球历史记录</Text>
              </View>
              <View className='history-link' onClick={openHistory}>查看提醒</View>
            </View>

            {MOCK_HISTORY.map((item) => (
              <View key={item.id} className='history-row'>
                <View className='history-row__main'>
                  <Text className='history-row__title'>{item.title}</Text>
                  <Text className='history-row__meta'>{item.date} · {item.role}</Text>
                </View>
                <Text className={`history-row__status history-row__status--${item.status === '已取消' ? 'cancelled' : 'normal'}`}>
                  {item.status}
                </Text>
              </View>
            ))}
          </View>

          <Button className='pill-button pill-button--plain profile-logout' onClick={handleLogout}>退出登录</Button>
        </>
      )}
    </View>
  )
}
