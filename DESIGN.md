# Frontend Design Specifications - Ball Booking System

## 1. Design Overview
This document outlines the frontend implementation details for the Ball Booking System, based on the provided requirements and architecture.

### Color Palette used in implementation
Defined as CSS Variables in `src/app.scss`:

- **Theme (Cyan)**
  - Primary: `#22B5AF` (`--color-primary`)
  - Secondary: `#57CDC8` (`--color-primary-light`)
  - Background: `#EDFFFB` (`--color-primary-bg`)

- **Auxiliary**
  - Text Primary: `#333333`
  - Text Secondary: `#94959B`
  - Warning/Action: `#FF782A` (Orange), `#FFB001` (Yellow), `#4874FA` (Blue)

## 2. Page Structure & Features

### 2.1 Lobby (组队大厅)
- **Path**: `pages/lobby/index`
- **Features**:
  - **Search**: Fuzzy search for room names/descriptions.
  - **Filters**: Scrollable tag list (Sport, Location, Date, Gender, College, Level).
  - **Room List**: Cards displaying essential info (Sport, Title, Time, Location, Current/Max People).
  - **Quick Action**: FAB button to Create Room.

### 2.2 Personal Profile (个人界面)
- **Path**: `pages/profile/index`
- **Features**:
  - **User Info**: Avatar, Nickname, Bio, Tags (e.g., Level, College).
  - **Stats**: Games organized, Stamina/Reputation score.
  - **Menu**: Access to Booking History, Settings.
  - **Auth**: Login/Logout simulation.

### 2.3 Create Room (创建房间)
- **Path**: `pages/room/create/index`
- **Form Fields**:
  - **Mandatory**: Sport Type (Picker), Date (Picker), Time (Picker), Location (Picker).
  - **Optional**: Room Name, Description, Gender Requirement, Max People, Tags.
- **Logic**: Client-side validation before submission.

### 2.4 Room Detail (房间详情 & 人员变更)
- **Path**: `pages/room/detail/index`
- **Features**:
  - **Info Display**: Detailed breakdown of time, location, cost (AA).
  - **Members**: Grid view of current members + empty slots.
  - **Actions**: 
    - **Join**: Checks if room is full.
    - **Leave**: Removes current user.
    - **Invite**: Uses system share.
    - **Host Controls**: (To be implemented) Kick user, Dissolve room.

## 3. Data Interfaces (Backend Integration)
Types defined in `src/types/domain.ts`:

- `User`: Backend should provide ID, nickname, avatar, gender, bio, stats.
- `Room`: Core entity containing hostId, sportType, time/location, status, and member list.
- `SearchParams`: Standardized filter parameters for the search API.

## 4. Pending Backend APIs
The frontend assumes the following API endpoints will be available:

- `GET /api/rooms?keyword=&sport=&date=...` - Search rooms
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:id` - Get room details
- `POST /api/rooms/:id/join` - Join a room
- `POST /api/rooms/:id/leave` - Leave a room
- `GET /api/user/profile` - Get current user profile
