<template>
  <div class="container" v-if="spritesLoaded">
    <nav class="menu">
      <section class="primary" v-if="hasCharacters">
        <character-tags
          @chooseOpen="handleChooseOpenCharacter"
          :open="indexOfCharacterWithScreenOpen"
        />
      </section>
      <section class="sidebar">
        <item-in-hand />

        <button v-if="hasQuests" @click="() => {questWindowOpen = !questWindowOpen}">Quests</button>

        <pause-button />
      </section>
    </nav>

    <main>
      <section class="primary">
        <sight-canvas v-show="indexOfCharacterWithScreenOpen == null" />
        <character-screen v-if="hasCharacters"
          v-show="indexOfCharacterWithScreenOpen != null"
          :index="indexOfCharacterWithScreenOpen"
          @close="handleChooseOpenCharacter(null)"
        ></character-screen>

        <quest-window :show="questWindowOpen" @close="()=>{questWindowOpen=false}"/>
      </section>

      <section class="sidebar">
        <map-canvas />
        <attack-buttons v-if="hasCharacters"/>
        <controls />
      </section>
    </main>

    <aside>
      <message-box/>
    </aside>

    <intersitial-window/>
  </div>

  <p v-if="!spritesLoaded">loading...</p>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import MapCanvas from "./MapCanvas.vue";
import SightCanvas from "./SightCanvas.vue";
import Controls from "./Controls.vue";
import PauseButton from "./PauseButton.vue";
import CharacterScreen from "./CharacterScreen.vue";
import ItemInHand from "./ItemInHand.vue";
import CharacterTags from "./CharacterTags.vue";
import IntersitialWindow from "./IntersitialWindow.vue";
import QuestWindow from "./QuestWindow.vue";
import MessageBox from "./MessageBox.vue";
import AttackButtons from "./AttackButtons.vue";


interface GameHolderData {
  characterScreenOpen: boolean;
  questWindowOpen:boolean;
  indexOfCharacterWithScreenOpen: number | null;
  spritesLoaded: boolean;
}

@Options({
  props: {},
  components: {
    MapCanvas,
    Controls,
    SightCanvas,
    PauseButton,
    ItemInHand,
    CharacterScreen,
    CharacterTags,
    IntersitialWindow,
    QuestWindow,
    MessageBox,
    AttackButtons,
  },
})
export default class GameHolder extends Vue {
  $store!: typeof gameStore;
  spritesLoaded!: boolean;
  questWindowOpen!: boolean;
  indexOfCharacterWithScreenOpen!: number | null;

  data(): GameHolderData {
    return {
      characterScreenOpen: true,
      spritesLoaded: false,
      questWindowOpen: false,
      indexOfCharacterWithScreenOpen: null,
    };
  }

  mounted():void {
    this.$store.state.game.loadImages()
      .then(() => {
        this.$store.dispatch("startTimer");
        this.spritesLoaded = true;
      })
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

  get hasCharacters():boolean {
    return !this.$store.state.game.rules.noCharacters
  }

  get hasQuests():boolean {
    return !!this.$store.state.game.data.quests
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
    justify-content: flex-start;
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
    position: relative;
  }

  .sidebar {
    flex: 1;
    padding-left: 0.25rem;
    max-width: 400px;
  }

  .menu .sidebar {
    display: flex;
    justify-content: space-between;
  }
}
</style>
