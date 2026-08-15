<script setup lang="ts">
/**
 * /audible — the numbered passing system as a thing you can operate.
 *
 * The calls varsity actually drew, plus Coach Ryan's own, are the "Examples"
 * buttons. "Call your own" hands the kid the same machines those came out of:
 * pick the FORMATION, the protection and the digits, and the diagram draws what
 * they mean. Two machines sit behind it — Red and Black take two or three
 * digits (app/data/plays/audible.ts), Split Wide takes four, one per receiver
 * (app/data/plays/audible-split-wide.ts) — and the formation picker is what
 * chooses between them. That is the practice loop: say a call, then check
 * yourself against the picture.
 */
import type { FrontId, OffPosId, Play } from '~/types/football'
import {
  LEAN_LABELS,
  PROTECTION_LABELS,
  audibleExamples,
  buildAudible,
  buildSplitWideAudible,
  callNameOf,
  formations,
  fronts,
  routes,
  splitWideCallName,
} from '~/data'
import type { AudibleCall, Lean, Protection, SplitWideCall } from '~/data'
import { FRONT_LABELS, FRONT_ORDER, callPartsFor } from '~/utils/playbook'

useHead({ title: 'Audible — Wolves Playbook' })

/* --- What we are looking at: one of the examples, or a call of your own --- */

type Source = { kind: 'example'; digits: string } | { kind: 'own' }

/** The three formations a call can be said out of. */
type PadFormation = 'red' | 'black' | 'split-wide'

const source = ref<Source>({ kind: 'example', digits: audibleExamples[0]!.digits })
const formation = ref<PadFormation>('red')
const front = ref<FrontId>('44')

const isSplitWide = computed(() => formation.value === 'split-wide')

/** Red and Black are a mirrored pair; everything that takes one wants this. */
const pairFormation = computed<'red' | 'black'>(() => (formation.value === 'black' ? 'black' : 'red'))

/**
 * The call being built on the "Call your own" pad — one per machine, because a
 * Red call and a Split Wide call are not the same shape. Whatever example you
 * were looking at is copied onto the matching one when you press the button, so
 * these initial values are only ever a fallback.
 */
const ownCall = ref<AudibleCall>({ protection: 'dropback', outside: 9, inside: 2 })
const ownSwCall = ref<SplitWideCall>({ lean: 'left', digits: [9, 5, 5, 9] })

/** Which example button is lit, if any. */
const activeDigits = computed(() => {
  const s = source.value
  return s.kind === 'example' ? s.digits : null
})

const example = computed(() =>
  activeDigits.value === null
    ? undefined
    : audibleExamples.find((e) => e.digits === activeDigits.value),
)

const play = computed<Play>(() => {
  const ex = example.value
  if (ex) return ex.playFor(pairFormation.value)
  return isSplitWide.value
    ? buildSplitWideAudible(ownSwCall.value)
    : buildAudible(ownCall.value, pairFormation.value)
})

/** The call as it is said in the huddle, for the current formation. */
const spokenCall = computed(() => {
  const ex = example.value
  if (ex) return ex.callNameFor(pairFormation.value)
  return isSplitWide.value
    ? splitWideCallName(ownSwCall.value)
    : callNameOf(ownCall.value, pairFormation.value)
})

/**
 * An example that lives in one formation — Split Wide Bull 95-59 — leaves the
 * header toggle nothing to switch, so it hides while that example is up.
 */
const locked = computed(() => example.value?.lockedFormation)

/** Whatever formation the play we are drawing actually sets. */
const formationInfo = computed(() => formations[play.value.formation]!)

/** The call word by word, so the stamp explains whatever the pad just built. */
const callParts = computed(() => callPartsFor(play.value, formationInfo.value))
const frontInfo = computed(() => fronts[front.value]!)
const frontOptions = FRONT_ORDER.map((f) => ({ value: f, label: FRONT_LABELS[f] }))

