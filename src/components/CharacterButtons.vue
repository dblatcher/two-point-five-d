<template>
  <article>
      <button
        v-for="(character, index) in characters"
        :key="index"
        @click="characterButtonClick(index)"
        :style="characterButtonStyle(index)"
      >
        {{ character.data.name }}
        <span v-if="index === active">*</span>
      </button>
      
  </article>

</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";

import { Character } from "@/game-classes/Character";
import { toRaw } from "@vue/reactivity";
import { Game } from "@/game-classes/Game";

interface styleObject {
  backgroundColor: string;
}


@Options({
  props: {
    active:Number
  },
  components: {

  },
  emits:["choose"]
})
export default class CharacterButtons extends Vue {
  $store!: typeof gameStore;


  characterButtonClick(index: number): void {
      this.$emit('choose', index)
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
            flex: 1
        }
    }

</style>
