import { View, Text, Input, Picker, Textarea, Button } from '@tarojs/components'
import { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

const SPORTS = ['羽毛球', '篮球', '网球', '足球', '排球', '乒乓球']
const LOCATIONS = ['紫金港风雨操场', '玉泉室外篮球场', '西溪网球场', '华家池体育馆']
const GENDER_OPTS = ['男女混合', '全部男生', '全部女生']
const JOIN_MODES = ['直接加入', '申请加入']
const VISIBILITY_OPTS = ['公开房间', '私密房间']
const TODAY = new Date().toISOString().split('T')[0]

const isRacketSport = (sportName: string) => sportName === '羽毛球' || sportName === '网球'

export default function CreateRoom() {
  const [sportIndex, setSportIndex] = useState(0)
  const [date, setDate] = useState(TODAY)
  const [time, setTime] = useState('19:00')
  const [locationIndex, setLocationIndex] = useState(0)
  const [roomName, setRoomName] = useState('')
  const [genderIndex, setGenderIndex] = useState(0)
  const [peopleRule, setPeopleRule] = useState('4-6')
  const [organization, setOrganization] = useState('')
  const [levelAtmosphere, setLevelAtmosphere] = useState('')
  const [description, setDescription] = useState('')
  const [joinModeIndex, setJoinModeIndex] = useState(0)
  const [visibilityIndex, setVisibilityIndex] = useState(0)
  const [partnerCode, setPartnerCode] = useState('')

  const sportName = SPORTS[sportIndex]
  const needsPartnerCode = isRacketSport(sportName)

  const inviteCodePreview = useMemo(() => {
    const roomSeed = roomName.trim() || sportName
    return `${roomSeed.slice(0, 2).toUpperCase()}${date.replace(/-/g, '').slice(4)}`
  }, [date, roomName, sportName])

  const handleSubmit = () => {
    if (!roomName.trim()) {
      Taro.showToast({ title: '请填写房间名称', icon: 'none' })
      return
    }

    if (!date || !time || !LOCATIONS[locationIndex]) {
      Taro.showToast({ title: '请补齐时间和地点', icon: 'none' })
      return
    }

    if (needsPartnerCode && !partnerCode.trim()) {
      Taro.showToast({ title: '羽毛球和网球需填写同伴码', icon: 'none' })
      return
    }

    Taro.showToast({ title: '房间已创建', icon: 'success' })
    setTimeout(() => {
      Taro.navigateBack()
    }, 500)
  }

  return (
    <View className='page-shell create-page'>
      <View className='hero-panel create-hero'>
        <Text className='section-eyebrow section-eyebrow--light'>Create Room</Text>
        <Text className='display-title'>创建房间时把加入规则一次说清楚</Text>
        <Text className='hero-copy'>必填项是房间名称、球类、时间、地点。可选项补充性别要求、人数限制、学园/院系/社团、打球水平和氛围。</Text>
      </View>

      <View className='paper-card'>
        <Text className='section-eyebrow'>Required</Text>
        <Text className='section-title'>基本信息</Text>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>房间名称</Text>
          <Input
            className='detail-info-row__value form-input-inline'
            placeholder='例如：夜场双打补位'
            maxlength={16}
            value={roomName}
            onInput={(e) => setRoomName(e.detail.value)}
          />
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>球类</Text>
          <Picker mode='selector' range={SPORTS} value={sportIndex} onChange={(e) => setSportIndex(Number(e.detail.value))}>
            <View className='detail-info-row__value form-value-inline'>{sportName}</View>
          </Picker>
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>日期</Text>
          <Picker mode='date' value={date} start={TODAY} onChange={(e) => setDate(e.detail.value)}>
            <View className='detail-info-row__value form-value-inline'>{date}</View>
          </Picker>
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>时间</Text>
          <Picker mode='time' value={time} start='06:00' end='23:00' onChange={(e) => setTime(e.detail.value)}>
            <View className='detail-info-row__value form-value-inline'>{time}</View>
          </Picker>
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>地点</Text>
          <Picker mode='selector' range={LOCATIONS} value={locationIndex} onChange={(e) => setLocationIndex(Number(e.detail.value))}>
            <View className='detail-info-row__value form-value-inline'>{LOCATIONS[locationIndex]}</View>
          </Picker>
        </View>

        <View className='notice-card'>
          <Text className='notice-card__title'>浙大体艺对接预留</Text>
          <Text className='notice-card__desc'>当前前端已预留时间地点入口，后续可直接对接浙大体艺场馆预约接口。</Text>
        </View>
      </View>

      <View className='paper-card'>
        <Text className='section-eyebrow'>Optional</Text>
        <Text className='section-title'>加入规则和筛选条件</Text>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>性别要求</Text>
          <Picker mode='selector' range={GENDER_OPTS} value={genderIndex} onChange={(e) => setGenderIndex(Number(e.detail.value))}>
            <View className='detail-info-row__value form-value-inline'>{GENDER_OPTS[genderIndex]}</View>
          </Picker>
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>人数限制</Text>
          <Input
            className='detail-info-row__value form-input-inline'
            placeholder='填写数字或区间，如 4-6'
            value={peopleRule}
            onInput={(e) => setPeopleRule(e.detail.value)}
          />
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>学园/院系/社团</Text>
          <Input
            className='detail-info-row__value form-input-inline'
            placeholder='例如：求是学院 / 篮球社'
            value={organization}
            onInput={(e) => setOrganization(e.detail.value)}
          />
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>水平 / 氛围</Text>
          <Input
            className='detail-info-row__value form-input-inline'
            placeholder='例如：新手友好 / 轻松练习'
            value={levelAtmosphere}
            onInput={(e) => setLevelAtmosphere(e.detail.value)}
          />
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>加入方式</Text>
          <Picker mode='selector' range={JOIN_MODES} value={joinModeIndex} onChange={(e) => setJoinModeIndex(Number(e.detail.value))}>
            <View className='detail-info-row__value form-value-inline'>{JOIN_MODES[joinModeIndex]}</View>
          </Picker>
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>房间类型</Text>
          <Picker mode='selector' range={VISIBILITY_OPTS} value={visibilityIndex} onChange={(e) => setVisibilityIndex(Number(e.detail.value))}>
            <View className='detail-info-row__value form-value-inline'>{VISIBILITY_OPTS[visibilityIndex]}</View>
          </Picker>
        </View>

        {needsPartnerCode && (
          <View className='detail-info-row'>
            <Text className='detail-info-row__label'>同伴码</Text>
            <Input
              className='detail-info-row__value form-input-inline'
              placeholder={`${sportName}房间需填写同伴码`}
              value={partnerCode}
              onInput={(e) => setPartnerCode(e.detail.value.toUpperCase())}
            />
          </View>
        )}

        <View className='form-block'>
          <Text className='form-block__label'>房间备注</Text>
          <Textarea
            className='form-textarea'
            maxlength={200}
            placeholder='例如：费用 AA，自带球拍，迟到 10 分钟默认转候补'
            value={description}
            onInput={(e) => setDescription(e.detail.value)}
          />
        </View>
      </View>

      <View className='paper-card preview-card'>
        <Text className='section-eyebrow'>Preview</Text>
        <Text className='section-title'>发布预览</Text>

        <View className='preview-banner'>
          <Text className='preview-banner__title'>{roomName || '未命名房间'}</Text>
          <Text className='preview-banner__desc'>{description || '建议写明费用、器材和迟到规则，方便队友快速判断是否加入。'}</Text>
        </View>

        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>搜索展示</Text>
          <Text className='detail-info-row__value'>{sportName} · {LOCATIONS[locationIndex]} · {JOIN_MODES[joinModeIndex]}</Text>
        </View>
        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>筛选标签</Text>
          <Text className='detail-info-row__value'>{organization || '未填写'} · {levelAtmosphere || '未填写'}</Text>
        </View>
        <View className='detail-info-row'>
          <Text className='detail-info-row__label'>邀请码</Text>
          <Text className='detail-info-row__value'>{inviteCodePreview}</Text>
        </View>
        {needsPartnerCode && (
          <View className='detail-info-row'>
            <Text className='detail-info-row__label'>同伴码</Text>
            <Text className='detail-info-row__value'>{partnerCode || '待填写'}</Text>
          </View>
        )}
      </View>

      <View className='create-submit-wrap'>
        <Button className='pill-button pill-button--primary create-submit' onClick={handleSubmit}>发布房间</Button>
      </View>
    </View>
  )
}
