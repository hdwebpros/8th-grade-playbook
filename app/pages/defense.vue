<script setup lang="ts">
/**
 * /defense — the defensive playbook: gaps & alignment numbers, our three
 * fronts (Stack / Oklahoma / Indiana), the run-fit base rules, and Red,
 * our Cover 3 zone.
 */
useHead({ title: 'Defense — Wolves Playbook' })

type FrontKey = 'stack' | 'oklahoma' | 'indiana'

const front = ref<FrontKey>('stack')
const frontOptions: { value: FrontKey; label: string }[] = [
  { value: 'stack', label: 'Stack' },
  { value: 'oklahoma', label: 'Oklahoma' },
  { value: 'indiana', label: 'Indiana' },
]

const frontInfo: Record<
  FrontKey,
  { tag: string; blurb: string; rows: { who: string; at: string; gap: string }[] }
> = {
  stack: {
    tag: 'Head up',
    blurb: 'Everybody head up. Tackles sit right on the guards, backers stacked behind.',
    rows: [
      { who: 'Ends', at: '5 technique', gap: 'C gap' },
      { who: 'Tackle & Nose', at: '2 technique — head up on the guards', gap: 'A gap' },
      { who: 'Mike & Will', at: '30 — stacked at linebacker depth', gap: 'B gap' },
    ],
  },
  oklahoma: {
    tag: 'Outside',
    blurb: 'Tackles kick to the outside shoulder of the guards; backers take the inside.',
    rows: [
      { who: 'Ends', at: '5 technique', gap: 'C gap' },
      { who: 'Tackle & Nose', at: '3 technique — outside shoulder of the guards', gap: 'B gap' },
      { who: 'Mike & Will', at: '30 — linebacker depth', gap: 'A gap' },
    ],
  },
  indiana: {
    tag: 'Inside',
    blurb: 'Tackles pinch to the inside shoulder of the guards; backers take the outside.',
    rows: [
      { who: 'Ends', at: '5 technique', gap: 'C gap' },
      { who: 'Tackle & Nose', at: '2i — inside shoulder of the guards', gap: 'A gap' },
      { who: 'Mike & Will', at: '30 — linebacker depth', gap: 'B gap' },
    ],
  },
}

/** Run fit base rules. "Play to me" = ball coming at you. "Play away" = ball going the other way. */
const runFits: { call: string; meaning: string; rules: { who: string; job: string }[] }[] = [
  {
    call: 'Play to me',
    meaning: 'The ball is coming at your side.',
    rules: [
      { who: 'D-Line', job: 'Gap control — spill it.' },
      { who: 'Linebackers', job: 'Fill your gap.' },
      { who: 'Alleys', job: 'Force.' },
      { who: 'Free Safety', job: 'Fill the alley.' },
      { who: 'Corners', job: 'Secondary force.' },
    ],
  },
  {
    call: 'Play away',
    meaning: 'The ball is going away from you.',
    rules: [
      { who: 'D-Line', job: 'Stay square to the line and run the rope.' },
      { who: 'Linebackers', job: 'Scrape & fill.' },
      { who: 'Alleys', job: 'Slow fold.' },
      { who: 'Free Safety', job: 'Fill the alley.' },
      { who: 'Corners', job: 'Pursuit.' },
    ],
  },
]

/** Red (Cover 3) — every coverage job, position by position. */
type RedPos = 'cb' | 'fs' | 'alley' | 'lb'
const redActive = ref<RedPos | null>(null)
/* Hover only for a real mouse — on touch, hover events fire on tap and
 * would cancel out the tap-to-toggle. */
const redHoverIn = (e: PointerEvent, k: RedPos) => {
  if (e.pointerType === 'mouse') redActive.value = k
}
const redHoverOut = (e: PointerEvent) => {
  if (e.pointerType === 'mouse') redActive.value = null
}

const redJobs: { k: RedPos; who: string; zone: string; detail: string }[] = [
  {
    k: 'lb',
    who: 'Linebackers',
    zone: 'Hook-Curl',
    detail: 'Get to the hole of #2, working for depth. Feel 2, see 1.',
  },
  {
    k: 'alley',
    who: 'Alleys',
    zone: 'Seam-Curl-Flat',
    detail:
      'Eyes to the QB. Work for depth and disrupt the vertical threat, sit under the curl, then rally to the flat. Read the QB’s shoulder.',
  },
  {
    k: 'fs',
    who: 'Free Safety',
    zone: 'Deep 1/3',
    detail:
      'Three read steps for depth, reading the QB and the pattern. Cheat to the passing strength — numbers or field.',
  },
  {
    k: 'cb',
    who: 'Cornerbacks',
    zone: 'Deep 1/3',
    detail:
      'Three read steps for depth, eyes inside to the QB while feeling the pressure of #1.',
  },
]

const qbNotes = [
  'His front shoulder is a pointer — it aims where the ball is going.',
  'His off hand releases off the ball? Get your eyes to your WR.',
  'On a 3-step drop, the ball gets high on step #2.',
  'Watch the WR splits.',
]

const teamNotes = [
  'COMMUNICATION — talk before every snap.',
  'Alleys and linebackers: be physical.',
  'Don’t cover grass. Look for work.',
]
</script>

