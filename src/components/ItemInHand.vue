<template>
  <figure :timeStamp="timeStamp.toString()">
    <item-slot :item="item || null" :size="5" />
    <figcaption>
      {{ item ? item.data.type.description : "" }}
    </figcaption>
  </figure>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { Options, Vue } from "vue-class-component";

import ItemSlot from "./ItemSlot.vue";

import gameStore from "@/store";
import { Item } from "@/game-classes/Item";
import { toRaw } from "@vue/reactivity";

interface ItemInHandData {
  item: Item | undefined;
}

@Options({
  components: {
    ItemSlot,
  },
})
export default class ItemInHand extends Vue {
  declare $data: ItemInHandData;
  item!: Item | undefined;

  data(): ItemInHandData {
    return {
      item: undefined,
    };
  }

  get timeStamp(): number {
    const store = useStore() as typeof gameStore;
    return store.state.timestamp;
  }

  mounted(): void {
    this.updateItemInHand();
  }

  updated(): void {
    this.updateItemInHand();
  }

  updateItemInHand(): void {
    const store = useStore() as typeof gameStore;
    this.item = toRaw(store.state.game.data.itemInHand);
  }
}
</script>

<style scoped lang="scss">
figure {
  display: flex;
  align-items: flex-end;
  justify-content: flex-start;
  margin: 0;
  align-self: stretch;
  padding: .25rem;
}
</style>