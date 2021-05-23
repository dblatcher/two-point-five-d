import { createStore } from 'vuex'

export default createStore({
  state: {
    test: "pupper should click the button"
  },
  mutations: {
    changeTestValue(state, n) {
      console.log('changeTestValue committed', n)
      state.test = n.toString()
    }
  },
  actions: {
  },
  modules: {
  }
})
