<template>
  <nav v-bind:class="{ 'not-paused': !$store.getters.gameIsPaused }">
    <section class="character-buttons" v-show="!characterSelected">
      <button
        class="button"
        v-for="(character, index) in characters"
        v-bind:key="index"
        :style="getButtonStyleObject(index)"
        @click="handleCharacterClick(index)"
      >
        {{ character.data.name }}
      </button>
    </section>
    <section class="option-buttons" v-if="characterSelected">
      <button
        class="button"
        v-for="(option, index) in attackOptions"
        v-bind:key="index"
        :style="getButtonStyleObject(selectedIndex)"
        @click="handleOptionClick(index)"
      >
        {{ option }}
      </button>
    </section>
  </nav>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import store from "@/store";
import { Character } from "@/rpg-classes/Character";
import { toRaw } from "vue";
import { Game } from "@/game-classes/Game";

interface ButtonStyleObject {
  backgroundColor: string;
}

export default class AttackButtons extends Vue {
  $store!: typeof store;
  selectedIndex!: number | undefined;

  data(): {
    selectedIndex: number | undefined;
  } {
    return {
      selectedIndex: undefined,
    };
  }

  handleCharacterClick(index: number): void {
    if (this.$store.getters.gameIsPaused) {
      return;
    }
    this.selectedIndex = index;
  }

  handleOptionClick(index: number): void {
    if (this.$store.getters.gameIsPaused) {
      return;
    }

    this.$store.dispatch("attackButtonClick", {
        option: toRaw(this.attackOptions[index]),
      character: toRaw(this.characterSelected),
    }).then(feedback => {
        console.log(feedback)
        // to do - display damage amount.
    });

    this.selectedIndex = undefined;
  }

  get characterSelected(): Character | null {
    if (typeof this.selectedIndex == "number") {
      return this.characters[this.selectedIndex] || null;
    }

    return null;
  }

  get characters(): Character[] {
    this.$store.getters.timestamp;
    return toRaw(this.$store.state.game.data.characters);
  }

  get attackOptions(): string[] {
    return this.characterSelected?.attackOptions || [];
  }

  getButtonStyleObject(index: number): ButtonStyleObject {
    return {
      backgroundColor: Game.CHARACTER_COLORS[index].lighter(30).css,
    };
  }
}
</script>

<style scoped lang="scss">
nav {
  height: 8rem;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  position: relative;
  display: flex;

  .character-buttons {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: stretch;
  }

  .option-buttons {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }

  .button {
    flex-basis: 25%;
    transition: filter 0.5s, color 0.5s;
  }

  &.not-paused {
    .button:hover {
      filter: brightness(0.8);
      color: whitesmoke;
    }
  }
}
</style>