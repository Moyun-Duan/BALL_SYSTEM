import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import { useRouter } from '@tarojs/taro'
import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import { Room, User } from '@/types/domain'

// Mock Data
const MOCK_ROOM_DETAIL: Room = {
  id: '101',
  hostId: 'u1',
  title: '羽毛球新手局',
  description: '欢迎萌新，大佬轻虐，费用AA',
  sportType: 'badminton',
  date: '2023-10-28',
  startTime: '14:00',
  endTime: '16:00',
  location: '紫金港风雨操场',
  genderRequirement: 'mixed',
  minPeople: 4,
  maxPeople: 4,
  currentPeople: 2,
  tags: ['新手', '休闲'],
  status: 'open',
  isPrivate: false,
  members: [
    {
      id: 'u1',
      nickname: '房主',
      avatarUrl: 'https://placehold.co/100',
      gender: 'male',
      tags: ['房主', '大神']
    },
    {
      id: 'u2',
      nickname: '路人甲',
      avatarUrl: 'https://placehold.co/100',
      gender: 'female',
      tags: ['萌新']
    }
  ]
}

export default function RoomDetail() {
  const router = useRouter()
  const { id } = router.params
  
  const [room, setRoom] = useState<Room | null>(null)
  const [isJoined, setIsJoined] = useState(false)

  useEffect(() => {
    // Mock Fetch
    console.log('Fetching room', id)
    setTimeout(() => {
      setRoom(MOCK_ROOM_DETAIL)
    }, 500)
  }, [id])

  const handleJoin = () => {
    if (!room) return
    if (room.currentPeople >= room.maxPeople) {
      Taro.showToast({ title: '房间已满', icon: 'none' })
      return
    }
    // Mock Join
    const newMember: User = {
      id: 'me',
      nickname: '我',
      avatarUrl: 'https://placehold.co/100',
      gender: 'male'
    }
    setRoom({
      ...room,
      currentPeople: room.currentPeople + 1,
      members: [...room.members, newMember]
    })
    setIsJoined(true)
    Taro.showToast({ title: '加入成功' })
  }

  const handleLeave = () => {
    if (!room) return
    setRoom({
      ...room,
      currentPeople: room.currentPeople - 1,
      members: room.members.filter(m => m.id !== 'me')
    })
    setIsJoined(false)
    Taro.showToast({ title: '已退出' })
  }

  if (!room) return <View className='loading'>加载中...</View>

  return (
    <View className='room-detail-container'>
      <View className='content-scroll'>
        {/* Header Info */}
        <View className='header-card card'>
          <View className='title-row'>
            <Text className='title'>{room.title}</Text>
            <Text className={`status-tag ${room.status}`}>{room.status === 'open' ? '招募中' : '已结束'}</Text>
          </View>
          
          <View className='info-grid'>
            <View className='info-item'>
              <Text className='label'>项目</Text>
              <Text className='value'>{room.sportType === 'badminton' ? '羽毛球' : '其他'}</Text>
            </View>
            <View className='info-item'>
              <Text className='label'>时间</Text>
              <Text className='value'>{room.date} {room.startTime}</Text>
            </View>
            <View className='info-item'>
              <Text className='label'>地点</Text>
              <Text className='value'>{room.location}</Text>
            </View>
            <View className='info-item'>
              <Text className='label'>费用</Text>
              <Text className='value'>AA制</Text>
            </View>
          </View>

          <View className='desc-box'>
            <Text className='label'>备注：</Text>
            <Text className='text'>{room.description || '暂无备注'}</Text>
          </View>
        </View>

        {/* Member List */}
        <View className='members-card card'>
          <View className='section-header'>
            <Text className='title'>已加入队友 ({room.currentPeople}/{room.maxPeople})</Text>
          </View>
          <View className='member-grid'>
            {room.members.map(member => (
              <View key={member.id} className='member-item'>
                <Image className='avatar' src={member.avatarUrl} />
                <Text className='name'>{member.nickname}</Text>
                {member.id === room.hostId && <Text className='host-tag'>房主</Text>}
              </View>
            ))}
            {/* Empty Slots */}
            {Array.from({ length: room.maxPeople - room.currentPeople }).map((_, i) => (
              <View key={`empty-${i}`} className='member-item empty'>
                <View className='avatar-placeholder'>?</View>
                <Text className='name'>待加入</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Action Bar */}
      <View className='action-bar'>
        <Button className='btn-share' openType='share'>邀请好友</Button>
        {isJoined ? (
           <Button className='btn-action leave' onClick={handleLeave}>退出房间</Button>
        ) : (
           <Button className='btn-action join' onClick={handleJoin}>立即加入</Button>
        )}
      </View>
    </View>
  )
}
