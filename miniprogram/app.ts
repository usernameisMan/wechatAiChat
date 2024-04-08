// app.ts
App<IAppOption>({
  globalData: {},
  onLaunch() {
    const updateManager = wx.getUpdateManager()
    wx.cloud.init({
      env: "production-6gpmopfi27ce723d",
      traceUser: true
    })
    updateManager.onCheckForUpdate((res) => {
      // 请求完新版本信息的回调
      console.log('当前版本', res.hasUpdate)
    })
    let currentType = wx.getStorageSync('currentType')
    if (!currentType) {
      wx.setStorageSync('currentType', 'baidu')
      currentType = 'baidu'
    }
    if (currentType === 'baidu') {
      wx.request({
        url: `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=w33tdGOo4eezGEHCSgtvLkIe&client_secret=oVnc2QTXG9Hza9El3Ix54Co2kxlfPXnQ`,
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        complete: (res: any) => {
          wx.setStorageSync('access_token', res.data.access_token)
        }
      })
    }

    updateManager.onUpdateReady(() => {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: (res) => {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })

  },
})