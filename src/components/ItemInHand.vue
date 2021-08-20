<template>
  <figure>
    <item-slot :item="item || null" :size="3" />
    <figcaption>
      {{ item ? item.data.type.name : "" }}
    </figcaption>
  </figure>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import ItemSlot from "./ItemSlot.vue";
import { Item } from "@/game-classes/Item";

@Options({
  components: {
    ItemSlot,
  },
})
export default class ItemInHand extends Vue {
  $store!: typeof gameStore;

  get item(): Item | undefined {
    this.$store.getters.timestamp;
    return this.$store.state.game.data.itemInHand;
  }
}
</script>

<style scoped lang="scss">
figure {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;

  figcaption {
    min-width: 6rem;
    text-align: left;
    padding-left: 0.2rem;
  }
}
</style>