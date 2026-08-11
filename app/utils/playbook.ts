/**
 * Presentation helpers for the app shell — labeling, ordering, and the
 * playside/backside ruling from SEAM.md §2 ("Position labeling").
 * Football data itself lives in app/data/** (data agent).
 */
import type {
  Assignment,
  CallPart,
  Formation,
  FrontId,
  OffPosId,
  Play,
} from '~/types/football'

export type PlaySide = 'playside' | 'backside' | null

/**
 * Playside/backside badge, computed — never stored. A player on the ball
 * (C, and Q/S when stacked on the midline) gets no badge.
 */
export function playSideOf(
  pos: OffPosId,
  play: Play,
  formation: Formation,
  front?: FrontId,
): PlaySide {
  const player = formation.players.find((p) => p.pos === pos)
  if (!player) return null
  const override = front ? play.vs[front]?.alignOverrides?.[pos] : undefined
  const x = (override ?? player.at).x
  if (Math.abs(x) < 0.35) return null
  return x > 0 === (play.direction === 'right') ? 'playside' : 'backside'
}

/** Front-independent assignments merged with the per-front overrides. */
export function mergedAssignments(
  play: Play,
  front: FrontId,
): Partial<Record<OffPosId, Assignment>> {
  return { ...play.assignments, ...(play.vs[front]?.assignments ?? {}) }
}

/**
 * The play call, word by word, for the "Play call" stamp on the play page.
 *
 * Plays that are called with more than formation + name (the audibles, the
 * boots) carry their own `call` in the data; everything else is called the way
 * it reads — "Red Veer" — so that is the fallback.
 */
export function callPartsFor(play: Play, formation: Formation): CallPart[] {
  if (play.call?.length) return play.call
  const name = play.name.startsWith(`${formation.name} `)
    ? play.name.slice(formation.name.length + 1)
    : play.name
  return [
    { word: formation.name, label: 'formation' },
    { word: name, label: 'play' },
  ]
}

export const POSITION_NAMES: Record<OffPosId, string> = {
  X: 'Split End',
  Y: 'Tight End',
  L: 'Left Wing',
  R: 'Right Wing',
  S: 'Super Back',
  Q: 'Quarterback',
  C: 'Center',
  LG: 'Left Guard',
  RG: 'Right Guard',
  LT: 'Left Tackle',
  RT: 'Right Tackle',
}

/** Kid-facing grouping for the assignment panel. */
export const POSITION_GROUPS: { label: string; positions: OffPosId[] }[] = [
  { label: 'Backs', positions: ['Q', 'S', 'L', 'R'] },
  { label: 'Ends', positions: ['X', 'Y'] },
  { label: 'Line', positions: ['LT', 'LG', 'C', 'RG', 'RT'] },
]

export const FRONT_ORDER: FrontId[] = ['44', '43', '52']

export const FRONT_LABELS: Record<FrontId, string> = {
  '44': '4-4',
  '43': '4-3',
  '52': '5-2',
}
