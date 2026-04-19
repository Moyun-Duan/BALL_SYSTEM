import { View, Text, Input, ScrollView, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import { Room } from '@/types/domain'

type JoinMode = 'direct' | 'approval'

interface LobbyRoom extends Room {
  hostName: string
  hostTheme: 'cyan' | 'orange' | 'yellow' | 'blue'
  joinMode: JoinMode
  inviteCode: string
  organizationLabel: string
  levelLabel: string
  atmosphereLabel: string
  memberNicknames: string[]
}

const SPORT_LABELS: Record<string, string> = {
  badminton: '羽毛球',
  basketball: '篮球',
  tennis: '网球',
  football: '足球',
  volleyball: '排球',
  pingpong: '乒乓球'
}

const SEARCH_TAGS = ['全部', '羽毛球', '篮球', '网球', '晚上', '新手友好', '学院局', '社团', '休闲氛围', '对抗局']

const MOCK_ROOMS: LobbyRoom[] = [
  {
    id: '101',
    hostId: 'u1',
    title: '夜场双打补位',
    description: '欢迎直接进房，已预约 2 号场，球局未开始，公开可搜。',
    sportType: 'badminton',
    date: '2026-04-20',
    startTime: '19:00',
    endTime: '21:00',
    location: '紫金港风雨操场 2 号场',
    genderRequirement: 'mixed',
    minPeople: 4,
    maxPeople: 6,
    currentPeople: 4,
    tags: ['羽毛球', '晚上', '新手友好', '学院局'],
    status: 'open',
    members: [],
    isPrivate: false,
    joinMode: 'direct',
    inviteCode: 'BD2026',
    organizationLabel: '求是学院',
    skillLabel: '新手到进阶',
    atmosphereLabel: '休闲氛围',
    partnerCodeRequired: true,
    partnerCode: 'HZD-BD-22',
    hostName: '阿树',
    hostTheme: 'cyan',
    levelLabel: '新手友好',
    memberNicknames: ['阿树', '小满', 'Yuki']
  },
  {
    id: '102',
    hostId: 'u2',
    title: '半场3v3冲刺局',
    description: '搜索后需要申请加入，房主审核通过再进房。',
    sportType: 'basketball',
    date: '2026-04-20',
    startTime: '18:30',
    endTime: '20:00',
    location: '玉泉室外篮球场',
    genderRequirement: 'all_male',
    minPeople: 6,
    maxPeople: 8,
    currentPeople: 5,
    tags: ['篮球', '晚上', '对抗局', '社团'],
    status: 'open',
    members: [],
    isPrivate: false,
    joinMode: 'approval',
    inviteCode: 'BK3301',
    organizationLabel: '篮球社',
    skillLabel: '进阶对抗',
    atmosphereLabel: '高强度',
    partnerCodeRequired: false,
    hostName: 'Leon',
    hostTheme: 'orange',
    levelLabel: '进阶对抗',
    memberNicknames: ['Leon', 'Chris']
  },
  {
    id: '103',
    hostId: 'u3',
    title: '午后网球练习',
    description: '练发球和对拉，适合想找固定搭子的人。',
    sportType: 'tennis',
    date: '2026-04-21',
    startTime: '15:00',
    endTime: '17:00',
    location: '西溪网球场 1 号',
    genderRequirement: 'mixed',
    minPeople: 2,
    maxPeople: 4,
    currentPeople: 2,
    tags: ['网球', '休闲氛围', '学院局'],
    status: 'open',
    members: [],
    isPrivate: false,
    joinMode: 'direct',
    inviteCode: 'TN7788',
    organizationLabel: '丹青学园',
    skillLabel: '恢复手感',
    atmosphereLabel: '轻松练习',
    partnerCodeRequired: true,
    partnerCode: 'HZD-TN-19',
    hostName: 'Cici',
    hostTheme: 'blue',
    levelLabel: '轻松练习',
    memberNicknames: ['Cici', 'Mia']
  },
  {
    id: '104',
    hostId: 'u4',
    title: '私密排球局',
    description: '仅邀请码加入，不出现在公开搜索。',
    sportType: 'volleyball',
    date: '2026-04-20',
    startTime: '20:00',
    endTime: '22:00',
    location: '华家池体育馆',
    genderRequirement: 'mixed',
    minPeople: 8,
    maxPeople: 12,
    currentPeople: 9,
    tags: ['排球'],
    status: 'open',
    members: [],
    isPrivate: true,
    joinMode: 'approval',
    inviteCode: 'VB9982',
    organizationLabel: '社团',
    skillLabel: '中级',
    atmosphereLabel: '熟人局',
    partnerCodeRequired: false,
    hostName: 'Lina',
    hostTheme: 'yellow',
    levelLabel: '熟人局',
    memberNicknames: ['Lina']
  }
]

const SEARCHABLE_ROOMS = MOCK_ROOMS.filter((room) => room.status === 'open' && !room.isPrivate)

const avatarClassMap = {
  cyan: '',
  orange: 'avatar-token--orange',
  yellow: 'avatar-token--yellow',
  blue: 'avatar-token--blue'
}

const getTimeBucket = (time: string) => {
  const hour = Number(time.split(':')[0])
  if (hour < 12) {
    return '上午'
  }
  if (hour < 18) {
    return '下午'
  }
  return '晚上'
}

const truncateTitle = (title: string) => (title.length > 8 ? `${title.slice(0, 8)}...` : title)

const buildSearchIndex = (room: LobbyRoom) =>
  [
    room.title,
    room.description || '',
    SPORT_LABELS[room.sportType],
    room.location,
    room.date,
    getTimeBucket(room.startTime),
    room.organizationLabel,
    room.skillLabel || '',
    room.atmosphereLabel || '',
    room.hostName,
    ...room.memberNicknames,
    ...(room.tags || [])
  ]
    .join('|')
    .toLowerCase()

export default function Lobby() {
  const [keywordInput, setKeywordInput] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [inviteCodeInput, setInviteCodeInput] = useState('')
  const [showInviteBox, setShowInviteBox] = useState(false)
  const [visibleRooms, setVisibleRooms] = useState<LobbyRoom[]>(SEARCHABLE_ROOMS)
  const [resultSummary, setResultSummary] = useState('展示全部未开始的公开房间')

  const resetFilters = () => {
    setKeywordInput('')
    setSelectedTags([])
    setVisibleRooms(SEARCHABLE_ROOMS)
    setResultSummary('已清空标签和关键词，恢复全部房间')
  }

  const viewAllRooms = () => {
    setVisibleRooms(SEARCHABLE_ROOMS)
    setResultSummary('当前展示全部可搜索房间')
  }

  const runSearch = async () => {
    const keyword = keywordInput.trim().toLowerCase()
    const results = SEARCHABLE_ROOMS.filter((room) => {
      const searchIndex = buildSearchIndex(room)
      const matchKeyword = !keyword || searchIndex.includes(keyword)
      const matchTags = !selectedTags.length || selectedTags.every((tag) => searchIndex.includes(tag.toLowerCase()))
      return matchKeyword && matchTags
    })

    setVisibleRooms(results)
    setResultSummary(
      results.length
        ? `筛到 ${results.length} 个房间，支持“关键词 + 标签”组合`
        : '当前没有搜索结果'
    )

    if (!results.length) {
      const modalResult = await Taro.showModal({
        title: '搜索结果',
        content: '无符合条件的结果，试试其他关键词吧～',
        cancelText: '清空标签及关键词',
        confirmText: '查看全部房间'
      })

      if (modalResult.confirm) {
        viewAllRooms()
      } else {
        resetFilters()
      }
    }
  }

  const toggleTag = (tag: string) => {
    if (tag === '全部') {
      setSelectedTags([])
      return
    }

    setSelectedTags((current) =>
      current.includes(tag) ? current.filter((item) => item !== tag) : [...current, tag]
    )
  }

  const navigateToDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/room/detail/index?id=${id}` })
  }

  const handleCreateRoom = () => {
    Taro.navigateTo({ url: '/pages/room/create/index' })
  }

  const handleJoinRoom = (room: LobbyRoom) => {
    if (room.joinMode === 'direct') {
      Taro.showToast({
        title: room.partnerCodeRequired ? '已加入，记得查看同伴码' : '加入成功',
        icon: 'none'
      })
      navigateToDetail(room.id)
      return
    }

    Taro.showToast({ title: '申请已发送，等待房主审核', icon: 'none' })
  }

  const handleInviteJoin = () => {
    const code = inviteCodeInput.trim().toUpperCase()
    if (!code) {
      Taro.showToast({ title: '请输入邀请码', icon: 'none' })
      return
    }

    const room = MOCK_ROOMS.find((item) => item.inviteCode === code)
    if (!room) {
      Taro.showToast({ title: '邀请码不存在', icon: 'none' })
      return
    }

    if (room.isPrivate) {
      Taro.showToast({ title: `已通过邀请码进入 ${room.title}`, icon: 'none' })
      navigateToDetail(room.id)
      return
    }

    handleJoinRoom(room)
  }

  return (
    <View className='page-shell lobby-page'>
      <View className='hero-panel lobby-hero'>
        <Text className='section-eyebrow section-eyebrow--light'>Lobby Search</Text>
        <Text className='display-title'>搜索公开房间，直接加入或申请加入</Text>
        <Text className='hero-copy'>仅活动未开始、公开房间可被搜索。支持关键词模糊搜索、标签组合筛选，以及通过邀请码快速进房。</Text>

        <View className='metric-grid lobby-hero__metrics'>
          <View className='metric-card'>
            <Text className='metric-card__label'>公开房间</Text>
            <Text className='metric-card__value'>{SEARCHABLE_ROOMS.length}</Text>
            <Text className='metric-card__desc'>只展示可搜索球局</Text>
          </View>
          <View className='metric-card'>
            <Text className='metric-card__label'>直接加入</Text>
            <Text className='metric-card__value'>{SEARCHABLE_ROOMS.filter((room) => room.joinMode === 'direct').length}</Text>
            <Text className='metric-card__desc'>点按钮立即进房</Text>
          </View>
          <View className='metric-card'>
            <Text className='metric-card__label'>需审核</Text>
            <Text className='metric-card__value'>{SEARCHABLE_ROOMS.filter((room) => room.joinMode === 'approval').length}</Text>
            <Text className='metric-card__desc'>申请后等待房主同意</Text>
          </View>
        </View>
      </View>

      <View className='paper-card search-card'>
        <Text className='section-eyebrow'>Search Engine</Text>
        <Text className='section-title'>组队大厅</Text>
        <Text className='body-copy search-card__copy'>可搜球类、地点、日期 + 上午/下午/晚上、学园/院系/社团、个人水平/打球风格、房间名称、球友昵称。</Text>

        <View className='search-toolbar'>
          <View className='search-composer'>
            <Input
              className='search-composer__input'
              placeholder='最多 30 字，输入后点击搜索'
              value={keywordInput}
              maxlength={30}
              confirmType='search'
              onInput={(e) => setKeywordInput(e.detail.value)}
              onConfirm={runSearch}
            />
            <View className='search-composer__submit' onClick={runSearch}>搜索</View>
          </View>
          <View className='invite-toggle' onClick={() => setShowInviteBox((current) => !current)}>
            {showInviteBox ? '收起邀请码' : '邀请码入口'}
          </View>
        </View>

        {showInviteBox && (
          <View className='invite-box'>
            <Input
              className='invite-box__input'
              placeholder='输入邀请码直接加入'
              value={inviteCodeInput}
              maxlength={12}
              onInput={(e) => setInviteCodeInput(e.detail.value.toUpperCase())}
            />
            <Button className='pill-button pill-button--secondary invite-box__button' onClick={handleInviteJoin}>凭码加入</Button>
          </View>
        )}

        <ScrollView scrollX className='tag-strip' showScrollbar={false}>
          <View className='tag-strip__inner'>
            {SEARCH_TAGS.map((tag) => {
              const active = tag === '全部' ? !selectedTags.length : selectedTags.includes(tag)
              return (
                <View
                  key={tag}
                  className={`tag-pill ${active ? 'tag-pill--active' : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </View>
              )
            })}
          </View>
        </ScrollView>

        <View className='search-result-head'>
          <Text className='meta-inline'>{resultSummary}</Text>
          <View className='search-result-head__actions'>
            <View className='link-action' onClick={resetFilters}>清空</View>
            <View className='link-action' onClick={viewAllRooms}>全部房间</View>
          </View>
        </View>
      </View>

      <View className='lobby-list'>
        {visibleRooms.map((room) => (
          <View key={room.id} className='paper-card room-row' onClick={() => navigateToDetail(room.id)}>
            <View className='room-row__header'>
              <View className={`avatar-token ${avatarClassMap[room.hostTheme]}`}>{room.hostName.slice(0, 1)}</View>
              <View className='room-row__main'>
                <Text className='room-row__host'>{room.hostName}</Text>
                <Text className='room-row__title'>{truncateTitle(room.title)}</Text>
                <Text className='room-row__meta'>
                  {SPORT_LABELS[room.sportType]} · {room.location} · {room.date} {getTimeBucket(room.startTime)}
                </Text>
              </View>
              <Button
                className={`pill-button room-row__join ${room.joinMode === 'direct' ? 'pill-button--primary' : 'pill-button--secondary'}`}
                onClick={(e) => {
                  e.stopPropagation?.()
                  handleJoinRoom(room)
                }}
              >
                {room.joinMode === 'direct' ? '直接加入' : '申请加入'}
              </Button>
            </View>

            <View className='chip-row room-row__chips'>
              <Text className='chip'>{room.organizationLabel}</Text>
              <Text className='chip chip--blue'>{room.skillLabel}</Text>
              <Text className='chip chip--warning'>{room.atmosphereLabel}</Text>
              {room.partnerCodeRequired && <Text className='chip chip--orange'>需同伴码</Text>}
            </View>

            <View className='detail-info-row room-row__detail'>
              <Text className='detail-info-row__label'>搜索词覆盖</Text>
              <Text className='detail-info-row__value'>
                房间名 / 昵称 / 学园标签 / {getTimeBucket(room.startTime)} / {room.inviteCode}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <Button className='pill-button pill-button--primary lobby-create-button' onClick={handleCreateRoom}>创建房间</Button>
    </View>
  )
}
