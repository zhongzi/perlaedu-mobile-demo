<template>
  <div class="wrapper photo-editing">
    <photo :medias="medias" :frame="frame" @refresh="resetMediaId" />
    <div v-if="medias && medias.length > 0">
      <div class="settings">
        <photo-basic :medias="medias" />
        <photo-link :medias="medias" v-if="isCreation" />
      </div>
    </div>
    <ai-fixed-footer>
      <ai-submit-actions
        cancelLabel="取消"
        submitLabel="保存"
        @cancel="goBack"
        @submit="save"
      />
    </ai-fixed-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins, Watch } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiTab from "@/view/component/AiTab.vue";

import Photo from "./component/editing/Photo.vue";
import PhotoBasic from "./component/editing/PhotoBasic.vue";
import PhotoLink from "./component/editing/PhotoLink.vue";
import PhotoPermission from "./component/editing/PhotoPermission.vue";
import AiSubmitActions from "@/view/component/AiSubmitActions.vue";
import AiFixedFooter from "@/view/component/AiFixedFooter.vue";

import cloneDeep from "lodash/cloneDeep";
import isEmpty from "lodash/isEmpty";
import concat from "lodash/concat";
import uniq from "lodash/uniq";
import difference from "lodash/difference";
import _get from "lodash/get";

@Component({
  components: {
    AiTab,
    AiSubmitActions,
    AiFixedFooter,
    Photo,
    PhotoBasic,
    PhotoLink,
    PhotoPermission,
  },
})
export default class Home extends Mixins(SyncMixin) {
  curTabIdx: number = 0;

  mediaId: number = null;
  medias: any = null;
  frame: any = null;

  isInSaving = false;

  get tabs() {
    return [
      { label: "归属关系", value: "link" },
      { label: "作品描述", value: "basic" },
    ];
  }

  get curTab() {
    return this.tabs[this.curTabIdx];
  }

  get isCreation() {
    return this.$route.params.mediaId === "new";
  }

  created() {
    this.$bus.$on("media:mutil:uploaded", (v) => {
      this.medias = cloneDeep(v);
    });
    this.resetMediaId();
  }

  @Watch("$route", { deep: true })
  onRouteChanged() {
    this.resetMediaId();
  }

  @Watch("mediaId")
  onMediaIdChanged() {
    this.load();
  }

  resetMediaId(mediaId = null) {
    this.mediaId = mediaId || parseInt(this.$route.params.mediaId);
  }

  save() {
    if (this.isInSaving) return;
    this.isInSaving = true;
    this.$bus.$on("media:saved:failed", () => {
      this.isInSaving = false;
    });

    let savedItems = [];
    this.$bus.$on("media:saved", (item) => {
      savedItems = uniq(concat(savedItems, item));
      const items = this.isCreation ? ["basic", "links"] : ["basic"];
      if (difference(items, savedItems).length === 0) {
        this.$hui.toast.info("保存成功");
        this.$bus.$off("media:saved");
        this.$bus.$off("media:saved");
        this.$bus.$emit("album:refresh");
        this.isInSaving = false;
        this.goBack();
        return;
      }
    });
    this.$bus.$emit("media:saving");
  }

  goBack() {
    this.$router.go(-1);
    return;
  }

  load() {
    if (!this.mediaId || this.mediaId <= 0) return;

    this.loadEntity({
      store: "media",
      id: this.mediaId,
      query: {
        extras: "frame,file,url",
      },
      success: (resp) => {
        this.medias = [cloneDeep(resp.data)];
        this.frame = _get(this.medias, "[0].frame");
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.photo-editing {
  min-height: 85vh;
  margin-bottom: 100px;

  .settings {
    padding: 20px;
  }
}
</style>
