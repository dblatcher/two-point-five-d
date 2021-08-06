<template>
  <div class="container" v-if="spritesLoaded">
    <nav class="menu">
      <section class="primary">
        <character-tags
          @chooseOpen="handleChooseOpenCharacter"
          :open="indexOfCharacterWithScreenOpen"
        />
      </section>
      <section class="sidebar">
        <item-in-hand />
        <pause-button />
      </section>
    </nav>

    <main>
      <section class="primary">
        <sight-canvas v-show="indexOfCharacterWithScreenOpen == null" />
        <character-screen
          v-show="indexOfCharacterWithScreenOpen != null"
          :index="indexOfCharacterWithScreenOpen"
          @close="handleChooseOpenCharacter(null)"
        ></character-screen>
      </section>

      <section class="sidebar">
        <map-canvas />
        <controls />
      </section>
    </main>

    <intersitial-window/>
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
import CharacterTags from "./CharacterTags.vue";
import IntersitialWindow from "./IntersitialWindow.vue";


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
    CharacterTags,
    IntersitialWindow,
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

  handleChooseOpenCharacter(index: number): void {
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

}
</script>

<style scoped lang="scss">
.container {
  background-color: lightgray;
  position: relative;

  .menu {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    flex-wrap: wrap;
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
    }
  }

  .primary {
    flex: 3;
    max-width: 800px;
  }

  .sidebar {
    flex: 1;
    padding-left: 0.25rem;
  }

  .menu .sidebar {
    display: flex;
    justify-content: space-between;
  }
}
</style>
