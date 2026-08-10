<script setup lang="ts">
/** Dev sandbox for the Stretch and Waggle transcriptions. Not part of the book. */
import { stretchRed, stretchBlack } from '~/data/plays/stretch'
import { waggleRed, waggleBlack } from '~/data/plays/waggle'
import { formations } from '~/data/formations'
import { fronts } from '~/data/fronts'
import type { FrontId, Play } from '~/types/football'

const plays: Play[] = [stretchRed, stretchBlack, waggleRed, waggleBlack]
const frontIds: FrontId[] = ['44', '43', '52']
</script>

<template>
  <div style="padding: 16px">
    <div v-for="play in plays" :key="play.id">
      <h2>{{ play.name }} — {{ play.id }} ({{ play.direction }})</h2>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px">
        <div v-for="f in frontIds" :key="f">
          <h3>{{ f }}</h3>
          <PlayDiagram
            :play="play"
            :front="f"
            :formation="formations[play.formation]!"
            :fronts="fronts"
          />
        </div>
      </div>
    </div>
  </div>
</template>
