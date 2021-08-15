<template>
  <section :timeStamp="timeStamp.toString()" :class="{'hands-only': handsOnly}">
    <div class='hand-holder'>
      <item-slot
        @click.stop="handleEquipSlotClick('LEFT_HAND')"
        :imgIcon="'/img/hand-left.png'"
        :item="getEquipment('LEFT_HAND')"
      />
    </div>

    <div v-if="!handsOnly">
      <item-slot
        @click.stop="handleEquipSlotClick('HEAD')"
        :imgIcon="'/img/head.png'"
        :item="getEquipment('HEAD')"
      />
      <item-slot
        @click.stop="handleEquipSlotClick('TORSO')"
        :imgIcon="'/img/torso.png'"
        :item="getEquipment('TORSO')"
      />
      <item-slot
        @click.stop="handleEquipSlotClick('LEGS')"
        :imgIcon="'/img/legs.png'"
        :item="getEquipment('LEGS')"
      />
      <item-slot
        @click.stop="handleEquipSlotClick('FEET')"
        :imgIcon="'/img/feet.png'"
        :item="getEquipment('FEET')"
      />
    </div>

    <div class='hand-holder'>
      <item-slot
        @click.stop="handleEquipSlotClick('RIGHT_HAND')"
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
import { Character } from "@/rpg-classes/Character";

@Options({
  components: {
    ItemSlot,
  },
  props: {
    character: Character,
    handsOnly: Boolean,
  },
})
export default class EquipmentWindow extends Vue {
  caption!: string;
  $store!: typeof gameStore;
  character!: Character;

  // maintains reactivity - change to the store value triggers updated()
  get timeStamp(): number {
    const store = useStore() as typeof gameStore;
    return store.state.timestamp;
  }

  getEquipment(slotName: string): Item | null {
    return toRaw(this.character.data.equipmentSlots?.get(slotName)) || null;
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
  padding: 0.25rem;
  display: flex;

  div {
    display: inline-block;

    &.hand-holder {
      padding-top: 50%;
    }
  }

  &.hands-only {
    padding: 0;

    div.hand-holder {
      padding-top:0;
    }
  }
}
</style>