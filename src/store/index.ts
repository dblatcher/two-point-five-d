import { createStore } from 'vuex'
import { level, playerVantage } from './levels'
import { spriteSheets } from './sprites'


export default createStore({
  state: {
    test: "pupper should click the button",
    playerVantage: playerVantage,
    level: level,
    timestamp: Date.now(),
    spriteSheets,
  },
  mutations: {
    changeTestValue(state, n) {
      console.log('changeTestValue committed', n)
      state.test = n.toString()
    },
    updateTimestamp(state) {
      state.timestamp = Date.now()
      // console.log('timestamp', state.timestamp)
    },
    movePlayer(state, payload: { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }) {
      switch (payload.action) {
        case "MOVE":
          state.playerVantage.move(payload.direction, state)
          break;
        case "TURN":
          state.playerVantage.turn(payload.direction)
          break;
      }
    },
  },
  actions: {
    movePlayer({ state, commit }, payload: { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }) {

      commit('movePlayer', payload);
      commit('updateTimestamp');

    },
    tick({ state, commit }) {
      commit('updateTimestamp');

    },
    startTimer({ dispatch }) {
      setInterval(() => { dispatch('tick') }, 250)
    }
  },
  modules: {
  }
})
