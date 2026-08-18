<script setup lang="ts">
/**
 * /defense — our defensive fronts and where each kid lines up.
 * Placeholder until the fronts are drawn up.
 */
useHead({ title: 'Defense — Wolves Playbook' })
</script>

<template>
  <div class="defense">
    <header class="page-head">
      <p class="eyebrow">Stop them cold</p>
      <h1>Defense</h1>
      <p class="muted lead">Our fronts, and where you line up in each one.</p>
    </header>

    <ComingSoon
      icon="lucide:shield"
      :planned="['Every defensive formation we run', 'Where you line up in each front']"
    />
  </div>
</template>

<style scoped>
.page-head {
  margin-bottom: 18px;
}
.page-head h1 {
  font-size: 2.4rem;
  margin: 2px 0 6px;
}
.lead {
  max-width: 44ch;
}
</style>
