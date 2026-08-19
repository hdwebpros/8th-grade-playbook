<script setup lang="ts">
/**
 * /special-teams — kickoff and kick return: the traced alignments
 * plus the coaching points for each unit.
 */
useHead({ title: 'Special Teams — Wolves Playbook' })

const kickoffNotes = [
  'Contain Safeties: jog — nobody gets outside of you. If the returner breaks free, you make the tackle.',
  'Attackers: run fast and avoid blocks in your lane.',
  'Find the ball and adjust your path to it.',
  'Net: tackle.',
]

const returnNotes = [
  'Every player watches to make sure the ball goes past him. If it doesn’t go past you, go get the BALL — it’s live.',
  'You’re assigned a number. Run back 10–15 yards and block that player out.',
  'Returners: if you don’t get the ball, lead block up the middle.',
  'If you have the ball, hit the middle hard.',
]
</script>

<template>
  <div class="special-teams">
    <header class="page-head">
      <p class="eyebrow">Kick it off</p>
      <h1>Special Teams</h1>
      <p class="muted lead">Kickoff and kick return: where you stand and where you go.</p>
    </header>

    <section class="unit">
      <h2>Kickoff</h2>
      <p class="muted unit-lead">
        Two contain safeties keep everything funneled inside. Everyone else
        sprints his lane to the ball.
      </p>
      <KickoffDiagram />
      <CoachNote :notes="kickoffNotes" />
    </section>

    <section class="unit">
      <h2>Kick Return</h2>
      <p class="muted unit-lead">
        Let the kick go past you, find your number, and wall him off — the
        return hits the middle.
      </p>
      <KickReturnDiagram />
      <CoachNote :notes="returnNotes" />
    </section>
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
.unit {
  display: grid;
  gap: 14px;
  margin-bottom: 34px;
}
.unit h2 {
  font-size: 1.5rem;
  margin: 0;
}
.unit-lead {
  max-width: 52ch;
  margin-top: -8px;
}
</style>
