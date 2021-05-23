import { createStore } from 'vuex'
import { floor, position } from './floors'



export default createStore({
  state: {
    test: "pupper should click the button",
    vantage: position,
    floor: floor,
    timestamp: Date.now(),
  },
  mutations: {
    changeTestValue(state, n) {
      console.log('changeTestValue committed', n)
      state.test = n.toString()
    },
    turnRight(state) {
      state.vantage.data.direction = state.vantage.data.direction.rightOf
      state.timestamp = Date.now()
    },
    turnLeft(state) {
      state.vantage.data.direction = state.vantage.data.direction.leftOf
      state.timestamp = Date.now()
    }
  },
  actions: {
  },
  modules: {
  }
})
