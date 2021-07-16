<template>
  <section :timeStamp="timeStamp.toString()">
    <h2>inventory</h2>

    <div>
      <item-slot
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

import ItemSlot from "./ItemSlot.vue";

import gameStore from "@/store";
import { Item } from "@/game-classes/Item";
import { toRaw } from "vue";

@Options({
  components: {
    ItemSlot,
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

    return toRaw(store.state.game.data.playerCharacter.data.inventory);
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

  div {
    display: flex;
    max-width: 20em;
    flex-wrap: wrap;
  }
}
</style>