/* --- The "Call your own" pad --- */

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const routeName = (num: number) => routes.find((r) => r.num === num)?.name ?? `${num}`

const protectionOptions = computed<{ value: Protection; label: string }[]>(() => [
  { value: 'dropback', label: PROTECTION_LABELS.dropback[pairFormation.value] },
  { value: 'sprint', label: PROTECTION_LABELS.sprint[pairFormation.value] },
])

/**
 * The formation is the first thing you say, so it is the first row on the pad —
 * and it is also what picks the machine: Red and Black take two digits, Split
 * Wide takes four.
 */
const formationOptions: { value: PadFormation; label: string }[] = [
  { value: 'red', label: 'Red' },
  { value: 'black', label: 'Black' },
  { value: 'split-wide', label: 'Split Wide' },
]

/** Out of Split Wide the protection word only names which way the line leans. */
const leanOptions: { value: Lean; label: string }[] = [
  { value: 'right', label: `${LEAN_LABELS.right} — right` },
  { value: 'left', label: `${LEAN_LABELS.left} — left` },
]

/** The four Split Wide digits, in the order they are said: right to left. */
const swSlots = [
  { i: 0, ord: 'First digit', who: 'X — wide right' },
  { i: 1, ord: 'Second digit', who: 'R — right slot' },
  { i: 2, ord: 'Third digit', who: 'L — left slot' },
  { i: 3, ord: 'Fourth digit', who: 'Y — wide left' },
]

function setSwDigit(i: number, d: number) {
  const next = [...ownSwCall.value.digits] as SplitWideCall['digits']
  next[i] = d
  ownSwCall.value = { ...ownSwCall.value, digits: next }
}

/** In Red the man inside X is the right wing; in Black it is the left wing. */
const wingLabel = computed(() => (formation.value === 'red' ? 'R — right wing' : 'L — left wing'))

/** The wing away from the digits — the one the optional third digit buys. */
const backWingLabel = computed(() =>
  formation.value === 'red' ? 'L — left wing' : 'R — right wing',
)

/**
 * The third digit is optional: with two digits the backside wing has his
 * standing rule (a 2, speed out away), so "—" is a real choice and not an
 * empty state.
 */
function toggleBackside(d: number) {
  ownCall.value.backside = ownCall.value.backside === d ? undefined : d
}

function chooseExample(d: string) {
  // Keep the formation and the example agreeable: a Split Wide example drags
  // the picker to Split Wide, and a Red/Black example drags it back off.
  const ex = audibleExamples.find((e) => e.digits === d)
  if (ex?.lockedFormation === 'split-wide') formation.value = 'split-wide'
  else if (isSplitWide.value) formation.value = 'red'
  source.value = { kind: 'example', digits: d }
}

function callYourOwn() {
  // Carry the call you were just looking at onto the pad, so the first thing
  // you do is change a digit and watch what moves.
  const ex = example.value
  if (ex?.swCall) ownSwCall.value = { ...ex.swCall, digits: [...ex.swCall.digits] }
  else if (ex?.call) ownCall.value = { ...ex.call }
  source.value = { kind: 'own' }
}

/* --- Selection: diagram tap <-> assignment row --- */

const selected = ref<OffPosId | null>(null)
watch(() => play.value.id, () => (selected.value = null))

const panel = ref<{ revealRow: (pos: OffPosId) => void } | null>(null)

function onDiagramSelect(pos: OffPosId | null) {
  selected.value = pos
  if (pos) panel.value?.revealRow(pos)
}
</script>

