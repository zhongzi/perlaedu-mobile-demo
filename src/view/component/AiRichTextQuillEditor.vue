<template>
  <div :class="b()">
    <template v-if="isEditing">
      <quill-editor :value="value" :options="options" @change="onChanged" />
    </template>
    <template v-else-if="value">
      <section class="ql-editor" v-html="value" />
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Mixins } from "vue-property-decorator";

import UploaderMixin from "@/mixin/Uploader";

import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";

@Component({
  name: "ai-text-editor",
  components: {
    quillEditor,
  },
})
export default class Home extends Mixins(UploaderMixin) {
  @Prop({ type: String, default: "" }) value: string;
  @Prop({ type: Boolean, default: true }) isEditing: boolean;
  @Prop({ type: Object, default: () => ({}) }) quillOptions: any;
  @Prop({ type: String, default: "" }) imageType: string;
  @Prop({ type: String, default: "" }) imageKey: string;

  get options() {
    return Object.assign(
      {
        placeholder: "来写点什么...",
        theme: "snow",
        modules: {
          toolbar: [
            [
              { header: ["1", "2", "3", "4", "5", "6"] },
              { color: [] },
              { background: [] },
              "bold",
              "italic",
              "underline",
            ],
            [
              "link",
              { align: [] },
              { list: "ordered" },
              { list: "bullet" },
              "clean",
            ],
          ],
        },
      },
      this.quillOptions
    );
  }

  onImageUpload(file) {
    return new Promise((resolve, reject) => {
      this.uploadFile(file, this.imageType, this.imageKey, resolve);
    });
  }

  onChanged({ quill, html, text }) {
    this.$emit("input", html);
  }
}
</script>
<style lang="scss" scoped>
.ai-text-editor {
  .ql-editor {
    padding: 5px;
    line-height: 2;
    text-align: justify;
  }

  & ::v-deep .ql-snow {
    border: none;
  }

  & ::v-deep .quill-editor {
    border: 1px dashed #d2cccc;
  }

  & ::v-deep .ql-editor {
    padding: 5px;
    line-height: 2;
    text-align: justify;
  }
}
</style>
