<template>
  <div class="list">
    <ul>
      <li>
        <img src="@/assets/22@2x.a4932a2.png" alt="" v-autoImg />
      </li>
      <li>
        <img src="@/assets/33@2x.8f978a7.png" alt="" v-autoImg />
      </li>
      <li>
        <img
          src="@/assets/ba5dd567cb0cd478b61e94950d44c9e.png"
          alt=""
          v-autoImg
        />
      </li>
      <li>
        <img src="@/assets/屏幕截图(3).png" alt="" v-autoImg />
      </li>
    </ul>
  </div>
</template>

<script>
export default {}
</script>
<style lang="scss" scoped>
.list {
  ul {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 132px;
      height: 132px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
