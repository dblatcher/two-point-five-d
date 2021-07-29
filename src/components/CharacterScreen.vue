<template>
  <article v-if="character">
    <header :style="computedHeaderStyle">
      <slot></slot>
      <h3>{{ character.data.name }}</h3>
      <button @click="$emit('close')">close</button>
    </header>
    <main :style="computedMainStyle">
      <self-window :character="character" />
      <inventory-window :character="character" />
      <equipment-window :character="character" />
    </main>
  </article>
</template>

<script lang="ts">
import { Character } from "@/game-classes/Character";
import gameStore from "@/store";
import { Game } from "@/game-classes/Game";
import { Options, Vue } from "vue-class-component";
import InventoryWindow from "./InventoryWindow.vue";
import EquipmentWindow from "./EquipmentWindow.vue";

import SelfWindow from "./SelfWindow.vue";
import { Color } from "@/canvas/Color";
import { toRaw } from "vue";

interface styleObject {
  backgroundColor?: string;
  borderColor?: string;
}

@Options({
  props: {
    index: Number,
  },
  components: {
    InventoryWindow,
    SelfWindow,
    EquipmentWindow,
  },
  emits: ["close"],
})
export default class GameHolder extends Vue {
  index!: number;
  $store!: typeof gameStore;

  get characters(): Character[] {
    return toRaw(this.$store.state.game.data.characters);
  }

  get character(): Character | null {
    if (this.index == null) {
      return null;
    }
    return toRaw(this.$store.state.game.data.characters[this.index]);
  }

  get backgroundColor(): Color {
    const colorIndex =
      this.index < Game.CHARACTER_COLORS.length ? this.index : 0;
    return Game.CHARACTER_COLORS[colorIndex];
  }

  get computedHeaderStyle(): styleObject {
    return {
      backgroundColor: this.backgroundColor.css,
    };
  }
  get computedMainStyle(): styleObject {
    return {
      backgroundColor: this.backgroundColor.opacityAt(0.5).lighter(50).css,
      borderColor: this.backgroundColor.css,
    };
  }
}
</script>

<style scoped lang="scss">
article {
  display: inline-flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  position: relative;
  margin: 0;
  box-sizing: border-box;

  color: black;

  header {
    display: flex;
    justify-content: space-between;
    padding: 0.5rem;

    h3 {
      margin: 0;
    }
  }

  main {
    flex: 1;
    display: flex;
    border-style: solid;
    border-left-width: 0;
    border-right-width: 0;
    border-bottom-width: 0.25rem;
  }
}
</style>