<template>
  <div class="index-wrapper">
    <Header></Header>
    <router-view></router-view>
  </div>
</template>

<script>
  import Header from "../components/Header"

  export default {
    name: "Index",
    components: {
      Header
    }
  }
</script>
