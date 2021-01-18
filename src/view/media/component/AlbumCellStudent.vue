<template>
  <ai-card
    class="wrapper card"
    v-if="isSliderMode"
    @click.native="gotoAlbumDetail"
  >
    <template v-slot:header>
      <img :src="cover | alioss({ width: 100 })" />
    </template>
    <template v-slot:footer>
      <div>{{ title }}</div>
    </template>
  </ai-card>
  <ai-cell
    v-else
    :cover="cover"
    :title="title"
    class="wrapper cell"
    @click.native="gotoAlbumDetail"
  >
    <template v-slot:right>
      <span v-if="isDetailMode" class="count"> {{ total }} 张 </span>
      <template v-else>
        <img
          v-for="link in links"
          :src="link.media.url | alioss({ width: 100 })"
          :key="link.id"
          class="preview"
        />
      </template>
    </template>
  </ai-cell>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Mixins } from "vue-property-decorator";

import SyncMixin from "@/mixin/SyncMixin";

import AiCard from "@/view/component/AiCard.vue";
import AiCell from "@/view/component/AiCell.vue";

import _get from "lodash/get";
import cloneDeep from "lodash/cloneDeep";

@Component({
  components: {
    AiCard,
    AiCell,
  },
})
export default class Home extends Mixins(SyncMixin) {
  @Prop({ type: Object, default: null }) student: any;
  @Prop({ type: [String, Number], default: null }) merchantId: string | number;
  @Prop({ type: String, default: "slider" }) mode: string;
  @Prop({ type: Number, default: 0 }) total: number;

  get links() {
    return this.list.slice(0, 3);
  }

  get isSliderMode() {
    return this.mode === "slider";
  }

  get isDetailMode() {
    return this.mode === "detail";
  }

  get cover() {
    return (
      _get(this.links, "[0].media.url") ||
      require("@/asset/image/media-album-empty.jpg")
    );
  }

  get title() {
    return _get(this.student, "realname");
  }

  created() {
    this.store = "mediaLink";
    this.loadMediaLinks();
  }

  @Watch("student", { deep: true })
  onStudentChanged() {
    this.loadMediaLinks();
  }

  @Watch("merchantId", { deep: true })
  onMerchangIdChanged() {
    this.loadMediaLinks();
  }

  loadMediaLinks() {
    if (!this.student || !this.merchantId) return;

    this.loadList({
      query: {
        target_id: this.student.id,
        target_class: "Person",
        sort: "is_cover desc",
        extras: JSON.stringify({
          MediaLink: ["media"],
          Media: ["url"],
        }),
        limit: 3,
      },
    });
  }

  gotoAlbumDetail() {
    if (this.isDetailMode) return;

    this.$router.push({
      name: "mediaAlbum",
      params: {
        albumId: this.student.id,
      },
      query: {
        type: "student",
      },
    });
  }

  gotoPhotoDetail(link) {
    this.$router.push({
      name: "mediaPhoto",
      params: {
        linkId: link.id,
      },
    });
  }
}
</script>
<style lang="scss" scoped>
.card {
  & ::v-deep .ai-card__footer {
    div {
      padding: 0px 5px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  & ::v-deep .ai-card__header {
    padding: 3px;
    height: 50px;
    min-height: 50px;
    max-height: 50px;

    img {
      max-height: 100%;
    }
  }
}
.cell {
  width: 100%;
  background: #fff;
  border-radius: 10px;
  padding: 5px;
  margin: 10px 0px;

  & ::v-deep .ai-cell__left-cover {
    width: 60px;
    max-width: 60px;

    height: 50px;
    min-height: 50px;
    max-height: 50px;

    img {
      width: auto;
      max-width: 100%;
      max-height: 100%;
      margin: auto;
    }
  }

  .preview {
    display: inline-block;
    margin: 0px 5px;
    width: 30px;
  }

  .count {
    font-size: 16px;
  }
}
</style>