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
    <key-watcher @keydown="handleKey" />
  </nav>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import KeyWatcher from "./KeyWatcher.vue";
import store from "@/store";

@Options({
  components: {
    KeyWatcher,
  },
})
export default class Controls extends Vue {
  $store!: typeof store;

  handleKey(key: string): void {
    switch (key) {
      case "w":
      case "ArrowUp":
        return this.move("FORWARD");
      case "s":
      case "ArrowDown":
        return this.move("BACK");
      case "a":
        return this.move("LEFT");
      case "d":
        return this.move("RIGHT");
      case "q":
      case "ArrowLeft":
        return this.turn("LEFT");
      case "e":
      case "ArrowRight":
        return this.turn("RIGHT");
    }
  }

  move(direction: string): void {
    this.$store.dispatch("sendPlayerMovement", {
      action: "MOVE",
      direction: direction,
    });
  }
  turn(direction: string): void {
    this.$store.dispatch("sendPlayerMovement", {
      action: "TURN",
      direction: direction,
    });
  }
}
</script>

<style scoped lang="scss">
nav {
  display: block;
  margin: 0;

  div {
    display: flex;
    justify-content: center;
  }
}

button {
  font-size: 3rem;
  width: 3.5rem;
  height: 4.25rem;
}
</style>