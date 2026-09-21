<script setup lang="ts">
/**
 * /audible — the numbered passing system as a thing you can operate.
 *
 * The calls varsity actually drew, plus Coach Ryan's own, are the "Examples"
 * buttons. "Call your own" hands the kid the same machines those came out of:
 * pick the FORMATION and the digits, and slide the line with Ram or Bull only
 * if you want it slid — the protection row opens on Straight, which is what a
 * call with no protection word in it means — and the diagram draws what
 * they mean. Three machines sit behind it — Red and Black take two or three
 * digits (app/data/plays/audible.ts), Split Wide takes four, one per receiver
 * (app/data/plays/audible-split-wide.ts), and Tight takes four as well but
 * blocks it up with Red's slide (app/data/plays/audible-tight.ts) — and the
 * formation picker is what chooses between them. That is the practice loop:
 * say a call, then check yourself against the picture.
 */
import type { FrontId, OffPosId, Play } from '~/types/football'
import {
  PROTECTION_LABELS,
  audibleExamples,
  buildAudible,
  buildSplitWideAudible,
  callNameOf,
  formations,
  fronts,
  routes,
  splitWideCallName,
  buildTightAudible,
  tightCallName,
} from '~/data'
import type {
  AudibleCall,
  DashSide,
  Protection,
  SplitWideCall,
  TightCall,
} from '~/data'
import { FRONT_LABELS, FRONT_ORDER, callPartsFor } from '~/utils/playbook'

useHead({ title: 'Audible — Wolves Playbook' })

/* --- What we are looking at: one of the examples, or a call of your own --- */

type Source = { kind: 'example'; digits: string } | { kind: 'own' }

/** The four formations a call can be said out of. */
type PadFormation = 'red' | 'black' | 'split-wide' | 'tight'

const source = ref<Source>({ kind: 'example', digits: audibleExamples[0]!.digits })
/** null while the pad is empty: nothing is picked and nothing is drawn yet. */
const formation = ref<PadFormation | null>('red')
const front = ref<FrontId>('44')


const isSplitWide = computed(() => formation.value === 'split-wide')
const isTight = computed(() => formation.value === 'tight')

/** Split Wide and Tight both hand out four digits, one per receiver. */
const isFourDigit = computed(() => isSplitWide.value || isTight.value)

/** Red and Black are a mirrored pair; everything that takes one wants this. */
const pairFormation = computed<'red' | 'black'>(() => (formation.value === 'black' ? 'black' : 'red'))

/**
 * The call being built on the "Call your own" pad — one per machine, because a
 * Red call, a Split Wide call and a Tight call are not the same shape. The pad
 * opens EMPTY: no formation, no digits, protection on Straight (no call). So
 * these are draft shapes — a digit is null until the kid presses one — and the
 * real call is only handed to the builder once every digit is in.
 */
type PairDraft = { protection: Protection; outside: number | null; inside: number | null; backside?: number; dash?: DashSide }
type QuadDraft = { protection: Protection; digits: (number | null)[]; dash?: DashSide }

const emptyPair = (): PairDraft => ({ protection: 'none', outside: null, inside: null })
const emptyQuad = (): QuadDraft => ({ protection: 'none', digits: [null, null, null, null] })

const ownCall = ref<PairDraft>(emptyPair())
const ownSwCall = ref<QuadDraft>(emptyQuad())
const ownTightCall = ref<QuadDraft>(emptyQuad())

/** A draft is only a call once every digit it needs has been pressed. */
const pairCall = computed<AudibleCall | null>(() => {
  const c = ownCall.value
  return c.outside === null || c.inside === null
    ? null
    : { ...c, outside: c.outside, inside: c.inside }
})
const quadCall = (draft: QuadDraft): SplitWideCall & TightCall | null =>
  draft.digits.every((d): d is number => d !== null)
    ? { ...draft, digits: draft.digits as [number, number, number, number] }
    : null

