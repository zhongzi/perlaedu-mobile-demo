<template>
  <div class="wrapper merchant">
    <div :class="['logo', { selected: isSelected }]" v-if="mode === 'logo'">
      <img :src="merchant.logo_url" />
    </div>
    <ai-card v-else @click.native="onClick" class="card">
      <template v-slot:header>
        <img
          class="cover"
          :src="
            merchant.cover_url
              | alioss({ width: 320, height: 180, mode: 'fill' })
          "
        />
      </template>
      <template v-slot:body>
        <div class="body">
          <div>{{ merchant.name }}</div>
        </div>
      </template>
    </ai-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiCard from "@/view/component/AiCard.vue";

@Component({
  components: {
    AiCard,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: () => ({}) }) merchant: any;
  @Prop({ type: String, default: "simple" }) mode: string;
  @Prop({ type: Boolean, default: false }) isSelected: boolean;

  onClick() {
    this.$router.push({
      name: "websiteMerchant",
      params: {
        merchantId: this.merchant.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.merchant {
  .logo {
    border-radius: 20px;
    border: 4px solid transparent;

    img {
      width: 50px;
      height: 50px;
      border-radius: 12px;
      vertical-align: bottom;
    }
  }
  .selected {
    box-shadow: 0px 8px 14px 0px rgba(0, 0, 0, 0.27);
    border: 4px solid rgba(255, 255, 255, 1);
  }
  .card {
    box-shadow: 0px 14px 20px 0px rgba(0, 0, 0, 0.2);
    .cover {
      border-radius: 0px 0px 10px 10px;
    }
    .body {
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(74, 74, 74, 1);
      line-height: 20px;
      text-shadow: 0px 14px 20px rgba(0, 0, 0, 0.2);
      padding: 10px 0px;
    }
  }
}
</style>
