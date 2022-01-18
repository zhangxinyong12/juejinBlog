import Vue from 'vue'

// 自动根据图片的宽高适配 需要父元素指定宽高
Vue.directive('autoImg', {
  bind: function (el) {
    el.addEventListener('load', function () {
      // 获取图片的原始宽高
      const w = el.naturalWidth
      const h = el.naturalHeight
      // console.log(`img url 加载完毕,w:${w},h:${h}`)
      const box = document.createElement('div')
      box.style.cssText += `
        position: relative;
        width: 100%;
        height:100%;
      `
      // 宽度大于高度，高度撑满。否则宽度撑满
      if (w >= h) {
        el.style.cssText += `
          height:100%;
          width:auto;
          top:50%;
          left:50%;
          transform: translate(-50%,-50%);
          position: absolute;
        `
      } else {
        el.style.cssText += `
        height:auto;
        width:100%;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        position: absolute;
        `
      }
      const parent = el.parentNode
      box.append(el)
      parent.append(box)
    })
  }
})