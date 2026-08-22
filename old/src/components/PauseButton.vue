<template>
  <nav>
    <div>
      <button @click="togglePaused()">{{$store.getters.gameIsPaused ? '&#9654;' : '&#9208;'}}</button>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import store from "@/store";

export default class PauseButton extends Vue {
  $store!: typeof store;

  togglePaused():void {
    if (this.$store.getters.gameIsPaused) {
      this.$store.dispatch("startTimer");
    } else {
      this.$store.dispatch("stopTimer");
    }
  }
}
</script>

<style scoped>
nav {
  display: inline-block;
  margin: 0;
  height: 2.6rem;
}

button {
  font-size: 2rem;
}
</style>