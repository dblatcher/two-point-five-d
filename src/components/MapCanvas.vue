<template>
  <figure>
    <figcaption>{{ caption }}</figcaption>
    <canvas ref="canvas"></canvas>
  </figure>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store";

@Options({
  props: {
    caption: String,
  },
})
export default class MapCanvas extends Vue {
  caption!: string;
  $store!: typeof store;

  mounted() {
    this.draw();
  }

  draw(): void {
    const { floor, vantage } = this.$store.state;
    const canvas = this.$refs.canvas as HTMLCanvasElement;
    floor.drawAsMap(canvas, vantage, 20);
  }
}
</script>

<style scoped lang="scss">
figure {
  background-color: burlywood;
}
</style>