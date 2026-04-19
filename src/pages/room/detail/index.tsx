import { View, Text, Button } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import { Room, User } from '@/types/domain'

type SeatKey = 'a' | 'b' | 'bench'

interface TeamMember extends User {
  seat: SeatKey
  remark: string
}

interface SeatConfig {
  key: SeatKey
  name: string
  desc: string
  capacity: number
}

interface DetailRoom extends Room {
  hostName: string
  hostTheme: 'cyan' | 'orange' | 'yellow' | 'blue'
  joinMode: 'direct' | 'approval'
  inviteCode: string
  organizationLabel: string
  levelLabel: string
  atmosphereLabel: string
  partnerCodeRequired: boolean
  partnerCode?: string
  seats: SeatConfig[]
  members: TeamMember[]
}

const SPORT_LABELS: Record<string, string> = {
  badminton: '羽毛球',
  basketball: '篮球',
  tennis: '网球',
  football: '足球',
  volleyball: '排球',
  pingpong: '乒乓球'
}

const avatarThemeClassMap = {
  cyan: '',
  orange: 'avatar-token--orange',
  yellow: 'avatar-token--yellow',
  blue: 'avatar-token--blue'
}

const MY_MEMBER: TeamMember = {
  id: 'me',
  nickname: '我',
  avatarUrl: '',
  gender: 'male',
  seat: 'bench',
  remark: '待确认'
}

const ROOM_MAP: Record<string, DetailRoom> = {
  '101': {
    id: '101',
    hostId: 'u1',
    title: '夜场双打补位',
    description: '房主已经排好黑队 / 白队 / 候补。羽毛球房间需要同伴码，可通过搜索、直接加入或邀请码进房。',
    sportType: 'badminton',
    date: '2026-04-20',
    startTime: '19:00',
    endTime: '21:00',
    location: '紫金港风雨操场 2 号场',
    genderRequirement: 'mixed',
    minPeople: 4,
    maxPeople: 6,
    currentPeople: 4,
    tags: ['学院局', '新手友好'],
    status: 'open',
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
    seats: [
      { key: 'a', name: 'A 队', desc: '先发主打', capacity: 2 },
      { key: 'b', name: 'B 队', desc: '轮换补位', capacity: 2 },
      { key: 'bench', name: '候补区', desc: '迟到或待确认', capacity: 2 }
    ],
    members: [
      { id: 'u1', nickname: '阿树', avatarUrl: '', gender: 'male', seat: 'a', remark: '房主 / 先发' },
      { id: 'u2', nickname: '小满', avatarUrl: '', gender: 'female', seat: 'a', remark: '稳定后场' },
      { id: 'u3', nickname: 'Yuki', avatarUrl: '', gender: 'female', seat: 'b', remark: '补位主攻' },
      { id: 'u4', nickname: 'Mia', avatarUrl: '', gender: 'female', seat: 'bench', remark: '已到场待确认' }
    ]
  },
  '102': {
    id: '102',
    hostId: 'u2',
    title: '半场3v3冲刺局',
    description: '篮球房搜索后需先申请加入，房主审核通过后再进入正式组队。',
    sportType: 'basketball',
    date: '2026-04-20',
    startTime: '18:30',
    endTime: '20:00',
    location: '玉泉室外篮球场',
    genderRequirement: 'all_male',
    minPeople: 6,
    maxPeople: 8,
    currentPeople: 5,
    tags: ['社团', '对抗局'],
    status: 'open',
    isPrivate: false,
    joinMode: 'approval',
    inviteCode: 'BK3301',
    organizationLabel: '篮球社',
    skillLabel: '进阶对抗',
    atmosphereLabel: '高强度',
    partnerCodeRequired: false,
    hostName: 'Leon',
    hostTheme: 'orange',
    seats: [
      { key: 'a', name: '红队', desc: '先发阵容', capacity: 3 },
      { key: 'b', name: '蓝队', desc: '轮换阵容', capacity: 3 },
      { key: 'bench', name: '候补区', desc: '审核通过后补位', capacity: 2 }
    ],
    members: [
      { id: 'u2', nickname: 'Leon', avatarUrl: '', gender: 'male', seat: 'a', remark: '房主 / 控球' },
      { id: 'u5', nickname: 'Chris', avatarUrl: '', gender: 'male', seat: 'a', remark: '锋线' },
      { id: 'u6', nickname: 'Sam', avatarUrl: '', gender: 'male', seat: 'b', remark: '补防' },
      { id: 'u7', nickname: 'Neo', avatarUrl: '', gender: 'male', seat: 'bench', remark: '审核后替补' }
    ]
  },
  '103': {
    id: '103',
    hostId: 'u3',
    title: '午后网球练习',
    description: '网球局同样需要同伴码，邀请码可直接带你跳转到房间。',
    sportType: 'tennis',
    date: '2026-04-21',
    startTime: '15:00',
    endTime: '17:00',
    location: '西溪网球场 1 号',
    genderRequirement: 'mixed',
    minPeople: 2,
    maxPeople: 4,
    currentPeople: 2,
    tags: ['学院局', '轻松练习'],
    status: 'open',
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
    seats: [
      { key: 'a', name: '主场位', desc: '优先对拉', capacity: 2 },
      { key: 'b', name: '轮换位', desc: '等下一盘', capacity: 1 },
      { key: 'bench', name: '候补区', desc: '临时补入', capacity: 1 }
    ],
    members: [
      { id: 'u3', nickname: 'Cici', avatarUrl: '', gender: 'female', seat: 'a', remark: '房主 / 发球练习' },
      { id: 'u8', nickname: 'Jun', avatarUrl: '', gender: 'male', seat: 'b', remark: '下一盘上场' }
    ]
  }
}