<template>
  <div class="audible-page">
    <header class="head">
      <NuxtLink to="/plays" class="back">
        <Icon name="lucide:chevron-left" aria-hidden="true" /> Plays
      </NuxtLink>
      <div class="head-row">
        <div class="head-titles">
          <h1 class="title">Audible</h1>
          <PlayCallStamp :parts="callParts" />
        </div>

        <!-- Red and Black are a pair, so the header keeps its two-way toggle.
             Split Wide is not part of that pair — it is chosen on the pad. -->
        <nav v-if="!locked && !isSplitWide" class="dir-toggle" aria-label="Formation">
          <button
            type="button"
            class="dir-btn"
            :class="{ active: formation === 'red' }"
            :aria-pressed="formation === 'red'"
            @click="formation = 'red'"
          >
            Red
          </button>
          <button
            type="button"
            class="dir-btn"
            :class="{ active: formation === 'black' }"
            :aria-pressed="formation === 'black'"
            @click="formation = 'black'"
          >
            Black
          </button>
        </nav>
      </div>
    </header>

    <div class="stage-wrap">
      <section class="stage" aria-label="Play diagram">
        <div class="stage-bar">
          <SegmentedControl v-model="front" :options="frontOptions" label="Defensive front" />
          <span class="call-chip">{{ spokenCall }}</span>
        </div>
        <div class="diagram card">
          <PlayDiagram
            :play="play"
            :front="front"
            :formation="formationInfo"
            :fronts="fronts"
            :highlight="selected"
            :interactive="true"
            theme="app"
            @select="onDiagramSelect"
          />
        </div>
        <p class="hint muted">
          <Icon name="lucide:pointer" aria-hidden="true" />
          Tap a player to see his job &middot; vs {{ frontInfo.name }}
        </p>

        <!-- The caller sits directly under the picture: press a call, see it. -->
        <div class="caller">
          <fieldset class="examples">
            <legend>Examples</legend>
            <div class="example-row">
              <button
                v-for="ex in audibleExamples"
                :key="ex.digits"
                type="button"
                class="ex-btn"
                :class="{ active: activeDigits === ex.digits }"
                :aria-pressed="activeDigits === ex.digits"
                @click="chooseExample(ex.digits)"
              >
                <span class="ex-digits">{{ ex.digits }}</span>
                <span class="ex-call">{{ ex.callNameFor(formation) }}</span>
                <span class="ex-blurb muted">{{ ex.blurb }}</span>
              </button>
            </div>
          </fieldset>

          <button
            type="button"
            class="own-btn"
            :class="{ active: activeDigits === null }"
            :aria-pressed="activeDigits === null"
            @click="callYourOwn"
          >
            <Icon name="lucide:megaphone" aria-hidden="true" />
            Call your own
          </button>

          <div v-if="activeDigits === null" class="pad">
            <!-- The whole point of the pad: the words come first, and they
                 change under your thumb as you press the buttons below. -->
            <div class="say">
              <span class="say-label">Say it</span>
              <p class="say-phrase">{{ spokenCall }}</p>
            </div>

            <!-- The formation is the first word out of your mouth, so it is the
                 first row here — and it is what decides how many digits the
                 call has. -->
            <div class="pad-row">
              <span class="pad-label">
                Formation
                <em class="pad-route">
                  {{
                    isSplitWide
                      ? 'Four digits — one per receiver'
                      : 'Two digits, three if you buy the backside wing'
                  }}
                </em>
              </span>
              <SegmentedControl v-model="formation" :options="formationOptions" label="Formation" />
            </div>

            <template v-if="isSplitWide">
              <div class="pad-row">
                <span class="pad-label">
                  Protection
                  <em class="pad-route">
                    Block the man in front of you, lean
                    {{ ownSwCall.lean }} — same as Boot
                  </em>
                </span>
                <SegmentedControl
                  v-model="ownSwCall.lean"
                  :options="leanOptions"
                  label="Protection"
                />
              </div>

              <div v-for="slot in swSlots" :key="slot.i" class="pad-row">
                <span class="pad-label">
                  {{ slot.ord }} &middot; {{ slot.who }}
                  <em class="pad-route">{{ routeName(ownSwCall.digits[slot.i]!) }}</em>
                </span>
                <div class="digit-row" role="group" :aria-label="`${slot.ord} — ${slot.who}`">
                  <button
                    v-for="d in digits"
                    :key="`sw${slot.i}-${d}`"
                    type="button"
                    class="digit"
                    :class="{ active: ownSwCall.digits[slot.i] === d }"
                    :aria-pressed="ownSwCall.digits[slot.i] === d"
                    @click="setSwDigit(slot.i, d)"
                  >
                    {{ d }}
                  </button>
                </div>
              </div>

              <p class="pad-hint muted">
                <Icon name="lucide:route" aria-hidden="true" />
                Four receivers, four digits, said right to left across the formation.
                <NuxtLink to="/routes" class="pad-link">See the route tree</NuxtLink>
              </p>
            </template>

            <template v-else>
              <div class="pad-row">
                <span class="pad-label">Protection</span>
                <SegmentedControl
                  v-model="ownCall.protection"
                  :options="protectionOptions"
                  label="Protection"
                />
              </div>

              <div class="pad-row">
                <span class="pad-label">
                  First digit &middot; X — split end
                  <em class="pad-route">{{ routeName(ownCall.outside) }}</em>
                </span>
                <div class="digit-row" role="group" aria-label="First digit — split end">
                  <button
                    v-for="d in digits"
                    :key="`o${d}`"
                    type="button"
                    class="digit"
                    :class="{ active: ownCall.outside === d }"
                    :aria-pressed="ownCall.outside === d"
                    @click="ownCall.outside = d"
                  >
                    {{ d }}
                  </button>
                </div>
              </div>

              <div class="pad-row">
                <span class="pad-label">
                  Second digit &middot; {{ wingLabel }}
                  <em class="pad-route">{{ routeName(ownCall.inside) }}</em>
                </span>
                <div class="digit-row" role="group" aria-label="Second digit — wing">
                  <button
                    v-for="d in digits"
                    :key="`i${d}`"
                    type="button"
                    class="digit"
                    :class="{ active: ownCall.inside === d }"
                    :aria-pressed="ownCall.inside === d"
                    @click="ownCall.inside = d"
                  >
                    {{ d }}
                  </button>
                </div>
              </div>

              <div class="pad-row">
                <span class="pad-label">
                  Third digit &middot; {{ backWingLabel }}
                  <em class="pad-route">
                    {{
                      ownCall.backside === undefined
                        ? 'Not called — speed out away'
                        : routeName(ownCall.backside)
                    }}
                  </em>
                </span>
                <div class="digit-row" role="group" aria-label="Third digit — backside wing">
                  <button
                    type="button"
                    class="digit digit-none"
                    :class="{ active: ownCall.backside === undefined }"
                    :aria-pressed="ownCall.backside === undefined"
                    @click="ownCall.backside = undefined"
                  >
                    &mdash;
                  </button>
                  <button
                    v-for="d in digits"
                    :key="`b${d}`"
                    type="button"
                    class="digit"
                    :class="{ active: ownCall.backside === d }"
                    :aria-pressed="ownCall.backside === d"
                    @click="toggleBackside(d)"
                  >
                    {{ d }}
                  </button>
                </div>
              </div>

              <div class="pad-row">
                <span class="pad-label">
                  Tag
                  <em class="pad-route">
                    {{ ownCall.dash ? 'Super to the flat' : 'Super blocks' }}
                  </em>
                </span>
                <button
                  type="button"
                  class="tag-btn"
                  :class="{ active: ownCall.dash === true }"
                  :aria-pressed="ownCall.dash === true"
                  @click="ownCall.dash = !ownCall.dash"
                >
                  Dash
                </button>
              </div>

              <p class="pad-hint muted">
                <Icon name="lucide:route" aria-hidden="true" />
                Say the whole call out loud, then check the picture.
                <NuxtLink to="/routes" class="pad-link">See the route tree</NuxtLink>
              </p>
            </template>
          </div>

          <!-- The words that are not digits. Learn these and the rest is math. -->
          <fieldset class="terms">
            <legend>Terms to know</legend>
            <dl class="term-list">
              <div class="term">
                <dt>Dash</dt>
                <dd>
                  Super does not block — he releases to the flat on the split-end side, the
                  same side the digits are on. Say it after the protection:
                  <em>Red Ram Dash 33</em>. Costs you a blocker, buys you a target.
                </dd>
              </div>
              <div class="term">
                <dt>Ram &amp; Bull</dt>
                <dd>
                  The two dropback protections. <strong>Ram</strong> slides the line to the
                  RIGHT; <strong>Bull</strong> is the reverse — the same thing to the LEFT.
                  We slide toward the split end, so Red is Ram and Black is Bull.
                </dd>
              </div>
              <div class="term">
                <dt>Split Wide &middot; four digits</dt>
                <dd>
                  Out of Split Wide there are four men detached instead of two, so the call has
                  <strong>four</strong> digits and every receiver has one — nobody is a zero, nobody
                  has a standing rule. Said right to left across the formation:
                  <em>Split Wide Bull 95-59</em>. The protection word only names which way the line
                  leans, and the blocking is Boot's: block the man in front of you and drive
                  him that way.
                </dd>
              </div>
              <div class="term">
                <dt>The Y</dt>
                <dd>
                  Right now the digits belong to the split end and the two wings, and the
                  tight end blocks. We are exploring how to call the Y to a route in this
                  audible system — it may be the fourth number, awaiting confirmation.
                </dd>
              </div>
              <div class="term">
                <dt>Two digits</dt>
                <dd>
                  X gets the first, the wing inside him gets the second. The wing on the
                  other side has his standing rule: a <strong>2</strong>, speed out, the
                  opposite way.
                </dd>
              </div>
              <div class="term">
                <dt>Three digits</dt>
                <dd>
                  The third one belongs to that backside wing. He runs it instead of his
                  standing out.
                </dd>
              </div>
            </dl>
          </fieldset>
        </div>
      </section>

      <section class="panel" aria-label="Assignments">
        <p class="desc">{{ play.description }}</p>

        <AssignmentPanel
          ref="panel"
          :play="play"
          :front="front"
          :formation="formationInfo"
          :selected="selected"
          @select="selected = $event"
        />

        <CoachNote
          v-if="play.coachNotes?.length"
          title="Coach's notes"
          :notes="play.coachNotes"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>
