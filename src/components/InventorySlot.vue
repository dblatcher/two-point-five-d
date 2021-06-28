<template>
    <figure>
        <canvas></canvas>
        <figcaption>{{ item?.data.type.description }}</figcaption>
    </figure>
</template>

<script lang="ts">
import { useStore } from "vuex";
import gameStore from "@/store";
import { Options, Vue } from "vue-class-component";
import { Item } from "@/game-classes/Item";

@Options({
  props: {
    item: Item,
  },
})
export default class InventorySlot extends Vue {


}

</script>

<style scoped lang="scss">

figure {
    display: flex;
    align-items: center;
    margin: 0;
    min-width: 100px;

    canvas {
        height: 30px;
        width: 30px;
        border: 3px double black;
    }
}

</style>