<template>
  <div class="wrapper website">
    <router-view />
    <ai-bottom-navigation
      v-if="showMenu"
      :menus="menus"
      @click="onClick"
      :cusStyle="mergedStyle | safe('style', {})"
      :color="mergedStyle | safe('icon.color')"
      :activeColor="mergedStyle | safe('icon.activeColor')"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

import AiBottomNavigation from "@/view/component/AiBottomNavigation.vue";

import isEqual from "lodash/isEqual";
import find from "lodash/find";

@Component({
  components: {
    AiBottomNavigation,
  },
})
export default class Home extends Vue {
  menus: any = [
    {
      name: "首页",
      icon: "home",
    },
    {
      name: "我的",
      icon: "user",
    },
  ];
  mergedStyle: any = {};

  get showMenu() {
    // let hide = this.$route.meta.hideMenu;
    // if (!hide) {
    //   this.$route.matched.forEach((route: any) => {
    //     if (route.meta.hideMenu) {
    //       hide = route.meta.hideMenu;
    //     }
    //   });
    // }
    return ["websiteMerchant"].indexOf(this.$route.name) >= 0;
  }

  get isInMerchantWebsite() {
    return this.$route.name === "websiteMerchant";
  }

  created() {
    this.$bus.$on("website:menu:style", (style) => {
      this.mergedStyle = style;
    });
  }

  onClick(menu) {
    if (isEqual(menu, this.menus[0])) {
      if (
        find(this.$route.matched, (location) => {
          return location.name === "websiteMerchant";
        })
      ) {
        this.$router.push({
          name: "websiteMerchant",
        });
      } else {
        this.$router.push({
          name: "websiteUnion",
        });
      }
    } else {
      this.$router.push({
        name: "student",
      });
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  height: 100%;
}
</style>
