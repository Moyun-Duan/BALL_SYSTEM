export interface User {
  id: string;
  nickname: string;
  avatarUrl: string;
  gender: 'male' | 'female' | 'unknown'; // Gender 0=unknown, 1=male, 2=female usually in wechat, but using string for clarity here
  bio?: string;
  stamina?: number; // 体力/信誉分等
  tags?: string[]; // 个人标签：学园/院系/社团/水平/风格
}

export interface SportType {
  id: string;
  name: string; // 羽毛球, 篮球, etc.
  icon?: string;
}

export interface Venue {
  id: string;
  name: string; // e.g. 风雨操场
  location: string; // 紫金港
  availableTimes: string[]; // 预留接口：可用时间段
}

export interface Room {
  id: string;
  hostId: string;
  title: string; // 房间名称
  description?: string;
  sportType: string; // 球类
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  location: string; // 地点
  genderRequirement: 'all_male' | 'all_female' | 'mixed'; // 性别要求
  minPeople: number;
  maxPeople: number;
  currentPeople: number;
  tags?: string[]; // 学园/院系/社团/水平
  status: 'open' | 'full' | 'playing' | 'finished' | 'cancelled';
  members: User[];
  isPrivate?: boolean; // 公开性设置
}

// 搜索/筛选参数接口
export interface RoomSearchParams {
  keyword?: string; // 模糊搜索：房间名/简介
  sportType?: string;
  date?: string;
  timeRange?: 'morning' | 'afternoon' | 'evening';
  location?: string;
  gender?: string;
  tags?: string[]; // 学园/水平等
  status?: Room['status'];
}
