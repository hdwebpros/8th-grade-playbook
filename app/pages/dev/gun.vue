<script setup lang="ts">
/**
 * Dev sandbox — the Gun variation drawn by FormationDiagram's `moves` prop.
 * Ghost at the old spot, dashed shift into the new one. Not linked from nav.
 */
import { ref } from 'vue'
import { useRoute } from '#app'
import type { OffPosId } from '~/types/football'
import {
  black,
  blackGun,
  gunMoves,
  red,
  redGun,
  splitWide,
  splitWideGun,
} from '~/data'

const sets = [
  { base: red, gun: redGun, moves: gunMoves(red) },
  { base: black, gun: blackGun, moves: gunMoves(black) },
  { base: splitWide, gun: splitWideGun, moves: gunMoves(splitWide) },
]

/* ?pos=S&theme=print so a headless screenshot can reach both states. */
const route = useRoute()
const pick = ref<OffPosId | null>((route.query.pos as OffPosId) ?? null)
const theme = ref<'app' | 'print'>(route.query.theme === 'print' ? 'print' : 'app')
</script>

<template>
  <main class="wrap">
    <h1>Gun — diagram sandbox</h1>
    <p class="hint">
      Tap a player to test the highlight/dim rule. Highlight:
      <strong>{{ pick ?? 'none' }}</strong>
    </p>
    <button class="btn" @click="theme = theme === 'app' ? 'print' : 'app'">
      Theme: {{ theme }}
    </button>

    <section v-for="s in sets" :key="s.gun.name" class="card">
      <h2>{{ s.gun.name }} — {{ s.moves.length }} moved</h2>
      <FormationDiagram
        :formation="s.gun"
        :moves="s.moves"
        :highlight="pick"
        :theme="theme"
        interactive
        @select="(p) => (pick = p)"
      />
      <h3>{{ s.base.name }} (base, no moves — regression check)</h3>
      <FormationDiagram :formation="s.base" :theme="theme" />
    </section>
  </main>
</template>

<style scoped>
.wrap {
  padding: 1rem;
  max-width: 44rem;
  margin: 0 auto;
}
.card {
  margin: 1.5rem 0;
}
.hint {
  opacity: 0.7;
}
.btn {
  margin-bottom: 1rem;
}
</style>
