<template>
  <nav>
    <div>
      <button @click="turn('LEFT')">&#8624;</button>
      <button @click="move('FORWARD')">&uarr;</button>
      <button @click="turn('RIGHT')">&#8625;</button>
    </div>
    <div>
      <button @click="move('LEFT')">&larr;</button>
      <button @click="move('BACK')">&darr;</button>
      <button @click="move('RIGHT')">&rarr;</button>
    </div>
  </nav>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import store from "@/store";

export default class Controls extends Vue {
  $store!: typeof store;

  move(direction: string):void {
    this.$store.dispatch("sendPlayerMovement", { action: "MOVE", direction: direction });
  }
  turn(direction: string):void {
    this.$store.dispatch("sendPlayerMovement", { action: "TURN", direction: direction });
  }
}
</script>

<style scoped>
nav {
  display: inline-block;
  padding: 1rem;
  border: 3px dotted dodgerblue;
}

button {
  font-size: 3rem;
  width: 3.5rem;
  height: 4.25rem;
}
</style>