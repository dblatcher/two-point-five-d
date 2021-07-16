<template>
  <section>
    <h2>self</h2>

    <div class="control-icon" @click="lookAt()" @mouseleave="clearOutput()">
      <figure >
        <figcaption>examine</figcaption>
      </figure>
    </div>

    <div class="control-icon" @click="consume()">
      <figure >
        <figcaption>consume</figcaption>
      </figure>
    </div>

    <div class="output-box">
      <span class="description">{{ descriptionText }}</span>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import InventorySlot from "./InventorySlot.vue";

import gameStore from "@/store";
import { Item } from "@/game-classes/Item";
import { toRaw } from "vue";


interface SelfWindowData {
  descriptionText: string
}


@Options({
  components: {
    InventorySlot,
  },
})
export default class SelfWindow extends Vue {
  $store!: typeof gameStore;
  descriptionText!: string;

  data():SelfWindowData {
    return {
      descriptionText: "??"
    }
  }


  lookAt():void {
    const itemInHand = toRaw(this.$store.state.game.data.itemInHand);
    if (!itemInHand) {
      return this.clearOutput();
    }
    console.log(itemInHand.data.type.propertyList)
    this.descriptionText = `This is a ${itemInHand.data.type.name}.`
  }

  consume():void {
    this.$store.dispatch('selfClick',{buttonName:'CONSUME'})
  }

  clearOutput():void {
    this.descriptionText = "???"
  }

  handleInventoryClick(item: Item, index: number): void {
    this.$store.dispatch("inventoryClick", { item, index });
  }
}
</script>

<style scoped lang="scss">
section {
  border: 3px dotted dodgerblue;
  display: inline-block;
  padding: 1rem;

  h2 {
    margin: 0;
  }

  .control-icon {
    border: 1px solid black;
  }

  .output-box {

    width: 8em;
    min-height: 5rem;
    background-color: aquamarine;

    p {
      margin:0;
    }
  }
}
</style>