/**
 * Deep links from the route tree: `?formation=red|black|split-wide|tight` opens
 * the pad on the side the kid was just looking at, and `?outside=5` puts that
 * route on X so he sees the number he picked drawn as a real call.
 *
 * The baked-in examples are all Red/Black (plus the one Split Wide call), so a
 * link to a formation that has no example of its own opens the PAD instead of
 * an example that would quietly ignore the formation you asked for.
 */
const route = useRoute()
const isPadFormation = (v: unknown): v is PadFormation =>
  v === 'red' || v === 'black' || v === 'split-wide' || v === 'tight'
if (isPadFormation(route.query.formation)) {
  formation.value = route.query.formation
  if (formation.value === 'tight') source.value = { kind: 'own' }
}
{
  const n = Number(route.query.outside)
  if (Number.isInteger(n) && n >= 0 && n <= 9 && !isFourDigit.value) {
    ownCall.value = { ...ownCall.value, outside: n }
    source.value = { kind: 'own' }
  }
}

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

/** Null until there is a whole call to draw — the pad's empty state. */
const play = computed<Play | null>(() => {
  const ex = example.value
  if (ex) return ex.playFor(pairFormation.value)
  if (formation.value === null) return null
  if (isSplitWide.value) {
    const c = quadCall(ownSwCall.value)
    return c ? buildSplitWideAudible(c) : null
  }
  if (isTight.value) {
    const c = quadCall(ownTightCall.value)
    return c ? buildTightAudible(c) : null
  }
  return pairCall.value ? buildAudible(pairCall.value, pairFormation.value) : null
})

/** The call as it is said in the huddle, for the current formation. */
const spokenCall = computed<string | null>(() => {
  const ex = example.value
  if (ex) return ex.callNameFor(pairFormation.value)
  if (formation.value === null) return null
  if (isSplitWide.value) {
    const c = quadCall(ownSwCall.value)
    return c ? splitWideCallName(c) : null
  }
  if (isTight.value) {
    const c = quadCall(ownTightCall.value)
    return c ? tightCallName(c) : null
  }
  return pairCall.value ? callNameOf(pairCall.value, pairFormation.value) : null
})

/**
 * An example that lives in one formation — Split Wide 95-59 — leaves the
 * header toggle nothing to switch, so it hides while that example is up.
 */
const locked = computed(() => example.value?.lockedFormation)

/** Whatever formation the play we are drawing actually sets. */
const formationInfo = computed(() => (play.value ? formations[play.value.formation]! : null))

/** The call word by word, so the stamp explains whatever the pad just built. */
const callParts = computed(() =>
  play.value && formationInfo.value ? callPartsFor(play.value, formationInfo.value) : null,
)
const frontInfo = computed(() => fronts[front.value]!)
const frontOptions = FRONT_ORDER.map((f) => ({ value: f, label: FRONT_LABELS[f] }))

/* --- The "Call your own" pad --- */

const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
const routeName = (num: number) => routes.find((r) => r.num === num)?.name ?? `${num}`

/**
 * The formation is the first thing you say, so it is the first row on the pad —
 * and it is also what picks the machine: Red and Black take two digits, Split
 * Wide takes four.
 */
const formationOptions: { value: PadFormation; label: string }[] = [
  { value: 'red', label: 'Red' },
  { value: 'black', label: 'Black' },
  { value: 'split-wide', label: 'Split Wide' },
  { value: 'tight', label: 'Tight' },
]

/**
 * ONE protection row, the same three choices in every formation, and it opens
 * on the DEFAULT. Coach Ryan: "We don't have to call out a protection where we
 * push left or right. If we don't say anything, you just block straight up like
 * a normal pass protection, create a pocket." Ram and Bull are the two words
 * that slide the line, said only when you want it slid — "It's just bull and
 * ram, nothing else. You can do bull or ram protection on any formation."
 */
