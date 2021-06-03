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
    movePlayer(state, payload: { action: "TURN" | "MOVE", direction: "FORWARD" | "LEFT" | "RIGHT" | "BACK" }) {
      switch (payload.action) {
        case "MOVE":
          state.playerVantage.move(payload.direction, state)
          break;
        case "TURN":
          state.playerVantage.turn(payload.direction)
          break;
      }
      state.timestamp = Date.now()
    },
  },
  actions: {
  },
  modules: {
  }
})
