<template>
  <section @mouseleave="clearOutput()">
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
import ItemSlot from "./ItemSlot.vue";

import gameStore from "@/store";
import { Item } from "@/game-classes/Item";
import { FeedbackToUI } from "@/game-classes/Game";
import { Character } from "@/rpg-classes/Character";

interface SelfWindowData {
  feedback: FeedbackToUI;
}

@Options({
  components: {
    ItemSlot,
  },
  props: {
    character: Character,
  },
})
export default class SelfWindow extends Vue {
  $store!: typeof gameStore;
  feedback!: FeedbackToUI;
  character!: Character;

  data(): SelfWindowData {
    return {
      feedback: FeedbackToUI.empty,
    };
  }

  doSelfClick(verb: string): void {
    this.$store
      .dispatch("selfClick", { buttonName: verb, character:this.character })
      .then((feedback: FeedbackToUI) => {
        this.feedback = feedback;
      });
  }

  clearOutput(): void {
    this.feedback = FeedbackToUI.empty;
  }

}
</script>

<style scoped lang="scss">
section {
  display: flex;
  flex-direction: column;
  padding: .25rem;

  .control-icon {
    border: 1px solid black;
  }

  .output-box {
    min-height: 5rem;
    background-color: white;

    p {
      margin: 0;
    }
  }
}
</style>