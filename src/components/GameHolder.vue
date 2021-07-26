<template>
  <div v-if="spritesLoaded">
    <nav class="menu">
      <character-buttons @choose="characterButtonClick" :active="indexOfCharacterWithScreenOpen"/>
      <pause-button />
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
      :index="indexOfCharacterWithScreenOpen"
      @close="characterButtonClick(null)"
    ></character-screen>
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
import CharacterButtons from "./CharacterButtons.vue";
import { Character } from "@/game-classes/Character";
import { toRaw } from "@vue/reactivity";


interface GameHolderData {
  characterScreenOpen: boolean;
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
    CharacterButtons,
  },
})
export default class GameHolder extends Vue {
  $store!: typeof gameStore;
  spritesLoaded!: boolean;
  indexOfCharacterWithScreenOpen!: number | null;

  data(): GameHolderData {
    return {
      characterScreenOpen: true,
      spritesLoaded: false,
      indexOfCharacterWithScreenOpen: null,
    };
  }

  characterButtonClick( index: number): void {
    if (index == this.indexOfCharacterWithScreenOpen) {
      this.indexOfCharacterWithScreenOpen = null;
    } else {
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
  justify-content: space-between;
}
</style>
