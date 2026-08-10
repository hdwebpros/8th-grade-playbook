<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const notFound = computed(() => props.error.statusCode === 404)
</script>

<template>
  <div class="err">
    <img src="/brand/wolves-mark.png" alt="" class="err-mark" width="200" height="134" />
    <p class="eyebrow">{{ error.statusCode }}</p>
    <h1 class="err-title">{{ notFound ? 'Busted play' : 'False start' }}</h1>
    <p class="muted err-sub">
      {{
        notFound
          ? "That page isn't in the playbook."
          : 'Something went wrong. Huddle up and try again.'
      }}
    </p>
    <button type="button" class="err-cta" @click="clearError({ redirect: '/' })">
      Back to the huddle
    </button>
  </div>
</template>

<style scoped>
.err {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  padding: 24px;
  background: var(--ink);
}
.err-mark {
  width: 180px;
  height: auto;
  opacity: 0.9;
}
.err-title {
  font-size: 2.6rem;
}
.err-sub {
  font-size: 1rem;
}
.err-cta {
  margin-top: 10px;
  padding: 12px 26px;
  background: var(--red);
  color: #fff;
  border-radius: var(--r-ctl);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition: background var(--t-fast) var(--ease);
}
.err-cta:hover {
  background: var(--red-deep);
}
</style>
