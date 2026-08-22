<template>
  <div data-role="sprite-loader">
    <img
      v-for="spriteSheet in $store.state.spriteSheets"
      :key="spriteSheet.id"
      :sheet-id="spriteSheet.id"
      :src="spriteSheet.src"
      @load="reportLoad(spriteSheet)"
    />
  </div>
</template>

<script lang='ts'>
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import { SpriteSheet } from "@/canvas/SpriteSheet";

@Options({
  emits: ["all-sprite-sheets-loaded", "loaded-sprite-sheet"],
})
export default class SpriteLoader extends Vue {
  $store!: typeof gameStore;
  loadedSheets!: SpriteSheet[];

  data(): { loadedSheets: SpriteSheet[] } {
    return {
      loadedSheets: [],
    };
  }

  reportLoad(spriteSheet: SpriteSheet): void {
    this.loadedSheets.push(spriteSheet);
    this.$emit("loaded-sprite-sheet", spriteSheet);
    if (this.allLoaded) {
      this.$emit("all-sprite-sheets-loaded");
    }
  }

  get allLoaded(): boolean {
    return this.loadedSheets.length == this.$store.state.spriteSheets.length;
  }
}
</script>

<style scoped>
div {
  display: none;
}
</style>