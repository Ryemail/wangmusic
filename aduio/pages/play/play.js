// pages/play/play.js
const app = getApp();
const wxPromise = require('../../utils/util.js').wxPromise;
import Lyric from  '../../utils/lyric-parser.js';
// const Lyric = require('');
const urlg = app.globalData.url;
let that = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
      img_bg: app.globalData.imgUrl,
      state:'running',
      bool: true,
      detail:{
      },
      progress:{//进度条
        step:1,
        size:13,
        activeColor:'#d43c33'
      },
      lyric:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    let id = '1318235595';
    this.getdetail(options.id || id)//歌曲详情
    this.getlyric(options.id || id)
  },
  getdetail(id){
    wxPromise(wx.request)({
      url: `${urlg}/song/detail`,
      data:{ids:id}
    }).then((res) =>{
      let result = res.data.songs[0];
      that.setData({
        ['detail.bg']: result.al.picUrl
      })
    }).catch((e) =>{
      console.log(e,'网络错误')
    })
  },
  getlyric(id) {
    wxPromise(wx.request)({
      url: `${urlg}/lyric`,
      data: { id: id }
    }).then((res) => {
      let result = res.data.lrc.lyric;
      let lyric = new Lyric(result,(obj)=>{
        console.log(obj)
      })
      console.log(lyric)
      that.setData({
        lyric: lyric.lines
      })
    }).catch((e) => {
      console.log(e, '网络错误')
    })
  },
  isPlay(){
    let state = '',bool = false;
    if (that.data.state == 'running'){
      state = 'paused'
      bool = false
    }else{
      state = 'running'
      bool = true
    }
    that.setData({
      state: state,
      bool: bool
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