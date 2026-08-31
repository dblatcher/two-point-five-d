import { markRaw, toRaw } from 'vue'
import { createStore } from 'vuex'
import { Item } from '@/game-classes/Item'
import { Character } from '@/rpg-classes/Character'
import { FeedbackToUI } from '@/game-classes/Game'
import { AttackOption } from '@/rpg-classes/AttackOption'

import { game, spriteSheets } from '@/travels-in-generica'
// import { game, spriteSheets } from '@/duck-puzzle'
// import { game, spriteSheets } from '@/test-world'

export default createStore({
  state: {
    game: markRaw(game),
    timestamp: Date.now(),
    spriteSheets,
    timer: 0,
  },
  getters: {
    gameIsPaused: state => state.timer == 0,
    intersitial: state => state.game.data.intersitial || null,
    tickCount: state => state.game.tickCount,
    timestamp: state => state.timestamp,
    narrativeMessages: state => state.game.narrativeMessages
  },
  mutations: {
    updateTimestamp(state) {
      state.timestamp = Date.now()
    },
  },
  actions: {
    sendPlayerMovement({ state }, movement: { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }) {
      if (!this.getters.gameIsPaused) {
        toRaw(state.game).queuePlayerMovementAction(movement)
      }
    },
    sightClick({ state }, clickInfo: { x: number, y: number }) {
      if (!this.getters.gameIsPaused) {
        toRaw(state.game).handleSightClick(clickInfo)
      }
    },
    inventoryClick({ state }, clickInfo: { item: Item, index: number, character: Character }) {
      if (!this.getters.gameIsPaused) {
        toRaw(state.game).handleInventoryClick(toRaw(clickInfo))
      }
    },

    equipSlotClick({ state }, clickInfo: { slotName: string, character: Character }) {
      if (!this.getters.gameIsPaused) {
        return toRaw(state.game).handleEquipSlotClick(clickInfo)
      }
    },

    attackButtonClick({state}, clickInfo:{ character: Character, option:AttackOption }):FeedbackToUI {
      if (!this.getters.gameIsPaused) {
        return toRaw(state.game).handleAttackButton(toRaw(clickInfo))
      }
      return FeedbackToUI.empty
    },

    selfClick({ state }, clickInfo: { buttonName: string, character: Character }):FeedbackToUI {
      if (!this.getters.gameIsPaused) {
        return toRaw(state.game).handleSelfClick(toRaw(clickInfo))
      }
      return FeedbackToUI.empty
    },

    setActiveCharacter({ state }, characterIndex: number): FeedbackToUI {
      if (!this.getters.gameIsPaused) {
        return state.game.setActiveCharacter(characterIndex)
      }
      return FeedbackToUI.empty
    },

    interstitialOptionClick({ state }, intersitialOptionIndex: number): FeedbackToUI {
      return state.game.handleInterstitialOptionClick(intersitialOptionIndex);
    },

    tick({ state, commit }) {
      toRaw(state.game).tick();
      commit('updateTimestamp');
    },
    startTimer({ state, dispatch }) {
      if (state.timer !== 0) { return }
      state.timer = setInterval(() => { dispatch('tick') }, 100)
    },
    stopTimer({ state }) {
      if (state.timer == 0) { return }
      clearInterval(state.timer);
      state.timer = 0;
    },
  },
  modules: {
  }
})
