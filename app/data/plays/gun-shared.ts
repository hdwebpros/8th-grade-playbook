/**
 * Shared helper for GUN versions of existing plays.
 *
 * A gun play is a real Play object (own id, own complete `vs` map) built from
 * its under-center base. The line never moves and the linemen, X and Y keep
 * their jobs, so the helper copies the base and lets the author replace ONLY
 * what the gun changes: the backfield actions and assignments, the ball
 * carrier, the words. Anything not overridden is inherited verbatim.
 *
 * Coach Ryan's rules for gun runs (2026-09-21):
 *  - Call: one word after the set — "Red Gun Veer Right".
 *  - No pre-snap motion on Veer or Crush from the gun.
 *  - Playside back gets the ball. Red Gun Veer Right: R dives, Super swings
 *    behind the QB as the pitch. Red Gun Veer Left: Super dives, R pitches.
 *    Black Gun: same with L beside the QB (Black Gun is NOT Red Gun mirrored —
 *    Super is on the QB's left in both sets).
 *  - Buck Sweep and Stretch: same playside rule. Other back fakes inside or
 *    leads. Guards still pull on Buck Sweep. Slot wing blocks down.
 *  - Split Wide Gun: same plays as under center; Keep still motions Super out.
 *  - Who blocks the playside backer with the wing in the backfield: draw
 *    something up, Ryan will adjust.
 *
 * Id convention: base id + '-gun' → 'veer-right-red-gun'. The play page finds
 * a play's gun twin by that convention (see `gunIdOf`, `baseIdOf`).
 */
import type {
  Action,
  Assignment,
  CallPart,
  FrontId,
  FrontPlan,
  OffPosId,
  Play,
} from '../../types/football'

export const GUN_CALL_PART: CallPart = { word: 'Gun', label: 'variation' }

export const gunIdOf = (baseId: string): string => `${baseId}-gun`
export const baseIdOf = (id: string): string => id.replace(/-gun$/, '')
export const isGunPlay = (play: Pick<Play, 'variant'>): boolean => play.variant === 'gun'

type ActionMap = Partial<Record<OffPosId, Action[]>>
type AssignmentMap = Partial<Record<OffPosId, Assignment>>

export interface GunPlaySpec {
  /** Defaults to gunIdOf(base.id). */
  id?: string
  ballCarrier?: OffPosId
  summary?: string
  description?: string
  coachNotes?: string[]
  /** Front-independent assignment text; merged over the base per position. */
  assignments?: AssignmentMap
  /** Actions applied to every front, then overridden per front by `vs`. */
  actions?: ActionMap
  /** Per-front overrides: actions merge per position; other fields replace. */
  vs?: Partial<Record<FrontId, Partial<FrontPlan>>>
  /** Links among GUN plays only — never point these at an under-center play. */
  formationTwinId?: string
  audibleFlipId?: string
  reviewNotes?: string[]
}

/**
 * Build a gun play from its under-center base. `call` gets 'Gun' inserted
 * right after the formation word. Base `reviewNotes` are dropped (they
 * describe the base's authoring history, not this play's).
 */
export function gunPlay(base: Play, spec: GunPlaySpec): Play {
  const call = base.call
    ? [base.call[0]!, GUN_CALL_PART, ...base.call.slice(1)]
    : undefined

  const vs = Object.fromEntries(
    (Object.keys(base.vs) as FrontId[]).map((front) => {
      const basePlan = base.vs[front]
      const over = spec.vs?.[front] ?? {}
      const plan: FrontPlan = {
        ...basePlan,
        ...over,
        actions: { ...basePlan.actions, ...spec.actions, ...over.actions },
      }
      if (basePlan.assignments || over.assignments) {
        plan.assignments = { ...basePlan.assignments, ...over.assignments }
      }
      return [front, plan]
    }),
  ) as Record<FrontId, FrontPlan>

  const play: Play = {
    ...base,
    id: spec.id ?? gunIdOf(base.id),
    variant: 'gun',
    call,
    ballCarrier: spec.ballCarrier ?? base.ballCarrier,
    summary: spec.summary ?? base.summary,
    description: spec.description ?? base.description,
    assignments: { ...base.assignments, ...spec.assignments },
    vs,
    formationTwinId: spec.formationTwinId,
    audibleFlipId: spec.audibleFlipId,
    coachNotes: spec.coachNotes ?? base.coachNotes,
    reviewNotes: spec.reviewNotes,
  }
  delete play.callName
  return play
}