.audible-page {
  display: grid;
  gap: 14px;
}

.head {
  display: grid;
  gap: 8px;
}
.back {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  color: var(--steel);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  width: fit-content;
  transition: color var(--t-fast) var(--ease);
}
.back:hover {
  color: var(--chalk);
}
.head-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}
.head-titles {
  display: grid;
  justify-items: start;
  gap: 10px;
}
.title {
  font-size: 2.4rem;
}
.subtitle {
  font-size: 0.95rem;
}

.dir-toggle {
  display: inline-flex;
  padding: 3px;
  gap: 3px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-ctl);
}
.dir-btn {
  padding: 7px 16px;
  min-height: 38px;
  display: inline-flex;
  align-items: center;
  border-radius: calc(var(--r-ctl) - 3px);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--steel);
  transition:
    color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.dir-btn:hover {
  color: var(--chalk);
}
.dir-btn.active {
  background: var(--red);
  color: #fff;
}

.stage-wrap {
  display: grid;
  gap: 16px;
}
.stage {
  display: grid;
  gap: 8px;
}
.stage-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 8px;
}
.call-chip {
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid color-mix(in srgb, var(--red) 60%, transparent);
  color: var(--red);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.diagram {
  overflow: hidden;
  background: var(--dg-field);
}
.hint {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
}

/* --- The caller, directly under the diagram --- */
.caller {
  display: grid;
  gap: 10px;
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  padding: 12px 14px 14px;
  background: var(--panel);
}
.examples {
  border: 0;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 8px;
}
.caller legend {
  padding: 0 6px;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--steel);
}

