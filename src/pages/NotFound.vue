<!-- 404页面 created by andyguo -->
<template>
  <div class="error-container">
    <div class="error_404">
      <span>4</span>
      <span>0</span>
      <span>4</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "NotFound",
  }
</script>

<style scoped lang="scss">
  .error-container {
    background-color: #ececec;
    position: fixed;
    width: 100%;
    height: 100%;

    .error_404 {
      position: absolute;
      margin: auto;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      height: 210px;
      text-align: center;
      font-family: cursive;
      font-size: 150px;
      font-weight: bold;
      letter-spacing: 5px;
      color: #fff;
      z-index: 10;
    }

    .error_404 span {
      cursor: pointer;
      text-shadow: 0 0 2px #686868,
      0 1px 1px #ddd,
      0 2px 1px #d6d6d6,
      0 3px 1px #ccc,
      0 4px 1px #c5c5c5,
      0 5px 1px #c1c1c1,
      0 6px 1px #bbb,
      0 7px 1px #777,
      0 8px 3px rgba(100, 100, 100, 0.4),
      0 9px 5px rgba(100, 100, 100, 0.1),
      0 10px 7px rgba(100, 100, 100, 0.15),
      0 11px 9px rgba(100, 100, 100, 0.2),
      0 12px 11px rgba(100, 100, 100, 0.25),
      0 13px 15px rgba(100, 100, 100, 0.3);
      -webkit-transition: all .1s linear;
      transition: all .1s linear;
    }

    .error_404 span:hover {
      text-shadow: 0 0 2px #686868,
      0 1px 1px #fff,
      0 2px 1px #fff,
      0 3px 1px #fff,
      0 4px 1px #fff,
      0 5px 1px #fff,
      0 6px 1px #fff,
      0 7px 1px #777,
      0 8px 3px #fff,
      0 9px 5px #fff,
      0 10px 7px #fff,
      0 11px 9px #fff,
      0 12px 11px #fff,
      0 13px 15px #fff;
      -webkit-transition: all .1s linear;
      transition: all .1s linear;
    }
  }
</style>
