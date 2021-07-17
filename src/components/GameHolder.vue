<template>
  <div v-if="spritesLoaded">
    <nav class="menu">
      <pause-button />
      <button @click="()=>{characterScreenOpen = !characterScreenOpen}">open character screen</button>
    </nav>
    <main>
      <section class="sight">
        <sight-canvas />
      </section>

      <section class="controls">
        <item-in-hand/>
        <map-canvas />
        <controls />
      </section>
    </main>

    <aside v-show="characterScreenOpen">
      <self-window />
      <inventory-window />
    </aside>
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
import InventoryWindow from "./InventoryWindow.vue";
import SelfWindow from "./SelfWindow.vue";
import ItemInHand from "./ItemInHand.vue";

interface MyTestComponentData {
  characterScreenOpen: boolean
  spritesLoaded: boolean
}

@Options({
  props: {},
  components: {
    MapCanvas,
    Controls,
    SightCanvas,
    SpriteLoader,
    PauseButton,
    InventoryWindow,
    SelfWindow,
    ItemInHand,
  },
})
export default class GameHolder extends Vue {
  $store!: typeof gameStore;
  spritesLoaded!: boolean;

  data(): MyTestComponentData {
    return {
      characterScreenOpen: true,
      spritesLoaded: false,
    };
  }

  handleAllSpriteSheetsLoaded(): void {
    this.$store.dispatch("startTimer");
    this.spritesLoaded = true;
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

aside {
  position: fixed;
  bottom: 0;
  margin:0;
  box-sizing: border-box;
  background-color: rgba($color: #a44, $alpha: 0.5);
  display: flex;
}

nav.menu {
  display: flex;
  justify-content: flex-end;
}
</style>
