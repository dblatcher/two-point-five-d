import { toRaw } from 'vue'
import { createStore } from 'vuex'

import { spriteSheets } from '@/instances/sprites'
import { game } from '@/instances/game'
import { Item } from '@/game-classes/Item'


export default createStore({
  state: {
    game,
    timestamp: Date.now(),
    spriteSheets,
    timer: 0,
  },
  getters: {
    gameIsPaused: state => state.timer == 0
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
    inventoryClick({ state }, clickInfo:{item: Item, index:number}) {
      if (!this.getters.gameIsPaused) {
        toRaw(state.game).handleInventoryClick(toRaw(clickInfo.item), clickInfo.index)
      }
    },

    equipSlotClick({ state }, clickInfo:{slotName:string}) {
      if (!this.getters.gameIsPaused) {
        return toRaw(state.game).handleEquipSlotClick(clickInfo)
      }
    },

    selfClick({state}, clickInfo:{buttonName:string}) {
      if (!this.getters.gameIsPaused) {
        return toRaw(state.game).handleSelfClick(toRaw(clickInfo))
      }
    },

    tick({ state, commit }) {
      toRaw(state.game).tick();
      commit('updateTimestamp');
    },
    startTimer({ state, dispatch }) {
      if (state.timer !== 0) { return }
      state.timer = setInterval(() => { dispatch('tick') }, 200)
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
