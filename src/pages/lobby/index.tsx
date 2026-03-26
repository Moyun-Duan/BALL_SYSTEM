import { View, Text, Input, ScrollView, Image } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'
import { Room } from '@/types/domain'

// Mock Data
const MOCK_ROOMS: Room[] = [
  {
    id: '101',
    hostId: 'u1',
    title: '羽毛球新手局',
    description: '欢迎萌新，大佬轻虐',
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
    members: []
  },
  {
    id: '102',
    hostId: 'u2',
    title: '篮球全场5v5',
    description: '来点对抗强的',
    sportType: 'basketball',
    date: '2023-10-29',
    startTime: '18:00',
    endTime: '20:00',
    location: '玉泉室外篮球场',
    genderRequirement: 'all_male',
    minPeople: 10,
    maxPeople: 10,
    currentPeople: 6,
    tags: ['进阶', '对抗'],
    status: 'open',
    members: []
  }
]

const TAGS = ['全部', '羽毛球', '篮球', '网球', '乒乓球', '足球', '排球']

export default function Lobby() {
  const [keyword, setKeyword] = useState('')
  const [activeTag, setActiveTag] = useState('全部')
  const [rooms, setRooms] = useState<Room[]>(MOCK_ROOMS)

  const handleSearch = (value) => {
    setKeyword(value)
    // TODO: Call API with keyword
  }

  const navigateToDetail = (id: string) => {
    Taro.navigateTo({ url: `/pages/room/detail/index?id=${id}` })
  }

  const handleCreateRoom = () => {
    Taro.navigateTo({ url: '/pages/room/create/index' })
  }

  return (
    <View className='lobby-container'>
      {/* Search Header */}
      <View className='header'>
        <View className='search-bar'>
          <Input 
            className='search-input'
            placeholder='搜索球类、地点、日期...'
            value={keyword}
            onInput={(e) => handleSearch(e.detail.value)}
            confirmType='search'
          />
        </View>
        
        <ScrollView scrollX className='tags-scroll' showScrollbar={false}>
          {TAGS.map((tag) => (
            <View 
              key={tag} 
              className={`tag ${activeTag === tag ? 'active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Room List */}
      <ScrollView scrollY className='room-list'>
        {rooms.map((room) => (
          <View key={room.id} className='room-card card' onClick={() => navigateToDetail(room.id)}>
            <View className='card-header'>
              <Text className='sport-tag'>{room.sportType === 'badminton' ? '羽毛球' : '篮球'}</Text>
              <Text className='room-title'>{room.title}</Text>
              <Text className={`status-badge ${room.status}`}>{room.status === 'open' ? '招募中' : '满员'}</Text>
            </View>
            
            <View className='card-body'>
              <View className='info-row'>
                <Text className='label'>时间：</Text>
                <Text>{room.date} {room.startTime}-{room.endTime}</Text>
              </View>
              <View className='info-row'>
                <Text className='label'>地点：</Text>
                <Text>{room.location}</Text>
              </View>
              <View className='info-row'>
                <Text className='label'>人数：</Text>
                <Text>{room.currentPeople}/{room.maxPeople}</Text>
                <Text className='gender-limit'>{
                  room.genderRequirement === 'all_male' ? '(仅限男生)' : 
                  room.genderRequirement === 'all_female' ? '(仅限女生)' : '(男女不限)'
                }</Text>
              </View>
            </View>

            <View className='card-footer'>
              <View className='tags-row'>
                {room.tags?.map((t, i) => (
                  <Text key={i} className='mini-tag'>{t}</Text>
                ))}
              </View>
            </View>
          </View>
        ))}
        
        {/* Empty State / Bottom Padding */}
        <View className='list-bottom-spacer'></View>
      </ScrollView>

      {/* FAB - Create Button */}
      <View className='fab-create' onClick={handleCreateRoom}>
        <Text className='plus'>+</Text>
      </View>
    </View>
  )
}
