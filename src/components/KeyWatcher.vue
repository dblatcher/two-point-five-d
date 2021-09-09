<template>
  <span></span>
</template>

<script lang="ts">
import { Vue, Options } from "vue-class-component";

interface ReportFunc {
  (event: KeyboardEvent): void;
}

interface KeyWatcherData {
  reportFunction: ReportFunc;
}

@Options({
  emits: {
    keydown: String,
    keyup: String,
  },
})
export default class GameHolder extends Vue {
  declare reportFunction: ReportFunc;

  data(): KeyWatcherData {
    return {
      reportFunction: (event: KeyboardEvent) => {
        this.processEvent(event);
      },
    };
  }

  mounted(): void {
    document.body.addEventListener("keydown", this.reportFunction);
    document.body.addEventListener("keyup", this.reportFunction);
  }

  beforeUnmount(): void {
    document.body.removeEventListener("keydown", this.reportFunction);
    document.body.removeEventListener("keyup", this.reportFunction);
  }

  processEvent(event: KeyboardEvent): void {
    // console.log( event.type, `{{${event.key}}}`);
    switch (event.type) {
        case 'keyup':
            this.$emit('keyup', event.key)
            break;
        case 'keydown':
            this.$emit('keydown', event.key)
            break;
    }
  }
}
</script>

<style lang="scss" scoped>
span {
  visibility: hidden;
}
</style>