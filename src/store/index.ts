import { Floor } from '@/game-classes/Floor'
import { Vantage } from '@/game-classes/Vantage'
import { Wall } from '@/game-classes/Wall'
import { createStore } from 'vuex'



export default createStore({
  state: {
    test: "pupper should click the button",
    vantage: new Vantage({ x: 3, y: 3, direction: "SOUTH" }),
    floor: new Floor({
      height: 10, width: 15, walls: [
        new Wall({ x: 2, y: 2, place: 'NORTH' }),
        new Wall({ x: 2, y: 2, place: 'SOUTH' }),
        new Wall({ x: 5, y: 4, place: 'WEST' }),
        new Wall({ x: 8, y: 5, place: 'SOUTH' }),
        new Wall({ x: 8, y: 5, place: 'WEST' }),
        new Wall({ x: 8, y: 5, place: 'EAST' }),
      ]
    })
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
