<script setup lang="ts">
/**
 * Split Wide draft sandbox — /dev/split-wide
 *
 * Imports the draft data directly (app/data/split-wide-formation.ts and
 * app/data/plays/split-wide.ts) so the four made-up plays can be eyeballed
 * against all three fronts before any of them are merged into app/data/index.ts.
 */
import { ref } from 'vue'
import type { FrontId, OffPosId } from '~/types/football'
import { fronts } from '~/data/fronts'
import { splitWide } from '~/data/split-wide-formation'
import { splitWidePlays } from '~/data/plays/split-wide'
import PlayDiagram from '~/components/diagram/PlayDiagram.vue'

const frontIds: FrontId[] = ['44', '43', '52']
const selected = ref<OffPosId | null>(null)
</script>

<template>
  <div class="sandbox">
    <header>
      <h1>Split Wide — DRAFT</h1>
      <p>
        Four made-up plays, three fronts each. Nothing here is approved football. Formation:
        {{ splitWide.name }} — {{ splitWide.description }}
      </p>
    </header>

    <section v-for="play in splitWidePlays" :key="play.id">
      <h2>{{ play.name }} <span class="id">{{ play.id }}</span></h2>
      <p class="hint">{{ play.description }}</p>
      <div class="grid">
        <figure v-for="f in frontIds" :key="f">
          <figcaption>vs {{ fronts[f].name }}</figcaption>
          <div class="stage">
            <PlayDiagram
              :play="play"
              :front="f"
              :formation="splitWide"
              :fronts="fronts"
              :highlight="selected"
              interactive
              @select="(pos) => (selected = pos)"
            />
          </div>
        </figure>
      </div>
    </section>
  </div>
</template>

<style scoped>
.sandbox {
  max-width: 90rem;
  margin: 0 auto;
  padding: 2rem 1rem 6rem;
  font-family: system-ui, sans-serif;
  color: #e8eaed;
  background: #0b0d10;
}
h1 {
  font-size: 1.6rem;
  margin: 0 0 0.4rem;
}
h2 {
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #e8eaed;
  margin: 0 0 0.4rem;
}
.id {
  color: #8a939e;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.8rem;
}
section {
  margin-top: 2.5rem;
}
p {
  color: #b9c0c8;
  line-height: 1.5;
  font-size: 0.9rem;
}
.hint {
  margin: 0 0 0.75rem;
}
.grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(3, 1fr);
}
figure {
  margin: 0;
}
figcaption {
  font-size: 0.8rem;
  color: #8a939e;
  margin-bottom: 0.35rem;
}
.stage {
  background: #10141a;
  border: 1px solid #232a33;
  border-radius: 10px;
  overflow: hidden;
}
</style>