<template>
  <div class="defense">
    <header class="page-head">
      <p class="eyebrow">Stop them cold</p>
      <h1>Defense</h1>
      <p class="muted lead">
        Know your gap, know your fit, know your zone — then run to the ball.
      </p>
    </header>

    <section class="unit">
      <h2>Gaps &amp; Alignment</h2>
      <p class="muted unit-lead">
        Gaps get letters, counting out from the ball: A, B, C, D. Alignments get
        numbers — even means head up on a blocker, odd means his outside
        shoulder, an <em>i</em> means his inside shoulder.
      </p>
      <DefenseGapsDiagram />
    </section>

    <SectionDivider />

    <section class="unit">
      <h2>Our Fronts</h2>
      <p class="muted unit-lead">
        Same four down linemen and two backers every time — the call just slides
        the tackles and flips which gaps the backers own.
      </p>
      <SegmentedControl v-model="front" :options="frontOptions" label="Defensive front" />
      <DefenseFrontDiagram :front="front" />
      <div class="front-card">
        <div class="front-head">
          <span class="front-tag">{{ frontInfo[front].tag }}</span>
          <p class="muted front-blurb">{{ frontInfo[front].blurb }}</p>
        </div>
        <ul class="rule-list">
          <li v-for="r in frontInfo[front].rows" :key="r.who">
            <span class="rule-who">{{ r.who }}</span>
            <span class="rule-job">{{ r.at }} · <strong>{{ r.gap }}</strong></span>
          </li>
        </ul>
      </div>
    </section>

    <SectionDivider />

    <section class="unit">
      <p class="unit-tag">Run defense</p>
      <h2>Run Fits</h2>
      <p class="muted unit-lead">
        Two calls cover every run. Ask one question at the snap: is the ball
        coming <strong>to me</strong> or going <strong>away</strong>?
      </p>
      <div class="fit-grid">
        <article v-for="fit in runFits" :key="fit.call" class="fit-card">
          <h3 class="fit-call">“{{ fit.call }}”</h3>
          <p class="muted fit-meaning">{{ fit.meaning }}</p>
          <ul class="rule-list">
            <li v-for="r in fit.rules" :key="r.who">
              <span class="rule-who">{{ r.who }}</span>
              <span class="rule-job">{{ r.job }}</span>
            </li>
          </ul>
        </article>
      </div>
    </section>

    <SectionDivider />

    <section class="unit">
      <p class="unit-tag">Pass coverage</p>
      <h2>Red — Cover 3</h2>
      <p class="muted unit-lead">
        Our pass-coverage defense. Easy to remember: <strong>Red</strong> has
        three letters — Red is Cover <strong>3</strong>. Three deep thirds
        over the top, four zones underneath, four rushers. Tap a player or a
        zone to light up their job.
      </p>
      <RedCoverageDiagram v-model:active="redActive" />
      <ul class="job-list">
        <li
          v-for="j in redJobs"
          :key="j.who"
          class="job"
          :class="{ 'job--hot': redActive === j.k, 'job--dim': redActive !== null && redActive !== j.k }"
          @pointerenter="redHoverIn($event, j.k)"
          @pointerleave="redHoverOut"
          @click="redActive = redActive === j.k ? null : j.k"
        >
          <div class="job-head">
            <span class="rule-who">{{ j.who }}</span>
            <span class="job-zone">{{ j.zone }}</span>
          </div>
          <p class="muted job-detail">{{ j.detail }}</p>
        </li>
      </ul>
    </section>

    <SectionDivider />

    <section class="unit">
      <h2>Coaching Points</h2>
      <div class="notes-grid">
        <CoachNote title="Reading the QB" :notes="qbNotes" />
        <CoachNote title="Play like Wolves" :notes="teamNotes" />
      </div>
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
  justify-items: start;
}
.unit > * {
  justify-self: stretch;
}
.unit > .seg {
  justify-self: start;
}
.unit h2 {
  font-size: 1.5rem;
  margin: 0;
}
.unit-tag {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: var(--red);
  margin: 0 0 -10px;
}
.unit-lead {
  max-width: 52ch;
  margin-top: -8px;
}

.front-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  padding: 12px 14px;
  display: grid;
  gap: 10px;
}
.front-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
  flex-wrap: wrap;
}
.front-tag {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--red);
}
.front-blurb {
  margin: 0;
  font-size: 0.95rem;
}

.rule-list {
  display: grid;
  gap: 6px;
}
.rule-list li {
  display: grid;
  grid-template-columns: 108px 1fr;
  gap: 10px;
  align-items: baseline;
  font-size: 0.95rem;
}
.rule-who {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--chalk-dim);
}
.rule-job {
  color: var(--chalk);
}

.fit-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.fit-card {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  padding: 12px 14px;
}
.fit-call {
  font-size: 1.15rem;
  margin: 0 0 2px;
  color: var(--red);
}
.fit-meaning {
  margin: 0 0 10px;
  font-size: 0.9rem;
}

.job-list {
  display: grid;
  gap: 10px;
}
.job {
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  padding: 10px 14px;
  cursor: pointer;
  transition: border-color 0.15s ease, opacity 0.15s ease;
}
.job--hot {
  border-color: var(--red);
}
.job--hot .rule-who {
  color: var(--chalk);
}
.job--dim {
  opacity: 0.55;
}
.job-head {
  display: flex;
  align-items: baseline;
  gap: 10px;
}
.job-zone {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--red);
}
.job-detail {
  margin: 4px 0 0;
  font-size: 0.95rem;
}

.notes-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
</style>
