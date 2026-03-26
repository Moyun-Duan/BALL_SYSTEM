import { View, Text, Input, Picker, ScrollView, Textarea, Button } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

// Mock Data
const SPORTS = ['羽毛球', '篮球', '网球', '足球', '排球', '乒乓球']
const LOCATIONS = ['紫金港风雨操场', '玉泉室外篮球场', '西溪羽毛球馆', '华家池体育馆']
const GENDER_OPTS = ['不限', '仅限男生', '仅限女生']

export default function CreateRoom() {
  const [sportIndex, setSportIndex] = useState(0)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('18:00')
  const [locationIndex, setLocationIndex] = useState(0)
  const [roomName, setRoomName] = useState('')
  const [description, setDescription] = useState('')
  const [genderIndex, setGenderIndex] = useState(0)
  const [peopleLimit, setPeopleLimit] = useState('4')

  const handleSubmit = () => {
    if (!roomName) {
      Taro.showToast({ title: '请输入房间名称', icon: 'none' })
      return
    }
    // TODO: Call Create API
    Taro.showLoading({ title: '创建中...' })
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({ title: '创建成功' })
      Taro.navigateBack()
    }, 1000)
  }

  return (
    <ScrollView scrollY className='create-room-container'>
      <View className='section-title'>基础信息 (必填)</View>
      <View className='form-group card'>
        <View className='form-item'>
          <Text className='label'>运动项目</Text>
          <Picker mode='selector' range={SPORTS} value={sportIndex} onChange={e => setSportIndex(Number(e.detail.value))}>
            <View className='picker-value'>{SPORTS[sportIndex]}</View>
          </Picker>
        </View>

        <View className='form-item'>
          <Text className='label'>日期</Text>
          <Picker mode='date' value={date} start={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.detail.value)}>
            <View className='picker-value'>{date}</View>
          </Picker>
        </View>

        <View className='form-item'>
          <Text className='label'>时间</Text>
          <Picker mode='time' value={time} start='06:00' end='23:00' onChange={e => setTime(e.detail.value)}>
             <View className='picker-value'>{time}</View>
          </Picker>
        </View>

        <View className='form-item'>
          <Text className='label'>场地</Text>
          <Picker mode='selector' range={LOCATIONS} value={locationIndex} onChange={e => setLocationIndex(Number(e.detail.value))}>
            <View className='picker-value'>{LOCATIONS[locationIndex]}</View>
          </Picker>
        </View>
      </View>

      <View className='section-title'>房间详情 (可选)</View>
      <View className='form-group card'>
        <View className='form-item'>
          <Text className='label'>房间名称</Text>
          <Input 
            className='input' 
            placeholder='给你的局起个响亮的名字'
            value={roomName}
            onInput={e => setRoomName(e.detail.value)}
          />
        </View>

        <View className='form-item'>
          <Text className='label'>人数限制</Text>
          <Input 
            className='input' 
            type='number' 
            placeholder='默认4人'
            value={peopleLimit}
            onInput={e => setPeopleLimit(e.detail.value)}
          />
        </View>

        <View className='form-item'>
          <Text className='label'>性别要求</Text>
          <Picker mode='selector' range={GENDER_OPTS} value={genderIndex} onChange={e => setGenderIndex(Number(e.detail.value))}>
            <View className='picker-value'>{GENDER_OPTS[genderIndex]}</View>
          </Picker>
        </View>

        <View className='form-item column'>
          <Text className='label'>简介/备注</Text>
          <Textarea 
            className='textarea' 
            placeholder='例如：自带球，费用平摊...' 
            value={description}
            onInput={e => setDescription(e.detail.value)} 
            maxlength={200}
          />
        </View>
      </View>

      <View className='submit-area'>
        <Button className='btn-submit' onClick={handleSubmit}>立即创建</Button>
      </View>
    </ScrollView>
  )
}
