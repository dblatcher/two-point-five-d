<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>static: {{ staticTest }}</p>
    <p>store: {{ $store.state.test }}</p>
    <button @click="testMethod()">click</button>
    <button @click="() => {$store.commit('turnLeft');}"
    >
      left
    </button>
    <button @click="turnRight()">right</button>
    <map-canvas
      caption="Map"
      v-bind:timestamp="$store.state.timestamp"
    />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import store from "@/store";
import MapCanvas from "./MapCanvas.vue";

interface MyTestComponentData {
  staticTest: string;
}

@Options({
  props: {
    msg: String,
  },
  components: {
    MapCanvas,
  },
})
export default class MyTestComponent extends Vue {
  msg!: string;
  $store!: typeof store;

  data(): MyTestComponentData {
    return {
      staticTest: "static test",
    };
  }

  testMethod(): void {
    const now = new Date();
    this.$store.commit(
      "changeTestValue",
      `pupper did a click at ${now.getHours()}.${now.getMinutes()}:${now.getSeconds()}`
    );
  }

  turnRight(): void {
    this.$store.commit("turnRight");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
