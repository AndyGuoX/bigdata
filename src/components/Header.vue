<template>
    <div class="header-wrapper">
        <a href="javascript:void(0)" class="logo-wrap">
            <img class="logo" src="../../static/img/logo.png" alt="">
            <img class="logo-title" src="../../static/img/bgvisual.png" alt="">
        </a>
        <ul class="header-menu" @click="handleSelect">
            <li class="menu-active" tabindex="1">
                <router-link to="/index/task_index">集群检测</router-link>
            </li>
            <li>
                <router-link to="/index/task_index">数据可视化</router-link>
            </li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "Header",
        data() {
            return {
                activeIndex: '1',
            }
        },
        methods: {
            handleSelect(key, keyPath) {
                console.log(key, keyPath);
            }
        }
    }
</script>

<style scoped lang="scss">
    .header-wrapper {
        width: 100%;
        height: 85px;
        background-color: #567086;
        padding-left: 30px;

        .header-menu {
            height: 100%;
            float: left;
            margin-left: 30px;
            border: none;
            list-style: none;

            li.menu-active {
                background-color: #f5a623;
                color: #fff !important;
            }

            li {
                height: 100%;
                border: none;
                padding: 0 20px;
                line-height: 85px;
                color: #fff;
                cursor: pointer;
                float: left;
                font-size: 14px;

                &:hover {
                    color: #f5a623;
                }
            }

            .is-active {
                /*background-color: #f5a623 !important;*/
            }
        }

        .logo-wrap {
            float: left;
            margin-top: 20px;

            img {
                height: 40px;
                max-width: 100%;
            }

            img.logo {
                height: 40px;
                max-width: 100%;

                animation: logo-anim 12s Ease-in-out infinite;
                -webkit-animation: logo-anim 12s Ease-in-out infinite;
            }

            img.logo-title {
                padding-left: 20px;
            }
        }
    }

    @keyframes logo-anim {
        0%, 50% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
</style>