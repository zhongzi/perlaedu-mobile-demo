<template>
  <div class="wrapper union-merchants">
    <ai-list-stored
      resource="merchant"
      :query="innerQuery"
      :limit="20"
      scrollType="none"
      :enableMoreData="false"
      :hideIfNoData="true"
    >
      <template v-slot:item="{ item, index }">
        <union-merchant
          :merchant="item"
          :key="item.id"
          @click.native="curIdx = index"
          mode="logo"
          class="logo"
          :isSelected="index === curIdx"
        />
      </template>
      <template v-slot:footer="{ list }">
        <ai-slider
          :list="list"
          :slideToNum.sync="curIdx"
          :options="swiperOptions"
          class="slider"
        >
          <template v-slot:item="{ item }">
            <union-merchant :merchant="item" :key="item.id" class="item" />
          </template>
        </ai-slider>
      </template>
    </ai-list-stored>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiListStored from "@/view/component/AiListStored.vue";
import AiSlider from "@/view/component/AiSlider.vue";
import UnionMerchant from "./UnionMerchant.vue";

import merge from "lodash/merge";

@Component({
  components: {
    AiListStored,
    AiSlider,
    UnionMerchant,
  },
})
export default class Home extends Vue {
  @Prop({ type: Object, default: null }) union: any;

  curIdx: number = 0;

  get swiperOptions() {
    return {
      effect: "coverflow",
      slidesPerView: 2,
      freeMode: false,
      centeredSlides: true,
      coverflowEffect: {
        rotate: 0, // 旋转的角度
        stretch: -20, // 拉伸   图片间左右的间距和密集度
        depth: 100, // 深度   切换图片间上下的间距和密集度
        modifier: 2, // 修正值 该值越大前面的效果越明显
      },
    };
  }

  get innerQuery() {
    return merge(
      {
        "UnionMerchant.union_id": this.union.id,
        sort: "statistics.person.count_accumulative desc",
      },
      {}
    );
  }
}
</script>
<style lang="scss" scoped>
.union-merchants {
  & ::v-deep .ai-list-stored__list {
    margin: 0px 27px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }

  .logo {
    margin: 3px;
  }
  .slider {
    margin-top: 10px;
    & ::v-deep .swiper-wrapper {
      margin-bottom: 30px;
    }
  }
}
</style>
