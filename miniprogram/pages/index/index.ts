// index.ts
// 获取应用实例
const app = getApp<IAppOption>()

Page({
  data: {
    yourOpenid: '',
    showLoginDialog: false,
    sendButtonLoading: false,
    inputValue: '',
    access_token: "24.5454af54bda137d0e3734e2e42be9ce5.2592000.1706790557.282335-46242368",
    messages: [
      {
        type: "ai",
        text: "亲请问有什么需要我解答吗？我可以告诉你如何进行挑选。例如输入“如何挑选西瓜”"
      },
    ]
  },
  copyText(e: any) {
    let key = e.currentTarget.dataset.key;
    wx.setClipboardData({ //设置系统剪贴板的内容
      data: key,
      success(res) {
        console.log(res, key);
        wx.getClipboardData({ // 获取系统剪贴板的内容
          success() {
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
  bindKeyInput(e: any) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 询问
  sendMessage() {
    const messages = this.data.messages
    if (!this.data.inputValue) {
      return
    }
    messages.push({
      type: "me",
      text: this.data.inputValue
    })
    const currentType = wx.getStorageSync('currentType')
    if(this.data.inputValue === '切换成gpt') {
      wx.setStorageSync('currentType','gpt')
      messages.push({
        type: "ai",
        text: '下一次开始对话你将和 GPT 进行'
      })

      this.setData({
        sendButtonLoading: false,
        inputValue: '',
        messages
      })
      return
    }
    
    if(this.data.inputValue === '切换成文心') {
      wx.setStorageSync('currentType','baidu')

      messages.push({
        type: "ai",
        text: '下一次开始对话你将和 文心 进行'
      })

      this.setData({
        sendButtonLoading: false,
        inputValue: '',
        messages
      })
      return
    }

  
    if(currentType === 'gpt') {

    } else {
      this.getBaidu(this.data.inputValue)
    }

    this.setData({
      sendButtonLoading: true,
      inputValue: '',
      messages,
    })
  },
  onShareAppMessage() {
    return {
      title: '【如何挑选】AI问答小程序',
      path: '/pages/index/index',
    }
  },
  getBaidu(text: string) {
    wx.request({
      url: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/ernie_bot_8k?access_token=' + wx.getStorageSync('access_token'),
      data: {
        "messages": [
          { "role": "user", "content": text }
        ]
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      complete: (res: any) => {
        const messages = this.data.messages
        messages.push({
          type: "ai",
          text: res.data.result
        })

        this.setData({
          sendButtonLoading: false,
          messages
        })
      }
    })
  },
  bindGetUserInfo(e: any) {
    console.log(e.detail.userInfo)
  },
  onLoad() {
    wx.cloud.callFunction({
      name: 'getOpenData',
    }).then(({ result }: any) => {
      console.log(result)
      this.setData({
        yourOpenid: result.openid,
        showLoginDialog:false
      })
    })
  },
})
