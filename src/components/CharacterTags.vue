<template>
  <article>
    <section
      v-for="(character, index) in characters"
      :key="index"
      @click="characterButtonClick(index)"
      :class="{ 
        'tag': true,
        'active-tag': index === active 
      }"
      :style="CharacterTagstyle(index)"
    >
      <header>
        {{ character.data.name }}
      </header>

      <div>
        <img v-if="index === active" :src="character.portraitSrc" />

        <equipment-window
          v-if="index !== active"
          :character="character"
          :handsOnly="true"
        />
      </div>
    </section>
  </article>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import EquipmentWindow from "./EquipmentWindow.vue";
import { Character } from "@/game-classes/Character";
import { toRaw } from "@vue/reactivity";
import { Game } from "@/game-classes/Game";

interface styleObject {
  backgroundColor: string;
}

@Options({
  props: {
    active: Number,
  },
  components: { EquipmentWindow },
  emits: ["choose"],
})
export default class CharacterTags extends Vue {
  $store!: typeof gameStore;
  active!: number;
  declare $refs: { canvas: HTMLCanvasElement };

  characterButtonClick(index: number): void {
    this.$emit("choose", index);
  }

  get characters(): Character[] {
    return toRaw(this.$store.state.game.data.characters);
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
    }

    div {
      display: flex;
      justify-content: center;
      flex: 1;

      img {
        width: 3rem;
        height: 3rem;
      }
    }

  }
}
</style>