const protectionOptions: { value: Protection; label: string }[] = [
  { value: 'none', label: `${PROTECTION_LABELS.none} — no call` },
  { value: 'ram', label: `${PROTECTION_LABELS.ram} — slide right` },
  { value: 'bull', label: `${PROTECTION_LABELS.bull} — slide left` },
]

/** The line under the word "Protection" on the pad, for whichever is picked. */
const protectionHint = (protection: Protection): string =>
  protection === 'none'
    ? 'No word said — everybody blocks the man in front of him'
    : `The line slides ${protection === 'ram' ? 'right' : 'left'}`

/** The four Split Wide digits, in the order they are said: right to left. */
const swSlots = [
  { i: 0, ord: 'First digit', who: 'X — wide right' },
  { i: 1, ord: 'Second digit', who: 'R — right wing' },
  { i: 2, ord: 'Third digit', who: 'L — left wing' },
  { i: 3, ord: 'Fourth digit', who: 'Y — wide left' },
]

/**
 * The four Tight digits. Same four letters in the same order as Split Wide —
 * X first, always — but in Tight the WING lines up OUTSIDE his tight end, so
 * each slot has to say who the man is instead of how wide he is.
 */
const tightSlots = [
  { i: 0, ord: 'First digit', who: 'X — right tight end' },
  { i: 1, ord: 'Second digit', who: 'R — right wing (outside X)' },
  { i: 2, ord: 'Third digit', who: 'L — left wing (outside Y)' },
  { i: 3, ord: 'Fourth digit', who: 'Y — left tight end' },
]

function setSwDigit(i: number, d: number) {
  const next = [...ownSwCall.value.digits]
  next[i] = d
  ownSwCall.value = { ...ownSwCall.value, digits: next }
}

function setTightDigit(i: number, d: number) {
  const next = [...ownTightCall.value.digits]
  next[i] = d
  ownTightCall.value = { ...ownTightCall.value, digits: next }
}

/** "—" until he presses one, then the route that digit names. */
const digitRoute = (d: number | null | undefined) =>
  d === null || d === undefined ? 'Not picked yet' : routeName(d)

/** Same three-choice tag as Red and Black: no tag, left, or right. */
function toggleTightDash(side: DashSide) {
  ownTightCall.value.dash = ownTightCall.value.dash === side ? undefined : side
}

const tightDashHint = computed(() =>
  ownTightCall.value.dash === undefined
    ? 'Super stays back and blocks'
    : `Super to the ${ownTightCall.value.dash} flat — nobody left over`,
)

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

/**
 * The Dash tag names a SIDE, and either side is callable out of either
 * formation — so it is three choices, not a switch: no tag, left, or right.
 * Same shape as the third digit: "—" is a real choice, and pressing the lit
 * one again clears it.
 */
const dashOptions: { value: DashSide; label: string }[] = [
  { value: 'left', label: 'Dash Left' },
  { value: 'right', label: 'Dash Right' },
]

function toggleDash(side: DashSide) {
  ownCall.value.dash = ownCall.value.dash === side ? undefined : side
}

/** What the tag buys you, in the line next to the label. */
const dashHint = computed(() =>
  ownCall.value.dash === undefined
    ? 'Super blocks'
    : `Super to the ${ownCall.value.dash} flat`,
)

function chooseExample(d: string) {
  // Keep the formation and the example agreeable: an example locked to one
  // formation drags the picker there, and a Red/Black example drags it back off
  // whichever four-digit formation the pad was sitting on.
  const ex = audibleExamples.find((e) => e.digits === d)
  if (ex?.lockedFormation) formation.value = ex.lockedFormation
  else if (formation.value === null || isFourDigit.value) formation.value = 'red'
  source.value = { kind: 'example', digits: d }
}

