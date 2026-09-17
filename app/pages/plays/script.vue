<script setup lang="ts">
/**
 * /plays/script — the opening script: the first eight plays of every game,
 * in order, with the snap count.
 *
 * Lives under /plays (no nav tab of its own; the Playbook tab stays lit) and
 * is reached from the hot card on /plays and the home page. The rows are the
 * spoken calls, straight from the play data, and each opens its play page.
 *
 * "Test yourself" hides the calls and counts behind the slot numbers so a kid
 * can run the list in his head and tap to check. Plain refs, nothing stored —
 * HANDOFF §6: nothing about a kid is ever saved.
 */
import { NuxtLink } from '#components'
import { CADENCE, HUT_INDEXES } from '~/data/script'
import { resolveScript } from '~/composables/useScriptDeck'

useHead({ title: 'Opening Script — Wolves Playbook' })

const slots = resolveScript()
const onTwoCount = slots.filter((s) => s.count === 2).length

/** Cadence words with the Hut ordinal ("1st", "2nd") the counts refer to. */
const cadence = CADENCE.map((word, i) => {
  const hut = HUT_INDEXES.indexOf(i)
  return { word, hut: hut === -1 ? null : hut + 1 }
})

const testMode = ref(false)
const revealed = ref<Set<number>>(new Set())

const isHidden = (n: number) => testMode.value && !revealed.value.has(n)

function toggleTest() {
  testMode.value = !testMode.value
  revealed.value = new Set()
}
function reveal(n: number) {
  revealed.value = new Set([...revealed.value, n])
}
function revealAll() {
  revealed.value = new Set(slots.map((s) => s.n))
}
function hideAll() {
  revealed.value = new Set()
}
const allRevealed = computed(() => slots.every((s) => revealed.value.has(s.n)))
</script>

<template>
  <div class="script">
    <header class="page-head">
      <NuxtLink to="/plays" class="back muted">
        <Icon name="lucide:chevron-left" aria-hidden="true" /> Plays
      </NuxtLink>
      <p class="eyebrow">Game day</p>
      <h1>Opening Script</h1>
      <p class="muted lead">
        The first {{ slots.length }} plays of every game, in order. Know the call and the count.
      </p>
    </header>

    <section class="card cadence" aria-labelledby="cadence-title">
      <p id="cadence-title" class="eyebrow">Cadence</p>
      <p class="cadence-words" aria-label="Set, Down, Set, Hut, Hut">
        <span v-for="(c, i) in cadence" :key="i" class="cadence-word" :class="{ hut: c.hut }">
          <span class="word">{{ c.word }}</span>
          <span v-if="c.hut" class="hut-tag" :class="`hut-${c.hut}`">
            {{ c.hut === 1 ? 'on one' : 'on two' }}
          </span>
        </span>
      </p>
      <p class="rule">
        Every play is <strong>on one</strong> — the ball snaps on the first Hut — unless the call
        says <strong class="two">on two</strong>. On two, the ball snaps on the second HUT.
      </p>
      <p class="warn">
        <strong>DO NOT JUMP.</strong> On two is our chance to see the blitz and keep the defense
        from jumping our cadence.
      </p>
      <p class="huddle muted">
        <Icon name="lucide:lock" aria-hidden="true" />
        Know the count in the huddle. Never ask at the line — it gives it away.
      </p>
    </section>

    <div class="toolbar">
      <button
        type="button"
        class="toggle"
        :class="{ on: testMode }"
        :aria-pressed="testMode"
        @click="toggleTest"
      >
        <Icon :name="testMode ? 'lucide:eye-off' : 'lucide:eye'" aria-hidden="true" />
        Test yourself
      </button>
      <button v-if="testMode" type="button" class="toggle ghost" @click="allRevealed ? hideAll() : revealAll()">
        {{ allRevealed ? 'Hide all' : 'Reveal all' }}
      </button>
      <span v-else class="toolbar-note muted">
        {{ onTwoCount }} of {{ slots.length }} go on two
      </span>
    </div>

    <ol class="slots" :aria-label="testMode ? 'Opening script, calls hidden' : 'Opening script'">
      <li v-for="s in slots" :key="s.n">
        <component
          :is="isHidden(s.n) ? 'button' : NuxtLink"
          :to="isHidden(s.n) ? undefined : `/plays/${s.playId}`"
          :type="isHidden(s.n) ? 'button' : undefined"
          class="card row"
          :class="{ 'on-two': s.count === 2 && !isHidden(s.n), hidden: isHidden(s.n) }"
          :aria-label="isHidden(s.n) ? `Play ${s.n} — tap to reveal` : undefined"
          @click="isHidden(s.n) && reveal(s.n)"
        >
          <span class="num" aria-hidden="true">{{ s.n }}</span>
          <span class="body">
            <template v-if="!isHidden(s.n)">
              <span class="call">{{ s.label }}</span>
              <span v-if="s.count === 2" class="badge">On two</span>
            </template>
            <span v-else class="tap-hint muted">
              <Icon name="lucide:pointer" aria-hidden="true" /> Tap to reveal
            </span>
          </span>
          <Icon v-if="!isHidden(s.n)" name="lucide:chevron-right" class="chev" aria-hidden="true" />
        </component>
      </li>
    </ol>

    <NuxtLink to="/quiz/flashcards" class="card drill">
      <span class="drill-icon"><Icon name="lucide:layers" aria-hidden="true" /></span>
      <span class="drill-text">
        <span class="drill-title">Drill it</span>
        <span class="drill-sub muted">First 8 flashcards — number to call, call to number, and the count.</span>
      </span>
      <Icon name="lucide:chevron-right" class="chev" aria-hidden="true" />
    </NuxtLink>
  </div>
