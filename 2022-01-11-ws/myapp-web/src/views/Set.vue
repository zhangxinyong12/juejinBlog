<template>
  <div class="set">
    <div>
      <a-input class="ipt" placeholder="输入房间号" v-model="room" />
      <!-- <span style="margin-left: 16px">最多允许10个人</span> -->
    </div>
    <a-button type="primary" @click="submit"> 提交 </a-button>
    <a-button :disabled="!flage" type="primary" class="ml16" @click="start">
      开始游戏
    </a-button>
    <a-button
      :disabled="!flage && !isStart"
      type="primary"
      class="ml16"
      @click="end"
    >
      结束游戏
    </a-button>
    <div class="mt16">
      <h4>当前已加入的人员排行</h4>
      <ul class="list">
        <li v-for="(item, index) of list" :key="item.name">
          <div>{{ index + 1 }}</div>
          <div>
            <span>姓名：</span>
            <span>{{ item.name }}</span>
          </div>
          <div>
            <span>成绩：</span>
            <span>{{ item.number }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { log } from 'util'

export default {
  Name: 'Set',
  data() {
    return {
      room: '',
      list: [
        // {
        //   name: 'zhangsan',
        //   number: 20,
        // },
        // {
        //   name: 'zhangsan2',
        //   number: 2000,
        // },
      ],
      ws: '',
      flage: false,
      isStart: false,
    }
  },
  mounted() {
    this.createWs()
  },
  methods: {
    submit() {
      if (!this.room) {
        return this.$message.error('请输入房间号')
      }
      const data = {
        data: { room: this.room },
        type: 'set',
      }
      this.ws.send(
        JSON.stringify({
          event: 'events',
          data,
        })
      )
    },
    start() {
      if (!this.flage) {
        return
      }
      const data = {
        data: { room: this.room },
        type: 'start',
      }

      this.ws.send(
        JSON.stringify({
          event: 'events',
          data,
        })
      )
    },
    end() {
      if (!this.flage) {
        return
      }
      const data = {
        data: { room: this.room },
        type: 'end',
      }
      this.ws.send(
        JSON.stringify({
          event: 'events',
          data,
        })
      )
    },
    createWs() {
      this.ws = new WebSocket('ws://localhost:3002')

      this.ws.addEventListener('open', (event) => {
        console.log('ws 连接成功', event)
        this.$message.success('ws 连接成功')
      })

      this.ws.addEventListener('message', (event) => {
        const data = JSON.parse(event.data).data
        if (data.type === 'set') {
          if (data.success) {
            this.flage = true
            this.$message.success(data.data)
          } else {
            this.flage = false
            this.$message.error(data.data)
          }
        } else if (data.type === 'start') {
          this.isStart = true
          this.$message.success(data.data)
        } else if (data.type === 'sort') {
          console.log('游戏排行数据', data)
          if (Array.isArray(data.data)) {
            this.list = data.data
          } else {
            this.$message.error('ws 返回数据错误，list必须为数组')
          }
        }
      })

      this.ws.addEventListener('error', (event) => {
        console.log('ws 连接失败', event)
        this.$message.error('ws 连接失败，请刷新页面再重试')
      })
      this.ws.addEventListener('close', (event) => {
        this.$message.error('ws 连接已关闭，请刷新页面再重试')
      })
    },
  },

  // 销毁
  destroyed() {
    this.ws.close()
  },
}
</script>
<style lang="scss" scoped>
.set {
  padding-top: 60px;
  padding-left: 16px;
  padding-right: 16px;
  > div {
    margin-bottom: 20px;
  }
  .ml16 {
    margin-left: 16px;
  }
  .ipt {
    width: 30%;
    margin: 0 auto;
  }
  .list {
    li {
      display: flex;
      justify-content: space-between;
      height: 36px;
      align-items: center;
      margin-bottom: 16px;
      border-bottom: 1px solid #eaeaea;
      > div {
        flex: 1;
      }
      > div:first-child {
        flex: 0;
        width: 60px;
        margin-right: 60px;
      }
    }
  }
}
</style>
