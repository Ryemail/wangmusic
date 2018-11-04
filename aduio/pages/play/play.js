// pages/play/play.js
const app = getApp();
const wxPromise = require('../../utils/util.js').wxPromise;
import Lyric from '../../utils/lyric-parser.js';
// const Lyric = require('')
let audio = null;
const urlg = app.globalData.url;
let that = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_bg: app.globalData.imgUrl,
    state: 'running',
    bool: false,
    colorActive: '',
    detail: {
    },
    progress: {//进度条
      step: 1,
      size: 13,
      activeColor: '#d43c33',
      blockColor: '#FFF',
      startTime: '00:00',
      endTime: '00:00',
      timeS: 0,
      timeE: 0,
      width: 0
    },
    lyric: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let id = '1318235595';
    this.getdetail(options.id || id)//歌曲详情
    this.getlyric(options.id || id)//获取歌词
    this.getUrl(options.id || id)//获取音频地址
    audio = wx.createInnerAudioContext();

  },
  getdetail(id) {
    wxPromise(wx.request)({
      url: `${urlg}/song/detail`,
      data: { ids: id }
    }).then((res) => {
      let result = res.data.songs[0];
      that.setData({
        ['detail.bg']: result.al.picUrl
      })
    }).catch((e) => {
      console.log(e, '网络错误')
    })
  },
  getlyric(id) {
    wxPromise(wx.request)({
      url: `${urlg}/lyric`,
      data: { id: id }
    }).then((res) => {
      let result = res.data.lrc.lyric;
      let lyric = new Lyric(result, (obj) => {
        // console.log(obj)
      })
      that.setData({
        lyric: lyric.lines
      })
    }).catch((e) => {
      console.log(e, '网络错误')
    })
  },
  getUrl(id) {
    wxPromise(wx.request)({
      url: `${urlg}/song/url`,
      data: { id: id }
    }).then((res) => {
      if (res.data.code == 200) {
        audio.src = res.data.data[0].url
        if (audio.src) {
          audio.autoplay = true
          setTimeout(() => {
            audio.currentTime
            audio.onTimeUpdate(() => {
              let timeE = audio.duration, timeS = audio.currentTime, ratio = timeS / timeE;
              let start = that.sTom(timeS), end = that.sTom(timeE)
              that.lineColor(timeS)
              that.setData({
                ['progress.endTime']: end,
                ['progress.startTime']: start,
                ['progress.timeS']: timeS,
                ['progress.timeE']: timeE,
                ['progress.ratio']: ratio,
                bool: audio.paused
              })
            })
          }, 500)
        }
      }
    }).catch((e) => {
      console.log(e, '网络错误')
    })
  },
  /* 秒转分 */
  sTom(t) {
    let s = Math.floor(t / 60) < 10 ? '0' + Math.floor(t / 60) : Math.floor(t / 60);
    let m = Math.round(t % 60) < 10 ? '0' + Math.round(t % 60) : Math.round(t % 60);
    return `${s}:${m}`
  },
  /* 歌词进度颜色 */
  lineColor(currT) {
    let times = this.data.lyric, arrTime = [];
    for (let i = 0; i < times.length; i++) {
      arrTime.push(times[i].time / 1000);
    }
    for (let i = 0; i < arrTime.length; i++) {
      let currTime = arrTime[i];
      let nextTime = arrTime[i + 1];
      /* console.log(currTime, nextTime) */
    }
    /* let colorActive = currTime >= currT && currT < nextTime ? 'currentLine' : '';
    console.log(colorActive, 'ddddddddddddd')
    that.setData({
      colorActive
    }) */
    return false;
  },
  /* 播放 */
  isPlay() {
    let state = '', bool = true;
    console.log(that.data.bool)
    if (that.data.bool) {
      state = 'running'
      audio.play()
      bool = false
    } else {
      state = 'paused'
      audio.pause()
      bool = true
    }
    that.setData({
      state: state,
      bool: bool
    })
  },
  /* 播放进度 */
  sliderChange(e) {
    let w = e.detail.value;
    let currentTime = (w / 100) * that.data.progress.timeE;
    audio.seek(currentTime)//跳转到指定时间
    that.setData({
      ['progress.width']: w
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})