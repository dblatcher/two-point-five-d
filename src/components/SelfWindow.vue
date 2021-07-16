<template>
  <section @mouseleave="clearOutput()">
    <h2>self</h2>

    <div class="control-icon" @click="doSelfClick('LOOK')">
      <figure>
        <figcaption>examine</figcaption>
      </figure>
    </div>

    <div class="control-icon" @click="doSelfClick('CONSUME')">
      <figure>
        <figcaption>consume</figcaption>
      </figure>
    </div>

    <div class="output-box">
      <span v-if="feedback.message" class="description">{{
        feedback.message
      }}</span>

      <table v-if="feedback.propertyList">
        <tbody>
          <tr v-for="(item, index) in feedback.propertyList" :key="index">
            <th>{{ item[0] }}</th>
            <td>{{ item[1] }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import InventorySlot from "./InventorySlot.vue";

import gameStore from "@/store";
import { Item } from "@/game-classes/Item";
import { FeedbackToUI } from "@/game-classes/Game";

interface SelfWindowData {
  feedback: FeedbackToUI;
}

@Options({
  components: {
    InventorySlot,
  },
})
export default class SelfWindow extends Vue {
  $store!: typeof gameStore;
  feedback!: FeedbackToUI;

  data(): SelfWindowData {
    return {
      feedback: FeedbackToUI.empty,
    };
  }

  doSelfClick(verb: string): void {
    this.$store
      .dispatch("selfClick", { buttonName: verb })
      .then((feedback: FeedbackToUI) => {
        this.feedback = feedback;
      });
  }

  clearOutput(): void {
    this.feedback = FeedbackToUI.empty;
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
      margin: 0;
    }
  }
}
</style>