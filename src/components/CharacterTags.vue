<template>
  <article>
    <section
      v-for="(character, index) in characters"
      :key="index"
      @click="handleChooseOpenCharacter(index)"
      @contextmenu.prevent="handleChooseOpenCharacter(index)"
      :class="{
        tag: true,
        'open-tag': index === open,
        'active-tag': index === activeCharacterIndex,
      }"
      :style="CharacterTagstyle(index)"
    >
      <header @click.stop="characterNameClick(index)" v-if="index !== open">
        {{ character.data.name }}
      </header>

      <div class="main">
        <img v-if="index === open" :src="character.portraitSrc" />

        <equipment-window
          v-if="index !== open"
          :character="character"
          :handsOnly="true"
        />

        <stat-bars v-if="index !== open" :character="character" />
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import EquipmentWindow from "./EquipmentWindow.vue";
import StatBars from "./StatBars.vue";
import { Character } from "@/rpg-classes/Character";
import { toRaw } from "@vue/reactivity";
import { Game } from "@/game-classes/Game";

interface styleObject {
  backgroundColor: string;
}

@Options({
  props: {
    open: Number,
  },
  components: { EquipmentWindow, StatBars },
  emits: ["chooseOpen"],
})
export default class CharacterTags extends Vue {
  $store!: typeof gameStore;
  open!: number;
  declare $refs: { canvas: HTMLCanvasElement };

  handleChooseOpenCharacter(index: number): void {
    this.$emit("chooseOpen", index);
  }

  characterNameClick(index: number): void {
    this.$store
      .dispatch("setActiveCharacter", index)
      .then
      // feedback => {console.log(feedback)}
      ();
  }

  get characters(): Character[] {
    this.$store.getters.timestamp;
    return toRaw(this.$store.state.game.data.characters);
  }

  get activeCharacterIndex(): number | undefined {
    this.$store.getters.timestamp;
    return this.$store.state.game.data.activeCharacterIndex;
  }

  CharacterTagstyle(index: number): styleObject {
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

  .tag {
    flex-basis: 25%;
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    header {
      text-align: center;
      color: black;
      align-self: stretch;
      cursor: pointer;
    }

    .main {
      display: flex;
      justify-content: center;
      flex: 1;
      align-items: center;

      img {
        width: auto;
        height: 90%;
      }
    }
  }

  .active-tag {
    header {
      font-weight: 700;
    }
  }
}
</style>
