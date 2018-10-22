// pages/recommendSong/recommendSong.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  ready(){
    
  },
  /**
   * 组件的初始数据
   */
  data: {
    grids: [0, 1, 2, 3, 4, 5]
  },
  queryMultipleNodes() {
    
    const query = SelectorQuery.selectAll()
    query.select('#recommendSong').boundingClientRect(function (res) {
      // res.top // 这个组件内 #the-id 节点的上边界坐标
      console.log(res)
    }).exec()
  },
  /**
   * 组件的方法列表
   */
  methods: {
  }
})
