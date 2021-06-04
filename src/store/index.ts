import { createStore } from 'vuex'
import { spriteSheets } from './sprites'

import { game } from './game'


export default createStore({
  state: {
    game,
    timestamp: Date.now(),
    spriteSheets,
  },
  mutations: {
    updateTimestamp(state) {
      state.timestamp = Date.now()
    },
  },
  actions: {
    movePlayer({ state }, payload: { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }) {
      state.game.movePlayer(payload)
    },
    tick({ state, commit }) {
      state.game.tick();
      commit('updateTimestamp');
    },
    startTimer({ dispatch }) {
      setInterval(() => { dispatch('tick') }, 250)
    }
  },
  modules: {
  }
})
