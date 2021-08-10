<template>
  <div>
    
    <article v-for="(message, index) in messages" v-bind:key="index">
      <span v-bind:style="makeSpanStyle(message)">{{message.data.content}}</span>
    </article>

  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import gameStore from "@/store";
import { NarrativeMessage } from "@/game-classes/NarrativeMessage";



export default class MessageBox extends Vue {
  $store!: typeof gameStore;

  get messages(): NarrativeMessage[] {
    this.$store.getters.timestamp;
    const allMessages = this.$store.getters.narrativeMessages;
    return allMessages.slice(-4);
  }

  makeSpanStyle(message:NarrativeMessage): { color: string; } {
    return {
      "color": message.data.color.css,
    }
  }

}
</script>

<style lang="scss" scoped>
</style>