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
  <section>
    <div class="hand-holder">
      <item-slot
        @click="handleEquipSlotClick('LEFT_HAND')"
        :imgIcon="'/img/hand-left.png'"
        :item="getEquipment('LEFT_HAND')"
      />
    </div>
  </section>
  <section>
    <div>
      <item-slot
        @click="handleEquipSlotClick('HEAD')"
        :imgIcon="'/img/head.png'"
        :item="getEquipment('HEAD')"
      />
      <item-slot
        @click="handleEquipSlotClick('TORSO')"
        :imgIcon="'/img/torso.png'"
        :item="getEquipment('TORSO')"
      />
      <item-slot
        @click="handleEquipSlotClick('LEGS')"
        :imgIcon="'/img/legs.png'"
        :item="getEquipment('LEGS')"
      />
      <item-slot
        @click="handleEquipSlotClick('FEET')"
        :imgIcon="'/img/feet.png'"
        :item="getEquipment('FEET')"
      />
    </div>
  </section>

  <section>
    <div class="hand-holder">
      <item-slot
        @click="handleEquipSlotClick('RIGHT_HAND')"
        :imgIcon="'/img/hand-right.png'"
        :item="getEquipment('RIGHT_HAND')"
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
import { Character } from "@/game-classes/Character";

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

  getEquipment(slotName: string): Item | null {
    return toRaw(this.character.data.equipmentSlots?.get(slotName)) || null;
  }

  handleInventoryClick(item: Item, index: number): void {
    this.$store.dispatch("inventoryClick", {
      item,
      index,
      character: toRaw(this.character),
    });
  }

  handleEquipSlotClick(slotName: string): void {
    this.$store.dispatch("equipSlotClick", {
      slotName,
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

  div.hand-holder {
    padding-top: 6em;
  }
}
</style>