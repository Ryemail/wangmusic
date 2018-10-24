//index.js
//获取应用实例
const app = getApp();
const wxPromise = require('../../utils/util.js').wxPromise
let sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
const urlg = app.globalData.url
let that = null;
Page({
  data: {
    tabs: ["推荐音乐", "热歌榜", "搜索"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    recommendSong: {
      title1: "推荐歌单",
      title2: "最新歌曲",
      imgH: 0,
      grids: [0, 1, 2, 3, 4, 5],
      song:[],
      img: 'http://p1.music.126.net/rxTBkY67pTp5oOOOLJDMfA==/18516875325233910.webp?imageView&thumbnail=246x0&quality=75&tostatic=0&type=webp',
      bool: false,
    }
  },
  onLoad: function () {
    that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
  },
    /* 推荐歌单 */
  getRecommendList() {
    wxPromise(wx.request)({
      url: `${urlg}/personalized`,
      data: {},
    }).then(res => {
      let result = res.data.result;
      let recommend = result.slice(0,6)
      let recommendRes = [];
      recommend.map((v) => {
        recommendRes.push({
          id: v.id,
          name: v.name,
          picUrl: v.picUrl,
          playCount: v.playCount
        })
        return recommendRes
      })
      that.setData({
        ['recommendSong.grids']: recommendRes
      })
    }).catch( e => {
      console.log(e,'请求失败')
    })
  },
  /* 最新歌曲 */
  newSong(){
    wxPromise(wx.request)({
      url: `${urlg}/personalized/newsong`,
      data:{}
    }).then((res) => {
      let result = res.data.result;
      console.log(result)
      let newSong = [];
      result.map((v) => {
        let artistsArr = [];
        let artists = v.song.artists.map((v) => {
          artistsArr.push(v.name)
          artistsArr.join('/')
        })
        newSong.push({
          name: v.name,
          id:v.id,
          singer: artistsArr.join(' / '),
          alias: v.song.alias[0] ? `(${v.song.alias[0]})`: '',
          bool: false
        })
        return newSong
      })
      that.setData({
        ['recommendSong.song']: newSong
      })
    }).catch((e) => {
      console.log(e,'请求失败')
    })
  },
  /* 热歌榜 */
  hotSong(){
    wxPromise(wx.request)({
      url: `${urlg}/top/list?idx=1`,
      data: {}
    }).then((res) => {
      let result = res.data.playlist.tracks;
      let hotArr = result.slice(0,15);
      let hots = [];
      hotArr.map((v) =>{
        let hostAttr = [];
        let artists = v.ar.map((v) => {
          hostAttr.push(v.name)
          hostAttr.join(' / ')
        })
        hots.push({
          name: v.name,
          id:v.id,
          singer: hostAttr.join(' / '),
          alias: v.alia[0] ? `(${v.alia[0]})` : '',
          bool: true
        }) 
      })
   
      that.setData({
        ['recommendSong.song']: hots
      })
    }).catch((e) => {
      console.log(e, '请求失败')
    })
  },
  onReady() {
    let that = this;
    setTimeout(function () {
      let query = wx.createSelectorQuery();
      query.select('.weui-grid__img').boundingClientRect()
      query.exec(function (res) {
        that.setData({ 
          ['recommendSong.imgH']: res[0].width || 124
        })
      })
    }, 0)
    this.getRecommendList()
    this.newSong()
  },
  tabClick: function (e) {
    let i = e.currentTarget.id * 1;
    let bool =  i ? true : false;
    if (i == 1){
      this.hotSong();
    } else if(i == 0){
      this.newSong();
    }
    setTimeout(() =>{
      that.setData({
        sliderOffset: e.currentTarget.offsetLeft,
        activeIndex: e.currentTarget.id
      });
    },100)
    console.log(e.currentTarget.id)
  }
});