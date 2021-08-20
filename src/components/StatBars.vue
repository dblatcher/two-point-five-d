<template>
  <section>
    <figure class="bar" v-for="(stat, index) in statSet" :key="index">
      <div>
        <span :style="{ height: `${(100 * stat.current) / stat.max}%` }"></span>
      </div>
    </figure>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import { Character } from "@/rpg-classes/Character";
import { PointBar } from "@/rpg-classes/CharacterStats";

@Options({
  components: {},
  props: {
    character: Character,
  },
})
export default class StatBars extends Vue {
  $store!: typeof gameStore;
  character!: Character;

  get health(): PointBar {
    return this.character.data.stats.health;
  }
  get stamina(): PointBar {
    return this.character.data.stats.stamina;
  }
  get mana(): PointBar {
    return this.character.data.stats.mana;
  }

  get statSet(): PointBar[] {
    this.$store.getters.timestamp;
    const { health, stamina, mana } = this.character.data.stats;
    return [health, stamina, mana];
  }
}
</script>

<style scoped lang="scss">
section {
  display: flex;
  justify-content: space-around;
  width: 4rem;
}

.bar {
  margin: 0;

  div {
    position: relative;
    width: 0.5rem;
    height: 3rem;
    background-color: white;
    box-sizing: border-box;
    padding: 0;
  }
  span {
    position: absolute;
    box-sizing: border-box;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: black;
    padding: 0;
    margin: 0;
  }
}
</style>