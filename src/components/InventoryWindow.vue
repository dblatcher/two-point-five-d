<template>
  <section :timeStamp="timeStamp.toString()">
    <div class="bag">
      <item-slot
        v-for="(item, index) in inventory"
        :key="index"
        @click="handleInventoryClick(item, index)"
        :item="item"
        :imgIcon="index == 0 ? '/img/bag.png' : ''"
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
import { Character } from "@/rpg-classes/Character";

@Options({
  components: {
    ItemSlot,
  },
  props: {
    character: Character,
  },
})
export default class InventoryWindow extends Vue {
  caption!: string;
  $store!: typeof gameStore;
  character!: Character;

  // maintains reactivity - change to the store value triggers updated()
  get timeStamp(): number {
    const store = useStore() as typeof gameStore;
    return store.state.timestamp;
  }

  get inventory(): Array<Item | null> {
    return toRaw(this.character.data.inventory);
  }

  handleInventoryClick(item: Item, index: number): void {
    this.$store.dispatch("inventoryClick", {
      item,
      index,
      character: toRaw(this.character),
    });
  }
}
</script>

<style scoped lang="scss">
section {
  display: inline-block;
  padding: 0.25rem;

  div.bag {
    display: flex;
    max-width: 20em;
    flex-wrap: wrap;
  }

}
</style>