function callYourOwn() {
  // Coach Ryan: the pad starts EMPTY. You pick the formation, you pick the
  // protection — which opens on Straight, the no-call — and you pick the
  // numbers. Nothing is drawn until the call is a whole call.
  formation.value = null
  ownCall.value = emptyPair()
  ownSwCall.value = emptyQuad()
  ownTightCall.value = emptyQuad()
  source.value = { kind: 'own' }
}

/* --- Selection: diagram tap <-> assignment row --- */

const selected = ref<OffPosId | null>(null)
watch(() => play.value?.id, () => (selected.value = null))

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
          <PlayCallStamp v-if="callParts" :parts="callParts" />
        </div>

        <!-- Red and Black are a pair, so the header keeps its two-way toggle.
             Split Wide and Tight are balanced sets with no twin — they are
             chosen on the pad and have nothing to toggle. -->
        <nav v-if="!locked && !isFourDigit" class="dir-toggle" aria-label="Formation">
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
          <span v-if="spokenCall" class="call-chip">{{ spokenCall }}</span>
        </div>
        <div v-if="play && formationInfo" class="diagram card">
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
        <!-- Nothing called yet: no picture to check yourself against. -->
        <div v-else class="diagram card diagram-empty">
          <p>Pick your formation, then your numbers — the play draws itself.</p>
        </div>
        <p v-if="play" class="hint muted">
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
                <span class="ex-call">{{ ex.callNameFor(pairFormation) }}</span>
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
              <p class="say-phrase">{{ spokenCall ?? 'Start with the formation…' }}</p>
            </div>

            <!-- The formation is the first word out of your mouth, so it is the
                 first row here — and it is what decides how many digits the
                 call has. -->
            <div class="pad-row">
              <span class="pad-label">
                Formation
                <em class="pad-route">
                  {{
                    formation === null
                      ? 'Not picked yet — this is the first word you say'
                      : isFourDigit
                        ? 'Four digits — one per receiver'
                        : 'Two digits, three if you buy the backside wing'
                  }}
                </em>
              </span>
              <div class="dir-toggle pad-toggle" role="group" aria-label="Formation">
                <button
                  v-for="opt in formationOptions"
                  :key="opt.value"
                  type="button"
                  class="dir-btn"
                  :class="{ active: formation === opt.value }"
                  :aria-pressed="formation === opt.value"
                  @click="formation = opt.value"
                >
                  {{ opt.label }}
                </button>
              </div>
            </div>

            <template v-if="isSplitWide">
              <div class="pad-row">
                <span class="pad-label">
                  Protection
                  <em class="pad-route">{{ protectionHint(ownSwCall.protection) }}</em>
                </span>
                <SegmentedControl
                  v-model="ownSwCall.protection"
                  :options="protectionOptions"
                  label="Protection"
                />
              </div>

              <div v-for="slot in swSlots" :key="slot.i" class="pad-row">
                <span class="pad-label">
                  {{ slot.ord }} &middot; {{ slot.who }}
                  <em class="pad-route">{{ digitRoute(ownSwCall.digits[slot.i]) }}</em>
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

            <!-- Tight: four digits like Split Wide, but blocked up like Red —
                 the slide, plus the Dash tag, plus the fact that both tight
                 ends are out and Super has whatever edge that opens. -->
            <template v-else-if="isTight">
              <div class="pad-row">
                <span class="pad-label">
                  Protection
                  <em class="pad-route">{{ protectionHint(ownTightCall.protection) }}</em>
                </span>
                <SegmentedControl
                  v-model="ownTightCall.protection"
                  :options="protectionOptions"
                  label="Protection"
                />
              </div>

              <div v-for="slot in tightSlots" :key="slot.i" class="pad-row">
                <span class="pad-label">
                  {{ slot.ord }} &middot; {{ slot.who }}
                  <em class="pad-route">{{ digitRoute(ownTightCall.digits[slot.i]) }}</em>
                </span>
                <div class="digit-row" role="group" :aria-label="`${slot.ord} — ${slot.who}`">
                  <button
                    v-for="d in digits"
                    :key="`tg${slot.i}-${d}`"
                    type="button"
                    class="digit"
                    :class="{ active: ownTightCall.digits[slot.i] === d }"
                    :aria-pressed="ownTightCall.digits[slot.i] === d"
                    @click="setTightDigit(slot.i, d)"
                  >
                    {{ d }}
                  </button>
                </div>
              </div>

              <div class="pad-row">
                <span class="pad-label">
                  Tag
                  <em class="pad-route">{{ tightDashHint }}</em>
                </span>
                <div class="digit-row" role="group" aria-label="Tag — Dash">
                  <button
                    type="button"
                    class="digit digit-none"
                    :class="{ active: ownTightCall.dash === undefined }"
                    :aria-pressed="ownTightCall.dash === undefined"
                    @click="ownTightCall.dash = undefined"
                  >
                    &mdash;
                  </button>
                  <button
                    v-for="opt in dashOptions"
                    :key="`tg-${opt.value}`"
                    type="button"
                    class="tag-btn"
                    :class="{ active: ownTightCall.dash === opt.value }"
                    :aria-pressed="ownTightCall.dash === opt.value"
                    @click="toggleTightDash(opt.value)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <p class="pad-hint muted">
                <Icon name="lucide:route" aria-hidden="true" />
                Four eligibles, four digits: X, the right wing, the left wing, Y.
                <NuxtLink to="/routes" class="pad-link">See the route tree</NuxtLink>
              </p>
            </template>

            <template v-else-if="formation">
              <div class="pad-row">
                <span class="pad-label">
                  Protection
                  <em class="pad-route">{{ protectionHint(ownCall.protection) }}</em>
                </span>
                <SegmentedControl
                  v-model="ownCall.protection"
                  :options="protectionOptions"
                  label="Protection"
                />
              </div>

              <div class="pad-row">
                <span class="pad-label">
                  First digit &middot; X — wide receiver
                  <em class="pad-route">{{ digitRoute(ownCall.outside) }}</em>
                </span>
                <div class="digit-row" role="group" aria-label="First digit — wide receiver">
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
                  <em class="pad-route">{{ digitRoute(ownCall.inside) }}</em>
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
                  <em class="pad-route">{{ dashHint }}</em>
                </span>
                <div class="digit-row" role="group" aria-label="Tag — Dash">
                  <button
                    type="button"
                    class="digit digit-none"
                    :class="{ active: ownCall.dash === undefined }"
                    :aria-pressed="ownCall.dash === undefined"
                    @click="ownCall.dash = undefined"
                  >
                    &mdash;
                  </button>
                  <button
                    v-for="opt in dashOptions"
                    :key="opt.value"
                    type="button"
                    class="tag-btn"
                    :class="{ active: ownCall.dash === opt.value }"
                    :aria-pressed="ownCall.dash === opt.value"
                    @click="toggleDash(opt.value)"
                  >
                    {{ opt.label }}
                  </button>
                </div>
              </div>

              <p class="pad-hint muted">
                <Icon name="lucide:route" aria-hidden="true" />
                Say the whole call out loud, then check the picture.
                <NuxtLink to="/routes" class="pad-link">See the route tree</NuxtLink>
              </p>
            </template>

            <!-- Nothing picked yet: the formation decides how many digits the
                 call even has, so there is nothing to show under it. -->
            <p v-else class="pad-hint muted">
              <Icon name="lucide:route" aria-hidden="true" />
              Pick a formation and the rest of the call opens up under it.
              <NuxtLink to="/routes" class="pad-link">See the route tree</NuxtLink>
            </p>
          </div>

          <!-- The words that are not digits. Learn these and the rest is math. -->
          <fieldset class="terms">
            <legend>Terms to know</legend>
            <dl class="term-list">
              <div class="term">
                <dt>Dash Right &amp; Dash Left</dt>
                <dd>
                  Super does not block — he releases to the flat, and the word after
                  <strong>Dash</strong> tells him which one. Say it after the protection, or
                  right after the formation when you did not call one:
                  <em>Red Dash Right 33</em>, <em>Black Bull Dash Left 54</em>. Either side
                  works out of either formation, so Dash Right is the RIGHT flat no matter who
                  called it. Costs you a blocker, buys you a target.
                </dd>
              </div>
              <div class="term">
                <dt>Say nothing &middot; straight pass pro</dt>
                <dd>
                  The <strong>default</strong>, and most calls are this: no protection word at
                  all. <em>Red 33</em>. <em>Split Wide 95-59</em>. Every lineman blocks the man
                  in front of him — short kick-step back, hands inside, no leaning anywhere —
                  and the five of them make a <strong>pocket</strong>. The tackles still have
                  the ends and Super still stays back.
                </dd>
              </div>
              <div class="term">
                <dt>Ram &amp; Bull</dt>
                <dd>
                  The only two protection words there are, and you only say one when you want
                  the whole line <strong>sliding</strong> one way together. <strong>Ram</strong>
                  takes the line RIGHT; <strong>Bull</strong> takes it LEFT. That is all the
                  word means, so either one works out of any formation — <em>Red Bull 33</em>
                  and <em>Black Ram 54</em> are both real calls. Say neither and it is straight
                  pass pro.
                </dd>
              </div>
              <div class="term">
                <dt>Super</dt>
                <dd>
                  He always stays back and protects — a <strong>chip block</strong>. He finds
                  the nearest man coming in and blocks him, and he picks up any blitz or
                  anybody who gets through. He never has the defensive end; the line blocks
                  the end every single time. <strong>Dash</strong> is the one thing that takes
                  him out of it.
                </dd>
              </div>
              <div class="term">
                <dt>Split Wide &middot; four digits</dt>
                <dd>
                  Out of Split Wide there are four men detached instead of two, so the call has
                  <strong>four</strong> digits and every receiver has one — nobody is a zero, nobody
                  has a standing rule. Said right to left across the formation:
                  <em>Split Wide 95-59</em>. Same protection choices as everywhere else, and the
                  same blocking: the five linemen pass block straight up unless you say
                  <strong>Ram</strong> or <strong>Bull</strong>, and never past the line either
                  way.
                </dd>
              </div>
              <div class="term">
                <dt>Tight &middot; four digits</dt>
                <dd>
                  Tight lets <strong>four</strong> men go too — both tight ends and both
                  wings — so it is a four-digit call as well, and in the same letter order:
                  <em>X R - L Y</em>. X is the right tight end, R is the right wing,
                  L is the left wing, Y is the left tight end. Watch the spots: out here the
                  WING lines up outside the tight end, so the first digit is not the widest
                  man — it is X, the way it is on every call in the book. The protection is the
                  same pass set — straight up on <em>Tight 33-33</em>, or slid with
                  <strong>Ram</strong> right or <strong>Bull</strong> left — and
                  because both tight ends are gone the tackles have the ends alone and Super stays
                  back to pick up anybody who gets through.
                </dd>
              </div>
              <div class="term">
                <dt>The Y</dt>
                <dd>
                  Out of Red and Black the digits belong to the wide receiver and the two
                  wings, and the tight end blocks. We are exploring how to call the Y to a
                  route out of those two — it may be the fourth number, awaiting
                  confirmation. Out of Split Wide and Tight he already has one.
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

      <section v-if="play && formationInfo" class="panel" aria-label="Assignments">
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
.diagram-empty {
  display: grid;
  place-items: center;
  min-height: 180px;
  padding: 24px 18px;
  text-align: center;
  color: var(--chalk-dim);
  font-family: var(--font-display);
  font-size: 1rem;
  letter-spacing: 0.02em;
}
.pad-toggle {
  flex-wrap: wrap;
  width: fit-content;
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
  padding: 0 14px;
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
