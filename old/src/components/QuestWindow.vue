<template>
  <div class="frame" v-if="show">
    <button class="close-button" @click="$emit('close')">close</button>
    <article>
      <h2>Quests</h2>

      <details
        v-for="quest in activeQuests"
        :key="quest.data.id"
        class="content"
      >
        <summary>{{ quest.data.title }} ( {{countFinishedGoals(quest)}} / {{quest.data.goals.length}})</summary>
        {{ quest.data.description }}
        <ul>
          <li v-for="(goal, index) in quest.data.goals" :key="index" :class="{'done': checkGoalFinished(goal)}">
              {{goal.data.narrative}}
          </li>
        </ul>
      </details>
    </article>
  </div>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";
import gameStore from "@/store";
import { Quest, QuestGoal } from "@/rpg-classes/Quest";

@Options({
  components: {},
  props: {
    show: Boolean,
  },
  emits: ["close"],
})
export default class QuestWindow extends Vue {
  $store!: typeof gameStore;

  get activeQuests(): Quest[] {
    this.$store.getters.timestamp;
    const { quests: allQuests = [] } = this.$store.state.game.data;
    return allQuests.filter((quest) => quest.data.state === "TAKEN");
  }

  checkGoalFinished(goal:QuestGoal): boolean {
    return goal.testComplete(this.$store.state.game)
  }

  countFinishedGoals(quest:Quest):number {
    return quest.data.goals.filter(goal => this.checkGoalFinished(goal)).length
  }
}
</script>

<style lang="scss" scoped>
.frame {
  position: absolute;
  margin: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9;
  background-color: rgba($color: #000000, $alpha: 0.75);
  box-sizing: border-box;

  .close-button {
    position: absolute;
    right: 0;
    top: 0;
    margin: 0.5rem;
  }

  article {
    color: antiquewhite;
    padding: 1rem;
    box-sizing: border-box;
  }

  details {
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: 0.5em 0.5em 0;
    width: 100%;
    box-sizing: border-box;
    text-align: left;

    summary {
      color: aqua;
    }

    ul {
      padding-inline-start: 20px;
      margin: 0;
    }

    li {
      list-style-type: '\2610';
        padding-inline-start: 10px;

      &::marker{
        color: aqua;
        font-size: 150%;
        font-weight: bold;
        display: inline-block;
      }
    }

    li.done {
      list-style-type: '\2611';
    }
  }

  summary {
    font-weight: bold;
    margin: -0.5em -0.5em 0;
    padding: 0.5em;
    cursor: pointer;
  }

  details[open] {
    padding: 0.5em;
  }

  details[open] summary {
    border-bottom: 1px solid #aaa;
    margin-bottom: 0.5em;
  }
}
</style>