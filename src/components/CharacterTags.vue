<template>
  <article :timeStamp="timeStamp.toString()">
    <section
      v-for="(character, index) in characters"
      :key="index"
      @click="handleChooseOpenCharacter(index)"
      @contextmenu.prevent="handleChooseOpenCharacter(index)"
      :class="{
        tag: true,
        'open-tag': index === open,
        'active-tag': index === active,
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

        <stat-bars
          v-if="index !== open"
          :character="character"
        />

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
import { useStore } from "vuex";

interface styleObject {
  backgroundColor: string;
}

@Options({
  props: {
    open: Number,
  },
  components: { EquipmentWindow , StatBars},
  emits: ["chooseOpen"],
})
export default class CharacterTags extends Vue {
  $store!: typeof gameStore;
  open!: number;
  active!: number | undefined;
  declare $refs: { canvas: HTMLCanvasElement };

  data(): { active: number | undefined } {
    const store = useStore() as typeof gameStore;
    return {
      active: store.state.game.data.activeCharacterIndex,
    };
  }

  handleChooseOpenCharacter(index: number): void {
    this.$emit("chooseOpen", index);
  }

  characterNameClick(index: number): void {
    this.$store.dispatch("setActiveCharacter", index).then(
      // feedback => {console.log(feedback)}
    );
  }

  get timeStamp(): number {
    const store = useStore() as typeof gameStore;
    return store.state.timestamp;
  }

  get characters(): Character[] {
    return toRaw(this.$store.state.game.data.characters);
  }

  updated(): void {
    const store = useStore() as typeof gameStore;
    this.active = store.state.game.data.activeCharacterIndex;
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
