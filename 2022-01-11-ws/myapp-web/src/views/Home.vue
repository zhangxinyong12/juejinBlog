<template>
  <div class="home" @click="add">
    <div class="top">
      <div class="title">
        限时{{ time }}s，每点击一下加1-10， 最后累加最大者获胜
      </div>
      <div>倒计时：{{ nowTime }}ms</div>
    </div>
    <ul class="box">
      <li v-for="item of list" :key="item" :style="{ height: h + 'px' }">
        <span>{{ item }}</span>
        <div>{{ h }}</div>
      </li>
    </ul>
    <div class="ipt" v-if="!isSubmit">
      <div>
        <span>房间：</span>
        <input type="text" v-model="form.room" />
      </div>
      <div>
        <span>姓名：</span>
        <input type="text" v-model="form.name" />
      </div>
      <div class="btn">
        <button @click="submit">提交后开始</button>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
export default {
  name: 'Home',
  components: {},
  data() {
    const time = 10

    return {
      time,
      nowTime: time * 1000,
      timeId: 0,
      list: [1, 2, 3, 4],
      h: 20,
      form: {
        room: '666',
        name: 'zhangsan',
      },
      isSubmit: false,
      ws: '',
    }
  },
  mounted() {
    // this.timeId = setInterval(() => {
    //   this.nowTime -= 50
    //   if (this.nowTime <= 0) {
    //     this.nowTime = 0
    //     clearInterval(this.timeId)
    //   }
    // }, 50)
  },
  methods: {
    add() {
      if (!this.isSubmit) {
        return
      }
      const n = Math.floor(Math.random() * 10) + 1
      console.log(n)
      this.h += n
    },
    submit() {
      const url = 'http://localhost:3000/'
      fetch(url, {
        method: 'GET',
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // data: this.form,
      })
        .then((res) => res.json())
        .then((res) => {
          this.isSubmit = true
          console.log(res)
          this.createWs()
        })
    },
    createWs() {
      const ws = new WebSocket('ws://localhost:3002')
      this.ws = ws
      ws.addEventListener('open', (event) => {
        console.log('ws 连接成功', event)
        ws.send(
          JSON.stringify({
            event: 'events',
            data: '测试ws 发送数据 hello',
          })
        )
      })

      ws.addEventListener('message', (event) => {
        const data = event.data
        console.log('ws message data', data)
      })
      ws.addEventListener('error', (event) => {
        console.log('ws 连接失败', event)
      })
    },
  },
  destroyed() {
    this.ws.close()
  },
}
</script>
<style lang="scss" scoped>
.home {
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.1);
  text-align: center;
  .top {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    // background: rgba(0, 0, 0, 0.1);

    .title {
      font-size: 12px;
      padding: 16px 12px;
      line-height: 20px;
    }
  }

  .box {
    list-style: none;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    box-sizing: border-box;
    height: 100%;
    padding-top: 80px;
    overflow: hidden;
    li {
      width: 20%;
      background: #cd78c2;
      border-top-right-radius: 40px;
      border-top-left-radius: 40px;
      max-height: 100%;
    }
  }
  .ipt {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 50%;
    > div {
      margin-bottom: 16px;
      font-size: 16px;
      input {
        height: 36px;
        line-height: 36px;
        font-size: 20px;
        text-indent: 20px;
        outline: none;
        border: none;
      }
      button {
        outline: none;
        border: none;
        background: #3366ff;
        padding: 10px 18px;
        border-radius: 4px;
        font-size: 14px;
        color: #fff;
      }
    }
  }
}
</style>
