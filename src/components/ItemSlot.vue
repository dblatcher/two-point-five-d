<template>
  <figure :title="item?.data.type.description">
    <span v-if="glyphIcon" :style="glyphIconComputedStyle">{{ glyphIcon }}</span>
    <img v-if="imgIcon" :src="imgIcon" :style="imgIconComputedStyle"/>
    <canvas
      ref="canvas"
      height="200"
      width="200"
      :style="canvasComputedStyle"
    ></canvas>
  </figure>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { Item } from "@/game-classes/Item";
import { toRaw } from "vue";



interface ItemSlotData {
  oldItem: Item | null;
}

@Options({
  props: {
    item: Item,
    glyphIcon: String,
    imgIcon: String,
    size: Number,
    unit: String,
  },
})
export default class ItemSlot extends Vue {
  item!: Item;
  size!: number;
  unit!: string;
  oldItem!: Item;
  declare $refs: { canvas: HTMLCanvasElement };

  data(): ItemSlotData {
    return {
      oldItem: this.item,
    };
  }

  mounted(): void {
    this.draw();
  }

  updated(): void {
    const { item } = this;
    const oldItem = toRaw(this.oldItem);

    if (item !== oldItem) {
      this.oldItem = item;
      this.draw();
    }
  }

  draw(): void {
    const { item } = this;
    const canvas = this.$refs.canvas;

    if (item) {
      item.drawAsIcon(canvas);
    } else {
      Item.clearIcon(canvas);
    }
  }

  get canvasComputedStyle(): { width?: string; height?: string } {
    const { size = 3, unit = "em" } = this;
    return {
      width: `${size}${unit}`,
      height: `${size}${unit}`,
    };
  }

  get imgIconComputedStyle(): { width?: string; } {
    const { size = 3, unit = "em" } = this;
    return {
      width: `${size*(3/4)}${unit}`,
    };
  }

  get glyphIconComputedStyle(): { "font-size"?: string } {
    const { size = 3, unit = "em" } = this;
    return {
      "font-size": `${size * (3 / 4)}${unit}`,
    };
  }

}
</script>

<style scoped lang="scss">
figure {
  margin: 0;
  position: relative;

  img,span {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    z-index: 1;
  }

  img {
    height: auto;
  }

  canvas {
    height: 5em;
    width: 5em;
    border: 1px dotted black;
    box-sizing: border-box;
    z-index: 2;
    position: relative;
  }
}
</style>