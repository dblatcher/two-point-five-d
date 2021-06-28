<template>
  <section :timeStamp="timeStamp.toString()">
    <h2>inventory</h2>

    <div>
      <inventory-slot
        v-for="(item, index) in inventory"
        :key="index"
        @click="handleInventoryClick(item, index)"
        :item="item"
      />
    </div>
  </section>
</template>

<script lang="ts">
import { useStore } from "vuex";
import { Options, Vue } from "vue-class-component";

import InventorySlot from "./InventorySlot.vue";

import gameStore from "@/store";
import { Item } from "@/game-classes/Item";

@Options({
  components: {
    InventorySlot,
  },
})
export default class InventoryWindow extends Vue {
  caption!: string;
  $store!: typeof gameStore;

  // maintains reactivity - change to the store value triggers updated()
  get timeStamp(): number {
    const store = useStore() as typeof gameStore;
    return store.state.timestamp;
  }

  get inventory(): Array<Item | null> {
    const store = useStore() as typeof gameStore;
    return store.state.game.data.playerCharacter.data.inventory;
  }

  handleInventoryClick(item: Item, index: number): void {
    this.$store.dispatch("inventoryClick", { item, index });
  }
}
</script>

<style scoped lang="scss">
section {
  border: 3px dotted dodgerblue;
  display: inline-block;
  padding: 1rem;

  h2 {
    margin: 0;
  }
}
</style>