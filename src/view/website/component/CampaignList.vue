<template>
  <div class="wrapper campaign">
    <ai-list-stored
      resource="campaignMerchant"
      :query="innerQuery"
      scrollType="slider"
      :sliderOptions="{
        slidesPerView: 1.4,
        initialSlide: 0,
        freeMode: true,
        spaceBetween: 10,
      }"
      :hideIfNoData="true"
    >
      <template v-slot:header>
        <img
          v-if="skin.title"
          :src="skin.title.image"
          :style="skin.title.style"
        />
        <div v-else>最新活动</div>
      </template>
      <template v-slot:item="{ item }">
        <campaign
          class="item"
          :campaign="item.campaign"
          :merchant="item.merchant"
          :key="item.id"
        />
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import Campaign from "./Campaign.vue";

import merge from "lodash/merge";
import _get from "lodash/get";

@Component({
  components: {
    AiListStored,
    Campaign,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) query: any;
  @Prop({ type: Object, default: null }) merchant: any;

  get skin() {
    return _get(this.merchant, "website.skin.campaign", {});
  }

  get innerQuery() {
    return merge(
      {
        "Campaign.status": "ongoing",
        extras: JSON.stringify({
          CampaignMerchant: ["campaign", "merchant"],
          Campaign: ["url"],
        }),
      },
      this.query || {}
    );
  }
}
</script>
<style lang="scss" scoped>
.campaign {
  & ::v-deep .ai-card__header {
    min-height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & ::v-deep .ai-list-stored__title {
    padding: 0px 20px;
  }

  & ::v-deep .ai-slider__swiper-item:nth-child(1) {
    margin-left: 20px;
  }
}
</style>
