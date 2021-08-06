<template>
  <div class="frame" v-if="intersitial">
    <article>
      <p>{{ intersitial.data.content }}</p>
      <div v-for="(option, index) in intersitial.data.options" :key="index">
        <button @click="dispatchOptionClick(index)">
          {{ option.buttonText }}
        </button>
      </div>
    </article>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";

import { Intersitial } from "@/game-classes/Intersitial";

export default class GameHolder extends Vue {
  $store!: typeof gameStore;

  get intersitial(): Intersitial | null {
    this.$store.getters.timestamp;
    return this.$store.getters.intersitial;
  }

  dispatchOptionClick(optionIndex: number): void {
    if (!this.intersitial) {
      return;
    }

    this.$store.dispatch('interstitialOptionClick', optionIndex)
  }
}
</script>

<style lang="scss" scoped>
.frame {
  position: absolute;
  margin: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

article {
  background-color: aquamarine;
}
</style>