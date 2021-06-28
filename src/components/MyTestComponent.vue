<template>
  <div class="hello">
    <sight-canvas
      caption="view"
    />
    <map-canvas
      caption="Map"
    />
    <controls/>
    <inventory-window/>
    <pause-button/>
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
import PauseButton from "./PauseButton.vue";
import InventoryWindow from './InventoryWindow.vue';

interface MyTestComponentData {
  staticTest: string;
}

@Options({
  props: {
    msg: String,
  },
  components: {
    MapCanvas, Controls, SightCanvas, SpriteLoader, PauseButton, InventoryWindow
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

  mounted():void {
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
