/**
 * Mirror helpers — docs/SEAM.md §2.
 *
 * Mirroring a play means the same eleven kids line up flipped. So:
 *  - every `x` is negated (`y` is untouched — depth doesn't flip),
 *  - side-named ids swap, because those names describe a SIDE, not a person:
 *      LT↔RT, LG↔RG, L↔R (left wing / right wing), and any defender id
 *      suffixed `-L`/`-R`.
 *  - ids that name a person or a spot, not a side, stay put: X, Y, C, Q, S,
 *    and unsuffixed defenders (N, M, F).
 *
 * Why the wings swap: `OffPosId` in app/types/football.ts defines `L` as the
 * LEFT wing and `R` as the RIGHT wing, and varsity page 1 measures out the
 * same way — in Red the wings sit at (−5.7) and (+4.2); in Black, which is
 * drawn as Red's mirror, the circle labelled `L` is at (−4.2) and the one
 * labelled `R` is at (+5.7). The wing labelled `L` is always the left one.
 * Y and X keep their ids and change sides, which is exactly what page 1 shows.
 */

import type {
  Action,
  Assignment,
  Formation,
  FormationPlayer,
  Front,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
  Pt,
} from '../types/football'

/** Offensive ids whose name describes a side of the ball. */
const OFF_SIDE_SWAP: Partial<Record<OffPosId, OffPosId>> = {
  LT: 'RT',
  RT: 'LT',
  LG: 'RG',
  RG: 'LG',
  L: 'R',
  R: 'L',
}

export function mirrorPos(pos: OffPosId): OffPosId {
  return OFF_SIDE_SWAP[pos] ?? pos
}

/** `E-L` ⇄ `E-R`; `N`, `M`, `F` unchanged. */
export function mirrorDefenderId(id: string): string {
  if (id.endsWith('-L')) return `${id.slice(0, -2)}-R`
  if (id.endsWith('-R')) return `${id.slice(0, -2)}-L`
  return id
}

/** Negate x, keep y. `-0` is normalised back to `0`. */
export function mirrorPt(p: Pt): Pt {
  return { x: p.x === 0 ? 0 : -p.x, y: p.y }
}

export function mirrorAction(action: Action): Action {
  const out: Action = { kind: action.kind }
  if (action.path) out.path = action.path.map(mirrorPt)
  if (action.targetId) out.targetId = mirrorDefenderId(action.targetId)
  return out
}

/** Re-key a per-player record onto the mirrored player ids. */
function mirrorByPos<T>(
  src: Partial<Record<OffPosId, T>>,
  mapValue: (value: T) => T,
): Partial<Record<OffPosId, T>> {
  const out: Partial<Record<OffPosId, T>> = {}
  for (const [pos, value] of Object.entries(src) as [OffPosId, T][]) {
    out[mirrorPos(pos)] = mapValue(value)
  }
  return out
}

export function mirrorFormation(
  formation: Formation,
  overrides: Partial<Formation> = {},
): Formation {
  const players: FormationPlayer[] = formation.players.map((p) => ({
    pos: mirrorPos(p.pos),
    at: mirrorPt(p.at),
  }))
  return { ...formation, players, ...overrides }
}

/** Provided for completeness; our three fronts are already symmetric. */
export function mirrorFront(front: Front, overrides: Partial<Front> = {}): Front {
  return {
    ...front,
    defenders: front.defenders.map((d) => ({
      ...d,
      id: mirrorDefenderId(d.id),
      at: mirrorPt(d.at),
    })),
    ...overrides,
  }
}

export function mirrorFrontPlan(plan: FrontPlan): FrontPlan {
  const out: FrontPlan = {
    actions: mirrorByPos(plan.actions, (actions: Action[]) => actions.map(mirrorAction)),
  }
  if (plan.assignments) {
    out.assignments = mirrorByPos(plan.assignments, (a: Assignment) => ({ ...a }))
  }
  if (plan.alignOverrides) {
    out.alignOverrides = mirrorByPos(plan.alignOverrides, mirrorPt)
  }
  if (plan.readKey) out.readKey = mirrorDefenderId(plan.readKey)
  if (plan.ignored) out.ignored = plan.ignored.map(mirrorDefenderId)
  return out
}

/**
 * THE BALANCED-SET X↔Y EXCHANGE. `mirrorPlay` swaps the side-NAMED ids
 * (LT↔RT, LG↔RG, L↔R, defender -L/-R) and negates every x, but leaves entries
 * keyed `X` and `Y` where they are. That is right for Red/Black, where the
 * FORMATION mirrors and Y physically changes sides with his entry. A balanced
 * one-formation set (Tight, Split Wide) does not mirror onto a twin — Y is
 * always the LEFT tight end and X always the RIGHT one, mirror-image POSITIONS
 * that keep their spots — so a correct mirror must ALSO exchange the X and Y
 * entries everywhere they are keyed. Without the swap the playside tight end's
 * job lands on the man standing on the far edge.
 */
export function swapXY<T>(rec: Partial<Record<OffPosId, T>>): Partial<Record<OffPosId, T>> {
  const { X, Y, ...rest } = rec
  const out: Partial<Record<OffPosId, T>> = { ...rest }
  if (Y !== undefined) out.X = Y
  if (X !== undefined) out.Y = X
  return out
}

/** `mirrorPlay`, then the X↔Y exchange a balanced one-formation set requires. */
export function mirrorTightPlay(play: Play, overrides: Partial<Play> = {}): Play {
  const m = mirrorPlay(play)
  const assignments = swapXY(m.assignments) as Record<OffPosId, Assignment>
  const vs = {} as Record<FrontId, FrontPlan>
  for (const [frontId, plan] of Object.entries(m.vs) as [FrontId, FrontPlan][]) {
    const next: FrontPlan = { ...plan, actions: swapXY(plan.actions) }
    if (plan.assignments) next.assignments = swapXY(plan.assignments)
    if (plan.alignOverrides) next.alignOverrides = swapXY(plan.alignOverrides)
    vs[frontId] = next
  }
  return { ...m, assignments, vs, ...overrides }
}

/**
 * Mirror a whole play. Everything geometric flips; `overrides` is where the
 * author states what mirroring can't know (the new id/name/formation) and
 * hand-corrects any place where the football isn't actually symmetric.
 */
export function mirrorPlay(play: Play, overrides: Partial<Play> = {}): Play {
  const assignments = mirrorByPos(play.assignments, (a: Assignment) => ({
    ...a,
  })) as Record<OffPosId, Assignment>

  const vs = {} as Record<FrontId, FrontPlan>
  for (const [frontId, plan] of Object.entries(play.vs) as [FrontId, FrontPlan][]) {
    vs[frontId] = mirrorFrontPlan(plan)
  }

  return {
    ...play,
    direction: play.direction === 'left' ? 'right' : 'left',
    ballCarrier: mirrorPos(play.ballCarrier),
    assignments,
    vs,
    ...overrides,
  }
}
