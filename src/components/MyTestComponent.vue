<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <map-canvas
      caption="Map"
    />
    <controls/>
    <sight-canvas
      caption="view"
    />

  <sprite-loader/>
    
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import MapCanvas from "./MapCanvas.vue";
import SightCanvas from "./SightCanvas.vue";
import Controls from "./Controls.vue";
import SpriteLoader from "./SpriteLoader.vue";

interface MyTestComponentData {
  staticTest: string;
}

@Options({
  props: {
    msg: String,
  },
  components: {
    MapCanvas, Controls, SightCanvas, SpriteLoader
  },
})
export default class MyTestComponent extends Vue {
  msg!: string;
  $store!: typeof gameStore;

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

  mounted() {
    console.log('APP MOUNTED, starting timer')
    this.$store.dispatch("startTimer")
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