export default function RoomDetail() {
  const router = useRouter()
  const { id = '101' } = router.params
  const [room, setRoom] = useState<DetailRoom | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<SeatKey>('a')

  useEffect(() => {
    setRoom(ROOM_MAP[id] || ROOM_MAP['101'])
  }, [id])

  const getSeatMembers = (seatKey: SeatKey) => room?.members.filter((member) => member.seat === seatKey) || []
  const getMyMember = () => room?.members.find((member) => member.id === MY_MEMBER.id) || null

  const handleCopy = (value: string, label: string) => {
    Taro.setClipboardData({
      data: value,
      success: () => {
        Taro.showToast({ title: `${label}已复制`, icon: 'none' })
      }
    })
  }

  const updateMembers = (members: TeamMember[], toast: string) => {
    if (!room) return
    setRoom({
      ...room,
      members,
      currentPeople: members.length
    })
    Taro.showToast({ title: toast, icon: 'none' })
  }

  const handleDirectJoin = () => {
    if (!room) return
    const selectedSeatConfig = room.seats.find((seat) => seat.key === selectedSeat)
    if (!selectedSeatConfig) return

    const currentMembers = room.members.filter((member) => member.id !== MY_MEMBER.id)
    const seatSize = currentMembers.filter((member) => member.seat === selectedSeat).length
    if (seatSize >= selectedSeatConfig.capacity) {
      Taro.showToast({ title: `${selectedSeatConfig.name}已满`, icon: 'none' })
      return
    }

    const myMember = getMyMember()
    const nextMember: TeamMember = {
      ...MY_MEMBER,
      seat: selectedSeat,
      remark: myMember ? '已切换席位' : '刚加入房间'
    }

    updateMembers([...currentMembers, nextMember], myMember ? '已切换席位' : '加入成功')
  }

  const handlePrimaryAction = () => {
    if (!room) return
    const myMember = getMyMember()

    if (room.joinMode === 'approval' && !myMember) {
      Taro.showToast({ title: '申请已发送，等待房主审核', icon: 'none' })
      return
    }

    if (myMember && myMember.seat === selectedSeat) {
      updateMembers(room.members.filter((member) => member.id !== MY_MEMBER.id), '已退出房间')
      return
    }

    handleDirectJoin()
  }

  if (!room) {
    return <View className='page-shell room-detail-page'>加载中...</View>
  }

  const myMember = getMyMember()
  const selectedSeatConfig = room.seats.find((seat) => seat.key === selectedSeat)
  const primaryLabel = room.joinMode === 'approval' && !myMember
    ? '申请加入'
    : myMember?.seat === selectedSeat
      ? '退出房间'
      : myMember
        ? `切到${selectedSeatConfig?.name || '该席位'}`
        : room.joinMode === 'direct'
          ? `加入${selectedSeatConfig?.name || '房间'}`
          : '申请加入'

  return (
    <View className='page-shell room-detail-page'>
      <View className='hero-panel room-hero'>
        <Text className='section-eyebrow section-eyebrow--light'>Room Detail</Text>
        <Text className='display-title'>{room.title}</Text>
        <Text className='hero-copy'>{room.description}</Text>

        <View className='chip-row room-hero__chips'>
          <Text className='chip chip--light'>{SPORT_LABELS[room.sportType]}</Text>
          <Text className='chip chip--light'>{room.joinMode === 'direct' ? '直接加入' : '申请加入'}</Text>
          <Text className='chip chip--light'>{room.isPrivate ? '私密房间' : '公开房间'}</Text>
          {room.partnerCodeRequired && <Text className='chip chip--light'>需同伴码</Text>}
        </View>

        <View className='metric-grid room-hero__metrics'>
          <View className='metric-card'>
            <Text className='metric-card__label'>时间</Text>
            <Text className='metric-card__value'>{room.startTime}</Text>
            <Text className='metric-card__desc'>{room.date}</Text>
          </View>
          <View className='metric-card'>
            <Text className='metric-card__label'>地点</Text>
            <Text className='metric-card__value'>{room.currentPeople}</Text>
            <Text className='metric-card__desc'>{room.location}</Text>
          </View>
          <View className='metric-card'>
            <Text className='metric-card__label'>邀请码</Text>
            <Text className='metric-card__value'>{room.inviteCode}</Text>
            <Text className='metric-card__desc'>可直接复制邀请队友</Text>
          </View>
        </View>
      </View>

      <View className='paper-card'>
        <View className='room-section-head'>
          <View>
            <Text className='section-eyebrow'>Lineup</Text>
            <Text className='section-title'>组队席位</Text>
          </View>
          <Text className='meta-inline'>{room.currentPeople}/{room.maxPeople} 已加入</Text>
        </View>

        <View className='seat-tabs'>
          {room.seats.map((seat) => (
            <View
              key={seat.key}
              className={`seat-tab ${selectedSeat === seat.key ? 'seat-tab--active' : ''}`}
              onClick={() => setSelectedSeat(seat.key)}
            >
              {seat.name}
            </View>
          ))}
        </View>

        {room.seats.map((seat) => {
          const seatMembers = getSeatMembers(seat.key)
          const emptyCount = seat.capacity - seatMembers.length
          return (
            <View key={seat.key} className={`seat-panel ${selectedSeat === seat.key ? 'seat-panel--active' : ''}`}>
              <View className='seat-panel__head'>
                <View>
                  <Text className='seat-panel__name'>{seat.name}</Text>
                  <Text className='meta-inline'>{seat.desc}</Text>
                </View>
                <Text className='seat-panel__count'>{seatMembers.length}/{seat.capacity}</Text>
              </View>

              {seatMembers.map((member) => (
                <View key={member.id} className='member-card'>
                  <View className={`avatar-token ${avatarThemeClassMap[room.hostTheme]}`}>{member.nickname.slice(0, 1)}</View>
                  <View className='member-card__main'>
                    <Text className='member-card__name'>{member.nickname}</Text>
                    <Text className='member-card__remark'>{member.remark}</Text>
                  </View>
                </View>
              ))}

              {Array.from({ length: Math.max(emptyCount, 0) }).map((_, index) => (
                <View key={`${seat.key}-${index}`} className='member-card member-card--empty'>
                  <View className='member-card__placeholder'>+</View>
                  <View className='member-card__main'>
                    <Text className='member-card__name'>空位待补</Text>
                    <Text className='member-card__remark'>
                      {room.joinMode === 'direct' ? '可直接加入该席位' : '需申请后由房主安排'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )
        })}
      </View>

      <View className='paper-card'>
        <Text className='section-eyebrow'>Room Info</Text>
        <Text className='section-title'>房间信息</Text>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>房主</Text>
          <Text className='detail-info-row__value'>{room.hostName}</Text>
        </View>
        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>学园/社团</Text>
          <Text className='detail-info-row__value'>{room.organizationLabel}</Text>
        </View>
        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>水平</Text>
          <Text className='detail-info-row__value'>{room.skillLabel}</Text>
        </View>
        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>氛围</Text>
          <Text className='detail-info-row__value'>{room.atmosphereLabel}</Text>
        </View>
        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>加入方式</Text>
          <Text className='detail-info-row__value'>{room.joinMode === 'direct' ? '搜索后可直接加入' : '搜索后需申请加入'}</Text>
        </View>
      </View>

      <View className='paper-card utility-card'>
        <Text className='section-eyebrow'>Utility</Text>
        <Text className='section-title'>邀请码与同伴码</Text>

        <View className='utility-row'>
          <View className='utility-row__meta'>
            <Text className='utility-row__title'>邀请码</Text>
            <Text className='utility-row__desc'>搜索框旁边的邀请码入口可直接使用</Text>
          </View>
          <Button className='pill-button pill-button--secondary utility-row__button' onClick={() => handleCopy(room.inviteCode, '邀请码')}>
            {room.inviteCode}
          </Button>
        </View>

        {room.partnerCodeRequired && (
          <View className='utility-row utility-row--partner'>
            <View className='utility-row__meta'>
              <Text className='utility-row__title'>同伴码</Text>
              <Text className='utility-row__desc'>羽毛球和网球房间都需要同伴码</Text>
            </View>
            <Button className='pill-button pill-button--primary utility-row__button' onClick={() => handleCopy(room.partnerCode || '', '同伴码')}>
              {room.partnerCode}
            </Button>
          </View>
        )}
      </View>

      <View className='room-bottom-bar'>
        <View className='room-bottom-bar__summary'>
          <Text className='room-bottom-bar__title'>{selectedSeatConfig?.name} 已选中</Text>
          <Text className='meta-inline'>
            {myMember
              ? `你当前在 ${room.seats.find((seat) => seat.key === myMember.seat)?.name}`
              : room.joinMode === 'direct'
                ? '可直接加入当前选中席位'
                : '点击后先提交申请，由房主审核'}
          </Text>
        </View>
        <View className='room-bottom-bar__actions'>
          <Button className='pill-button pill-button--plain room-bottom-bar__button' onClick={() => handleCopy(room.inviteCode, '邀请码')}>邀请队友</Button>
          <Button className='pill-button pill-button--primary room-bottom-bar__button' onClick={handlePrimaryAction}>{primaryLabel}</Button>
        </View>
      </View>
    </View>
  )
}
