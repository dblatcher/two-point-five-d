import { createStore } from 'vuex'
import { spriteSheets } from './sprites'

import { game } from './game'


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
        state.game.queuePlayerAction(movement)
      }
    },
    sightClick({ state }, clickInfo: { x: number, y: number }) {
      state.game.handleSightClick(clickInfo)
    },
    tick({ state, commit }) {
      state.game.tick();
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
