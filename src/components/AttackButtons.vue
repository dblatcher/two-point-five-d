<template>
  <nav v-bind:class="{ 'not-paused': !$store.getters.gameIsPaused }">
    <section class="character-buttons" v-show="!characterSelected">
      <button
        class="button"
        v-for="(character, index) in characters"
        v-bind:key="index"
        :style="getButtonStyleObject(index)"
        @click="handleCharacterClick(index)"
      >
        <item-slot
          v-show="!getFeedback(index).time"
          :imgIcon="'/img/hand-right.png'"
          :item="getEquipment(character)"
          :size="4"
          :noBorder="true"
          :grayScale="true"
        />

        <span class="feedback" v-show="getFeedback(index).time"
          >{{ getFeedback(index).message }}</span
        >
      </button>
    </section>
    <section class="option-buttons" v-if="characterSelected">
      <button
        class="button button--list button--cancel"
        :style="getButtonStyleObject(selectedIndex)"
        @click="handleCancelClick()"
      >
        &times;
      </button>
      <button
        class="button button--list"
        v-for="(option, index) in attackOptions"
        v-bind:key="index"
        :style="getButtonStyleObject(selectedIndex)"
        @click="handleOptionClick(index)"
      >
        {{ option.data.name }}
      </button>
    </section>
  </nav>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import ItemSlot from "./ItemSlot.vue";

import store from "@/store";
import { Character } from "@/rpg-classes/Character";
import { toRaw } from "vue";
import { FeedbackToUI, Game } from "@/game-classes/Game";
import { Item } from "@/game-classes/Item";
import { AttackOption } from "@/rpg-classes/AttackOption";
import { Color } from "@/canvas/Color";

interface ButtonStyleObject {
  backgroundColor: string;
}

@Options({
  components: {
    ItemSlot,
  },
})
export default class AttackButtons extends Vue {
  $store!: typeof store;
  selectedIndex!: number | undefined;
  feedbackMessages!: Map<number, string>;
  feedbackFadeTick!: Map<number, number>;

  data(): {
    selectedIndex: number | undefined;
    feedbackMessages: Map<number, string>;
    feedbackFadeTick: Map<number, number>;
  } {
    return {
      selectedIndex: undefined,
      feedbackMessages: new Map<number, string>(),
      feedbackFadeTick: new Map<number, number>(),
    };
  }

  handleCharacterClick(characterIndex: number): void {
    if (this.$store.getters.gameIsPaused) {
      return;
    }
    const character = this.characters[characterIndex];

    if (character?.attackCooldown > 0 || !character.canAct) {
      return;
    }

    this.selectedIndex = characterIndex;
  }

  handleCancelClick(): void {
    this.selectedIndex = undefined;
  }

  handleOptionClick(index: number): void {
    if (this.$store.getters.gameIsPaused) {
      return;
    }

    const character = toRaw(this.characterSelected);
    const option = toRaw(this.attackOptions[index]);
    const characterIndex = toRaw(this.characters).indexOf(
      character as Character
    );

    this.$store
      .dispatch("attackButtonClick", { option, character })
      .then((feedback:FeedbackToUI) => {
        console.log(feedback);
        // to do - display damage amount.

        const damageProp = feedback.propertyList?.find(item => item[0]="damage")

        const text = damageProp ? damageProp[1].toString() : "miss"

        this.feedbackMessages.set(characterIndex, text);
        this.feedbackFadeTick.set(
          characterIndex,
          this.$store.getters.tickCount + 10
        );
      });

    this.selectedIndex = undefined;
  }

  getEquipment(character: Character): Item | null {
    this.$store.getters.timestamp;
    return toRaw(character.data.equipmentSlots?.get("RIGHT_HAND")) || null;
  }

  getFeedback(characterIndex: number): { message: string; time: number } {
    const currentTickCount = this.$store.getters.tickCount;
    const messageFadesAt = this.feedbackFadeTick.get(characterIndex);
    let time = 0;

    if (typeof messageFadesAt == "number") {
      if (messageFadesAt < currentTickCount) {
        this.feedbackFadeTick.delete(characterIndex);
      } else {
        time = messageFadesAt - currentTickCount;
      }
    }

    return {
      message: this.feedbackMessages.get(characterIndex) || "",
      time,
    };
  }

  get characterSelected(): Character | null {
    if (typeof this.selectedIndex == "number") {
      return this.characters[this.selectedIndex] || null;
    }

    return null;
  }

  get characters(): Character[] {
    this.$store.getters.timestamp;
    return toRaw(this.$store.state.game.data.characters);
  }

  get attackOptions(): AttackOption[] {
    return this.characterSelected?.attackOptions || [];
  }

  getButtonStyleObject(characterIndex: number): ButtonStyleObject {
    const character = this.characters[characterIndex];
    if (character?.attackCooldown > 0 || !character.canAct) {
      return {
        backgroundColor: Color.GRAY.css,
      };
    }

    return {
      backgroundColor: Game.CHARACTER_COLORS[characterIndex].lighter(30).css,
    };
  }
}
</script>

<style scoped lang="scss">
nav {
  height: 8rem;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
  position: relative;
  display: flex;

  .character-buttons {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: stretch;
  }

  .option-buttons {
    flex: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  }

  .button {
    flex-basis: 25%;
    transition: filter 0.5s, color 0.5s;
    padding: 0;

    &--list {
      flex-basis: 1.75rem;
    }

    &--cancel {
      color: white;
      font-size: 125%;
    }

    .feedback {
      display: inline-block;
      padding: .5rem;
      color: red;
      background-color: black;
      border-radius: .8rem;
      border: .2rem dotted red;
      font-size: 120%;
    }
  }

  &.not-paused {
    .button:hover {
      filter: brightness(0.8);
      color: whitesmoke;
    }
  }
}
</style>