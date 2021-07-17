<template>
  <section :timeStamp="timeStamp.toString()">

    <div class="bag">
      <item-slot
        v-for="(item, index) in inventory"
        :key="index"
        @click="handleInventoryClick(item, index)"
        :item="item"
        :imgIcon="index == 0 ? '/img/bag.png':''"
      />
    </div>
  </section>
  <section :timeStamp="timeStamp.toString()">

    <div>
      <item-slot @click="handleEquipSlotClick('HEAD')"
        :imgIcon="'/img/head.png'"
        :item="getEquipment('HEAD')"
      />
      <item-slot @click="handleEquipSlotClick('TORSO')"
        :imgIcon="'/img/torso.png'"
        :item="getEquipment('TORSO')"
      />
      <item-slot @click="handleEquipSlotClick('LEGS')"
        :imgIcon="'/img/legs.png'"
        :item="getEquipment('LEGS')"
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

  getEquipment(slotName:string) : Item|null {
    const store = useStore() as typeof gameStore;

    return toRaw(store.state.game.data.playerCharacter.data.equipmentSlots?.get(slotName)) || null;
  }

  handleInventoryClick(item: Item, index: number): void {
    this.$store.dispatch("inventoryClick", { item, index });
  }

  handleEquipSlotClick(slotName:string): void {
    this.$store.dispatch("equipSlotClick", { slotName });
  }
}
</script>

<style scoped lang="scss">
section {
  display: inline-block;
  padding: 1rem;

  div.bag {
    display: flex;
    max-width: 20em;
    flex-wrap: wrap;
  }
}
</style>