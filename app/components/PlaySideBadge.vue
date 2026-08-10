<script setup lang="ts">
import type { PlaySide } from '~/utils/playbook'

defineProps<{ side: PlaySide }>()
</script>

<template>
  <span v-if="side" class="badge" :class="side">
    {{ side === 'playside' ? 'Playside' : 'Backside' }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 999px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  white-space: nowrap;
}
.playside {
  background: var(--red-glow);
  color: var(--red);
  border: 1px solid color-mix(in srgb, var(--red) 45%, transparent);
}
.backside {
  background: var(--panel-raised);
  color: var(--steel);
  border: 1px solid var(--line);
}
</style>
