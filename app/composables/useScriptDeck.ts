/**
 * Opening script — resolver and "First 8" flashcard deck.
 *
 * resolveScript() turns app/data/script.ts (play ids + counts) into rows the
 * page and the cards can render: the Play, its Formation, the spoken call
 * ("Tight Crush Left") and the snap count. A bad play id throws, so a typo in
 * the script fails `nuxt generate` instead of quietly rendering a blank row.
 *
 * The deck drills the script BOTH ways (same policy as useRouteDeck.ts):
 *  - slot-to-call: front "play #5", back the call + the count.
 *  - call-to-slot: front the call, back every slot it fills + each count.
 * One card per slot one way, one card per distinct play the other way — a
 * play that appears twice (Red Veer Left, #2 on two and #4 on one) gets one
 * call-to-slot card whose back lists both. Pure functions, nothing scored,
 * nothing stored — the page owns the disposable drill state.
 */
import type { Formation, Play } from '~/types/football'
import { formations, plays } from '~/data'
import { openingScript, snapCountOf, type SnapCount } from '~/data/script'
import { callLabelFor } from '~/utils/playbook'

export interface ScriptSlot {
  /** 1-based position in the script. */
  n: number
  playId: string
  play: Play
  formation: Formation
  /** The call said out loud: "Split Wide Screen Right". */
  label: string
  count: SnapCount
}

let cached: ScriptSlot[] | null = null

/** The script, resolved against the playbook. Throws on an unknown play id. */
export function resolveScript(): ScriptSlot[] {
  if (cached) return cached
  cached = openingScript.map((entry, i) => {
    const play = plays[entry.playId]
    if (!play) throw new Error(`opening script: unknown play id "${entry.playId}" at slot ${i + 1}`)
    const formation = formations[play.formation]
    if (!formation) throw new Error(`opening script: play "${play.id}" has unknown formation "${play.formation}"`)
    return {
      n: i + 1,
      playId: play.id,
      play,
      formation,
      label: callLabelFor(play, formation),
      count: snapCountOf(entry),
    }
  })
  return cached
}

export type ScriptCardDirection = 'slot-to-call' | 'call-to-slot'

export interface ScriptCard {
  kind: 'first-8'
  direction: ScriptCardDirection
  /** The slot this card asks about (for call-to-slot, the play's first slot). */
  slot: ScriptSlot
  /** Every slot this play fills — more than one for a repeated play. */
  slots: ScriptSlot[]
}

function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

/** Slot-to-call for every slot, call-to-slot once per distinct play, shuffled together. */
export function buildScriptDeck(): ScriptCard[] {
  const script = resolveScript()
  const slotsByPlay = new Map<string, ScriptSlot[]>()
  for (const slot of script) {
    const list = slotsByPlay.get(slot.playId) ?? []
    list.push(slot)
    slotsByPlay.set(slot.playId, list)
  }
  const forward = script.map(
    (slot): ScriptCard => ({
      kind: 'first-8',
      direction: 'slot-to-call',
      slot,
      slots: slotsByPlay.get(slot.playId) ?? [slot],
    }),
  )
  const reverse = [...slotsByPlay.values()].map(
    (slots): ScriptCard => ({
      kind: 'first-8',
      direction: 'call-to-slot',
      slot: slots[0]!,
      slots,
    }),
  )
  return shuffle([...forward, ...reverse])
}

/**
 * Reshuffle for the next lap. The guard is on the PLAY, not the exact card:
 * the new lap never opens on the play the kid is looking at right now, even
 * flipped the other way.
 */
export function relapScriptDeck(lastPlayId: string): ScriptCard[] {
  const deck = buildScriptDeck()
  if (deck.length > 1 && deck[0]!.slot.playId === lastPlayId) {
    const others = deck
      .map((card, i) => ({ card, i }))
      .filter(({ card }) => card.slot.playId !== lastPlayId)
    if (others.length) {
      const pick = others[Math.floor(Math.random() * others.length)]!
      ;[deck[0], deck[pick.i]] = [deck[pick.i]!, deck[0]!]
    }
  }
  return deck
}
