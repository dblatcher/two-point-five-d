<template>
  <div class="message-container">
    
    <article
      v-for="(message, index) in messages"
      v-bind:key="index"
      v-bind:style="makeArticleStyle(message)"
    >
      <figure>
        <img
          v-if="message.data.character"
          :src="message.data.character.portraitSrc"
        />
      </figure>

      <span>{{ message.data.content }}</span>
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

  makeArticleStyle(message: NarrativeMessage): { 'background-color': string; 'border-color': string; } {
    return {
      'background-color': message.data.color.opacityAt(.25).css,
      'border-color': message.data.color.css,
    };
  }
}
</script>

<style lang="scss" scoped>

.message-container {
  border-top: 1px dashed gray;
  margin-top: .5rem;
  padding: .25rem;
}

article {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border: .1rem solid black;
  border-radius: .4rem;
  margin-bottom: .3rem;

  span {
    color:black;
  }

  figure {
    margin: 0 1rem 0 0;
    padding: .1rem;
    height: 2rem;

    img {
      height: 100%;
      box-sizing: border-box;
      width: auto;
      border-radius: .4rem;
    }
  }
}
</style>