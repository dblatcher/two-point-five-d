<template>
  <GameHolder/>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import GameHolder from './components/GameHolder.vue';

@Options({
  components: {
    GameHolder,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
