<template>
  <div v-if="spritesLoaded">
    <nav class="menu">
      <pause-button />
      <button
        v-for="(character, index) in characters"
        :key="index"
        @click="characterButtonClick(character, index)"
        :style="characterButtonStyle(index)"
      >
        {{ character.data.name }}
      </button>
    </nav>
    <main>
      <section class="sight">
        <sight-canvas />
      </section>

      <section class="controls">
        <item-in-hand />
        <map-canvas />
        <controls />
      </section>
    </main>

    <character-screen
      :character="characterWithScreenOpen"
      :index="indexOfCharacterWithScreenOpen"
    />
  </div>

  <p v-if="!spritesLoaded">loading...</p>
  <sprite-loader @all-sprite-sheets-loaded="handleAllSpriteSheetsLoaded" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import MapCanvas from "./MapCanvas.vue";
import SightCanvas from "./SightCanvas.vue";
import Controls from "./Controls.vue";
import SpriteLoader from "./SpriteLoader.vue";
import PauseButton from "./PauseButton.vue";
import CharacterScreen from "./CharacterScreen.vue";
import ItemInHand from "./ItemInHand.vue";
import { Character } from "@/game-classes/Character";
import { toRaw } from "@vue/reactivity";
import { Game } from "@/game-classes/Game";

interface styleObject {
  backgroundColor: string;
}

interface GameHolderData {
  characterScreenOpen: boolean;
  characterWithScreenOpen: Character | null;
  indexOfCharacterWithScreenOpen: number | null;
  spritesLoaded: boolean;
}

@Options({
  props: {},
  components: {
    MapCanvas,
    Controls,
    SightCanvas,
    SpriteLoader,
    PauseButton,
    ItemInHand,
    CharacterScreen,
  },
})
export default class GameHolder extends Vue {
  $store!: typeof gameStore;
  spritesLoaded!: boolean;
  characterWithScreenOpen!: Character | null;
  indexOfCharacterWithScreenOpen!: number | null;

  data(): GameHolderData {
    return {
      characterScreenOpen: true,
      spritesLoaded: false,
      characterWithScreenOpen: null,
      indexOfCharacterWithScreenOpen: null,
    };
  }

  characterButtonClick(character: Character, index: number): void {
    if (character == toRaw(this.characterWithScreenOpen)) {
      this.characterWithScreenOpen = null;
      this.indexOfCharacterWithScreenOpen = null;
    } else {
      this.characterWithScreenOpen = character;
      this.indexOfCharacterWithScreenOpen = index;
    }
  }

  handleAllSpriteSheetsLoaded(): void {
    this.$store.dispatch("startTimer");
    this.spritesLoaded = true;
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
main {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    &.sight {
      flex: 2;
    }

    &.controls {
      flex: 1;
    }
  }
}

nav.menu {
  display: flex;
  justify-content: flex-end;
}
</style>
