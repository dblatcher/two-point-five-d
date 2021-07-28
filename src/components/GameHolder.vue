<template>
  <div class="container" v-if="spritesLoaded">
    <nav class="menu">
      <character-buttons
        @choose="characterButtonClick"
        :active="indexOfCharacterWithScreenOpen"
      />
      <item-in-hand />
      <pause-button />
    </nav>

    <main>
      <section class="primary">
        <sight-canvas v-show="indexOfCharacterWithScreenOpen == null" />
        <character-screen v-show="indexOfCharacterWithScreenOpen != null"
          :index="indexOfCharacterWithScreenOpen"
          @close="characterButtonClick(null)"
        ></character-screen>
      </section>

      <section class="sidebar">

        <map-canvas />
        <controls />
      </section>
    </main>
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

  characterButtonClick(index: number): void {
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
.container {
  
  background-color: lightgray;

  nav.menu {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  main {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;

      &.primary {
        flex: 2;
        padding-right: .25rem;
      }

      &.sidebar {
        flex: 1;
        padding-left: .25rem;
      }
    }
  }
}
</style>
