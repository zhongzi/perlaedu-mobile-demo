<template>
  <div class="wrapper source">
    <ai-line-header title="来源及日志" class="header" />
    <div class="content" v-if="coupon.remark && coupon.remark.length > 0">
      {{ coupon.remark }}
    </div>
    <bill-coupon-action :coupon="coupon" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import AiLineHeader from "@/view/component/AiLineHeader.vue";

import BillCouponAction from "./BillCouponAction.vue";

@Component({
  components: {
    AiLineHeader,
    BillCouponAction,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) coupon: any;
}
</script>
<style lang="scss" scoped>
.source {
  .content {
    margin: 10px auto;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(74, 74, 74, 1);
    line-height: 20px;
  }
}
</style>
