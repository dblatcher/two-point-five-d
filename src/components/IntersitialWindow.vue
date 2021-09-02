<template>
  <div class="frame" v-if="intersitial">
    <article>
      <p class="content">{{ intersitial.data.content }}</p>
      <div class="options" >
        <button @click="dispatchOptionClick(index)" v-for="(option, index) in intersitial.data.options" :key="index">
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

export default class IntersitialWindow extends Vue {
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
  z-index: 10;
}

article {
  background-color: rgba($color: #000000, $alpha: 0.75);
  color: antiquewhite;
  padding: 1rem;
  box-sizing: border-box;

  .content {
    max-width: 20rem;
  }

  .options {
    display: flex;
    justify-content: space-around;
  }
}
</style>