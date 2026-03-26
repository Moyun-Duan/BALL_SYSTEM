export default defineAppConfig({
  pages: [
    'pages/lobby/index',
    'pages/profile/index',
    'pages/room/create/index',
    'pages/room/detail/index',
    'pages/index/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '约球系统',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#999',
    selectedColor: '#22B5AF',
    backgroundColor: '#fff',
    borderStyle: 'white',
    list: [
      {
        pagePath: 'pages/lobby/index',
        text: '大厅',
        iconPath: './assets/tab-home.svg',
        selectedIconPath: './assets/tab-home-active.svg'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: './assets/tab-profile.svg',
        selectedIconPath: './assets/tab-profile-active.svg'
      }
    ]
  }
})
