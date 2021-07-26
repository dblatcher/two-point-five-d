<template>
  <aside v-if="character" :style="computedStyle">
      <p>{{character.data.name}}</p>
            <self-window :character="character" />
      <inventory-window :character="character" />
  </aside>
</template>

<script lang="ts">
import { Character } from "@/game-classes/Character";
import gameStore from "@/store";
import { Game } from "@/game-classes/Game";
import { Options, Vue } from "vue-class-component";
import InventoryWindow from "./InventoryWindow.vue";
import SelfWindow from "./SelfWindow.vue";


interface styleObject {
    backgroundColor:string
}

@Options({
  props: {
    character: Character,
    index:Number
  },
  components: {
    InventoryWindow,
    SelfWindow,
  },
})
export default class GameHolder extends Vue {
    character!: Character;
    index!: number;
    $store!: typeof gameStore;

    get backgroundColor():string {
        const colorIndex = this.index < Game.CHARACTER_COLORS.length ? this.index : 0;
        return Game.CHARACTER_COLORS[colorIndex].opacityAt(.7).css
    }

    get computedStyle():styleObject {
        return {
            backgroundColor: this.backgroundColor
        }
    }
}
</script>

<style lang="scss">

aside {
  position: fixed;
  bottom: 0;
  margin: 0;
  box-sizing: border-box;
  display: flex;
}

</style>