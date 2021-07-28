<template>
  <article>
    <button
      v-for="(character, index) in characters"
      :key="index"
      @click="characterButtonClick(index)"
      :style="characterButtonStyle(index)"
    >
      <img v-if="index === active" :src="character.portraitSrc" />

      <equipment-window
        v-if="index !== active"
        :character="character"
        :handsOnly="true"
      />

      {{ character.data.name }}
    </button>
  </article>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import EquipmentWindow from "./EquipmentWindow.vue";
import { Character } from "@/game-classes/Character";
import { toRaw } from "@vue/reactivity";
import { Game } from "@/game-classes/Game";

interface styleObject {
  backgroundColor: string;
}

@Options({
  props: {
    active: Number,
  },
  components: { EquipmentWindow },
  emits: ["choose"],
})
export default class CharacterButtons extends Vue {
  $store!: typeof gameStore;
  active!: number;
  declare $refs: { canvas: HTMLCanvasElement };

  characterButtonClick(index: number): void {
    this.$emit("choose", index);
  }

  get characters(): Character[] {
    return toRaw(this.$store.state.game.data.characters);
  }

  characterButtonStyle(index: number): styleObject {
    return {
      backgroundColor: Game.CHARACTER_COLORS[index].css,
    };
  }
}
</script>

<style scoped lang="scss">
article {
  display: flex;
  flex-basis: 30rem;

  button {
    flex: 1;
    display: inline-flex;
    justify-content: space-between;
  }

  img {
    width: 3rem;
    height: 3rem;
  }
}
</style>