.example-row {
  display: grid;
  gap: 8px;
}
@media (min-width: 560px) {
  .example-row {
    grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
  }
}
.ex-btn {
  display: grid;
  gap: 2px;
  text-align: left;
  padding: 10px 12px;
  min-height: 44px;
  border-radius: var(--r-ctl);
  border: 1px solid var(--line);
  background: var(--panel-raised);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.ex-btn:hover {
  border-color: var(--steel);
}
.ex-btn.active {
  border-color: var(--red);
  background: color-mix(in srgb, var(--red) 14%, var(--panel-raised));
}
.ex-digits {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.1;
  color: var(--chalk);
}
.ex-btn.active .ex-digits {
  color: var(--red);
}
.ex-call {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--steel);
}
.ex-blurb {
  font-size: 0.85rem;
}

.own-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 44px;
  padding: 0 16px;
  border-radius: var(--r-ctl);
  border: 1px dashed var(--steel);
  background: transparent;
  color: var(--chalk);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease),
    color var(--t-fast) var(--ease);
}
.own-btn:hover {
  border-color: var(--red);
  color: var(--red);
}
.own-btn.active {
  border-style: solid;
  border-color: var(--red);
  background: var(--red);
  color: #fff;
}

.pad {
  display: grid;
  gap: 12px;
  padding-top: 4px;
}
.pad-row {
  display: grid;
  gap: 6px;
}

