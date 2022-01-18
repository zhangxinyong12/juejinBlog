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

    <a-modal
      title="匹配"
      :visible="visible"
      @ok="submit"
      :closable="false"
      wrapClassName="ipt-box"
    >
      <a-form-model
        ref="ruleForm"
        :model="form"
        :rules="rules"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-model-item ref="room" label="房间号" prop="room">
          <a-input v-model="form.room" />
        </a-form-model-item>
        <a-form-model-item ref="name" label="姓名" prop="name">
          <a-input v-model="form.name" />
        </a-form-model-item>
      </a-form-model>
    </a-modal>
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
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
      rules: {
        name: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
        room: [
          {
            required: true,
            trigger: 'blur',
          },
        ],
      },

      form: {
        room: '666',
        name: 'zhangsan',
      },
      visible: true,
      time,
      nowTime: time * 1000,
      timeId: 0,
      list: [1, 2, 3, 4],
      h: 20,
      ws: '',
      isStart: false,
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
      if (!this.isStart) {
        return
      }
      const n = Math.floor(Math.random() * 10) + 1
      console.log(n)
      this.h += n
      this.ws.send(
        JSON.stringify({
          event: 'events',
          data: {
            type: 'add',
            data: {
              ...this.form,
              number: this.h,
            },
          },
        })
      )
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.createWs()
        }
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
            data: {
              type: 'match',
              data: this.form,
            },
          })
        )
      })

      ws.addEventListener('message', (event) => {
        const data = event.data
        this.handleEvent(data)
      })
      ws.addEventListener('error', (event) => {
        console.log('ws 连接失败', event)
        this.$message.error('ws 连接失败，请刷新页面再重试')
      })
      ws.addEventListener('close', (event) => {
        this.$message.error('ws 连接已关闭，请刷新页面再重试')
      })
    },

    handleEvent(wsData) {
      const data = JSON.parse(wsData).data
      if (data.type === 'match') {
        if (data.success) {
          this.$message.success(data.data)
          this.visible = false
        } else {
          this.$message.error(data.data)
        }
      } else if (data.type === 'start') {
        this.isStart = true
        this.$message.success('游戏已开始')
      }
      console.log('ws data', data)
    },
  },
  destroyed() {
    this.ws.close()
  },
}
</script>
<style lang="scss">
.ipt-box {
  .ant-modal-footer {
    .ant-btn:first-child {
      display: none;
    }
  }
}
</style>
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
    height: 100%;

    list-style: none;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    box-sizing: border-box;
    overflow: hidden;
    li {
      width: 20%;
      background: #cd78c2;
      border-top-right-radius: 40px;
      border-top-left-radius: 40px;
      max-height: 100%;
    }
  }
}
</style>
