// pages/play/play.js
const app = getApp();
const wxPromise = require('../../utils/util.js').wxPromise;
import Lyric from '../../utils/lyric-parser.js';
// const Lyric = require('')
let audio = null;
const urlg = app.globalData.url;
let that = null;
let query = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img_bg: app.globalData.imgUrl,
    state: 'running',
    bool: false,
    currentIndex: 0,//当前播放的哪一行歌曲
    clientTop: 0,
    position:0,
    t: 0,
    prev: [],
    next: [],
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
    let nextPrev = app.globalData.nextPrev;
    let l = nextPrev.indexOf(1 * options.id)
    this.setData({
      prev: nextPrev.slice(0, l),
      next: nextPrev.slice(l, nextPrev.length),
      position:l
    })
    let id = '1318235595';
    this.getdetail(options.id || id)//歌曲详情
    this.getlyric(options.id || id)//获取歌词
    this.getUrl(options.id || id)//获取音频地址

    audio = wx.createInnerAudioContext();
    query = wx.createSelectorQuery();

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
      console.log(lyric.lines)
    }).catch((e) => {
      console.log(e, '网络错误')
    })
  },
  /* 监听播放结束 */
  watchEnd() {
    audio.onEnded(() => {
      that.setData({
        state: 'paused'
      })
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
          that.scroll();
          setTimeout(() => {
            audio.currentTime
            audio.onTimeUpdate(() => {
              let timeE = audio.duration, timeS = audio.currentTime, ratio = timeS / timeE;
              let start = that.sTom(timeS), end = that.sTom(timeE)
              that.lineColor(timeS, timeE);//歌词播放进程
              that.watchEnd();//歌曲播放接结束
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
  /* 滚动同步 */
  scroll() {
    query.select('.liness').boundingClientRect()
    query.exec(function (res) {
      that.setData({
        t: res[0].height
      })
    })
  },
  /* 秒转分 */
  sTom(t) {
    let s = Math.floor(t / 60) < 10 ? '0' + Math.floor(t / 60) : Math.floor(t / 60);
    let m = Math.round(t % 60) < 10 ? '0' + Math.round(t % 60) : Math.round(t % 60);
    return `${s}:${m}`
  },
  /* 歌词进度颜色 */
  lineColor(currT, sumeT) {
    let lines = [{ time: 0, txt: '' }];
    let times = lines.concat(this.data.lyric), numLine, l = times.length;
    for (let i = 0; i < times.length; i++) {
      if (i < times.length - 1) {
        let time1 = times[i].time / 1000, time2 = times[i + 1].time / 1000;
        if (currT > time1 & currT < time2) {
          numLine = i - 1;
          that.data.clientTop += that.data.t;
          break;
        }
      } else {
        numLine = times.length - 2;
      }
    }

    that.setData({
      currentIndex: numLine,
      // clientTop: that.data.clientTop
    })
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
    audio.play();
    that.setData({
      ['progress.width']: w
    })
  },
  /* 歌词滚动 */
  songScroll(e) {
    console.log(e)
  },
  /* 下一首*/
  next(){
    this.getdetail(id)//歌曲详情
    this.getlyric(id)//获取歌词
    this.getUrl(id)//获取音频地址
  },
  /* 上一首 */
  prev(){
    console.log(that.data.prev)
    this.getdetail(id)//歌曲详情
    this.getlyric(id)//获取歌词
    this.getUrl(id)//获取音频地址
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