/* The live call phrase, sitting above the protection field. */
.say {
  display: grid;
  gap: 2px;
  padding: 10px 12px;
  border-radius: var(--r-ctl);
  border: 1px solid color-mix(in srgb, var(--red) 45%, var(--line));
  background: color-mix(in srgb, var(--red) 10%, var(--panel-raised));
}
.say-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--steel);
}
.say-phrase {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.5rem;
  line-height: 1.15;
  color: var(--red);
}
.pad-label {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--steel);
}
.pad-route {
  font-style: normal;
  text-transform: none;
  letter-spacing: 0;
  font-size: 0.95rem;
  color: var(--red);
}
.digit-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.digit {
  width: 44px;
  height: 44px;
  border-radius: var(--r-ctl);
  border: 1px solid var(--line);
  background: var(--panel-raised);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--chalk);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.digit:hover {
  border-color: var(--steel);
}
.digit.active {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}
.digit-none {
  width: auto;
  min-width: 44px;
  padding: 0 12px;
}
.tag-btn {
  min-height: 44px;
  padding: 0 20px;
  width: fit-content;
  border-radius: var(--r-ctl);
  border: 1px solid var(--line);
  background: var(--panel-raised);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--chalk);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.tag-btn:hover {
  border-color: var(--steel);
}
.tag-btn.active {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}

/* --- Terms --- */
.terms {
  border: 0;
  border-top: 1px solid var(--line);
  padding: 12px 0 0;
  margin: 2px 0 0;
  display: grid;
  gap: 8px;
}
.term-list {
  display: grid;
  gap: 8px;
  margin: 0;
}
.term {
  display: grid;
  gap: 2px;
}
.term dt {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--red);
}
.term dd {
  margin: 0;
  font-size: 0.88rem;
  color: var(--chalk-dim);
}
.term dd em {
  font-style: normal;
  color: var(--chalk);
  white-space: nowrap;
}

.pad-hint {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  font-size: 0.85rem;
}
.pad-link {
  color: var(--red);
  text-decoration: underline;
}

/* --- Assignment panel --- */
.panel {
  display: grid;
  gap: 16px;
}
.desc {
  font-size: 1rem;
  color: var(--chalk-dim);
}

@media (min-width: 880px) {
  .stage-wrap {
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 1fr);
    align-items: start;
    gap: 28px;
  }
  .title {
    font-size: 3rem;
  }
}
</style>