</template>

<style scoped>
.script {
  display: grid;
  gap: 18px;
  max-width: 720px;
  margin: 0 auto;
}

/* ---------- head (house pattern, see quiz/learning.vue) ---------- */
.page-head {
  display: grid;
  gap: 6px;
}
.page-head h1 {
  font-size: 2.2rem;
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  width: fit-content;
  margin-bottom: 6px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.back:hover {
  color: var(--chalk);
}
.lead {
  font-size: 0.95rem;
  max-width: 48ch;
}

/* ---------- cadence card ---------- */
.cadence {
  display: grid;
  gap: 12px;
  padding: 14px 16px 16px;
}
.cadence-words {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4px 8px;
}
.cadence-word {
  display: grid;
  justify-items: center;
  gap: 2px;
}
.cadence-word .word {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--chalk-dim);
}
.cadence-word.hut .word {
  color: var(--chalk);
}
/* The dots between the words — said with a beat between each. */
.cadence-word:not(:last-child) .word::after {
  content: '…';
  color: var(--steel);
  margin-left: 2px;
}
.hut-tag {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.64rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  padding: 1px 7px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--panel-raised);
  color: var(--steel);
  white-space: nowrap;
}
.hut-tag.hut-2 {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}
.rule {
  font-size: 0.95rem;
  color: var(--chalk-dim);
  max-width: 56ch;
}
.rule strong {
  color: var(--chalk);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.rule strong.two {
  color: var(--red);
}
.warn {
  padding: 10px 14px;
  border-radius: var(--r-ctl);
  background: color-mix(in srgb, var(--red-deep) 14%, var(--panel));
  border: 1px solid color-mix(in srgb, var(--red) 35%, var(--line));
  border-left: 3px solid var(--red);
  font-size: 0.95rem;
  color: var(--chalk-dim);
}
.warn strong {
  display: block;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.45rem;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--red);
  margin-bottom: 2px;
}
.huddle {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}
.huddle .iconify {
  color: var(--red);
  flex: none;
}

/* ---------- test-yourself toolbar ---------- */
.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
.toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  min-height: 44px;
  padding: 8px 16px;
  border-radius: var(--r-ctl);
  border: 1px solid color-mix(in srgb, var(--red) 50%, transparent);
  background: var(--panel-raised);
  color: var(--red);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition:
    background var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease),
    border-color var(--t-fast) var(--ease);
}
.toggle:hover,
.toggle.on {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}
.toggle.ghost {
  border-color: var(--line);
  color: var(--chalk);
  background: transparent;
}
.toggle.ghost:hover {
  border-color: var(--steel);
  background: var(--panel-raised);
  color: #fff;
}
.toolbar-note {
  font-size: 0.85rem;
  font-family: var(--font-display);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ---------- the eight rows ---------- */
.slots {
  display: grid;
  gap: 8px;
}
.row {
  width: 100%;
  display: grid;
  grid-template-columns: 52px 1fr auto;
  align-items: center;
  gap: 12px;
  min-height: 68px;
  padding: 10px 12px 10px 14px;
  text-align: left;
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
a.row:hover {
  border-color: var(--steel);
  background: var(--panel-raised);
}
.num {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 1;
  color: var(--steel);
  font-variant-numeric: tabular-nums;
  text-align: center;
}
.body {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  min-width: 0;
}
.call {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.45rem;
  line-height: 1.1;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--chalk);
}
.chev {
  color: var(--steel);
  flex: none;
}

/* On two: the row is unmistakable from across the huddle. */
.row.on-two {
  background: color-mix(in srgb, var(--red-deep) 14%, var(--panel));
  border-color: color-mix(in srgb, var(--red) 35%, var(--line));
  border-left: 3px solid var(--red);
  padding-left: 12px;
}
.row.on-two .num {
  color: var(--red);
}
a.row.on-two:hover {
  border-color: var(--red);
}
.badge {
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  line-height: 1.2;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  white-space: nowrap;
}

/* Test mode: number only, dashed frame, tap to reveal. */
.row.hidden {
  border-style: dashed;
  background: transparent;
  cursor: pointer;
}
.row.hidden:hover {
  border-color: var(--steel);
  background: var(--panel);
}
.row.hidden .num {
  color: var(--chalk);
}
.tap-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

/* ---------- drill link ---------- */
.drill {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.drill:hover {
  border-color: var(--red);
  background: var(--panel-raised);
}
.drill-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  flex: none;
  border-radius: var(--r-ctl);
  background: var(--red-glow);
  color: var(--red);
  font-size: 20px;
}
.drill-text {
  display: grid;
  gap: 1px;
  min-width: 0;
}
.drill-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.drill-sub {
  font-size: 0.9rem;
}
.drill .chev {
  margin-left: auto;
}

@media (min-width: 420px) {
  .cadence-word .word {
    font-size: 1.7rem;
  }
  .cadence-words {
    gap: 4px 14px;
  }
  .hut-tag {
    font-size: 0.7rem;
  }
}
@media (min-width: 640px) {
  .cadence-word .word {
    font-size: 2rem;
  }
  .call {
    font-size: 1.6rem;
  }
  .num {
    font-size: 2.6rem;
  }
}
</style>
