<template>
  <figure :title="item?.data.type.description">
    <canvas ref="canvas" height="200" width="200"></canvas>
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
  },
})
export default class ItemSlot extends Vue {
  item!: Item;
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
}
</script>

<style scoped lang="scss">
figure {
  margin: 0;

  canvas {
    height: 5em;
    width: 5em;
    border: 1px dotted black;
    box-sizing: border-box;
  }
}
</style>