<script setup lang="ts">
/**
 * /special-teams — kickoff and kick return alignments.
 * Placeholder until the units are drawn up.
 */
useHead({ title: 'Special Teams — Wolves Playbook' })
</script>

<template>
  <div class="special-teams">
    <header class="page-head">
      <p class="eyebrow">Kick it off</p>
      <h1>Special Teams</h1>
      <p class="muted lead">Kickoff and kick return: where you stand and where you go.</p>
    </header>

    <ComingSoon
      icon="wolves:goalpost"
      :planned="['Kickoff Center', 'Return Center']"
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
