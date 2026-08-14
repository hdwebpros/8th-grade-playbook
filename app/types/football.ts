/**
 * Canonical football data types — the machine-readable half of docs/SEAM.md.
 *
 * FROZEN: changes go through the orchestrator, not local convenience.
 *
 * Coordinates are YARDS. x: 0 = the ball, positive = offense's right
 * (viewer's right, offense drawn at bottom facing up). y: 0 = line of
 * scrimmage, positive = downfield into the defense, negative = backfield.
 * Data contains no pixels, colors, or styling — ever.
 */

/** A point on the field, in yards. */
export interface Pt {
  x: number
  y: number
}

export type FormationId = 'red' | 'black' | 'split-wide'

/** 4-4 and 4-3 are even fronts; 5-2 is odd. */
export type FrontId = '44' | '43' | '52'

export type FrontScheme = 'even' | 'odd'

/**
 * Offensive positions, keyed by actual player — never by playside/backside
 * role. The UI computes playside/backside badges from Play.direction.
 */
export type OffPosId =
  | 'X' // split end
  | 'Y' // tight end
  | 'L' // left wing
  | 'R' // right wing
  | 'S' // super (deep back)
  | 'Q' // quarterback
  | 'C'
  | 'LG'
  | 'RG'
  | 'LT'
  | 'RT'

export interface FormationPlayer {
  pos: OffPosId
  at: Pt
}

export interface Formation {
  id: FormationId
  name: string
  /** Kid-facing one-liner: what this formation is and when we're in it. */
  description: string
  players: FormationPlayer[]
}

/**
 * A defender in a front. `id` is stable and side-suffixed where mirrored
 * (e.g. 'E-L', 'T-R', 'N', 'B-L', 'C-R', 'F'); `label` is what's drawn:
 *   E end · T tackle · N nose · B linebacker (inside) · M Mike ·
 *   W Will (weak side) · S Sam (strong side) · C corner ·
 *   F free safety · $ strong safety
 * W/S and F/$ are strength names, so fronts author them strength-RIGHT and
 * app/utils/defense.ts resolves the drawn letter against the formation.
 */
export interface Defender {
  id: string
  label: string
  at: Pt
}

export interface Front {
  id: FrontId
  name: string
  scheme: FrontScheme
  /** Kid-facing: how to recognize this front from the huddle. */
  description: string
  defenders: Defender[]
}

/**
 * Semantic movement kinds. Styling lives entirely in the renderer.
 *  - carry:  the ball carrier's path
 *  - run:    a non-carrier's path (lead, pin, work-to block path w/o contact)
 *  - route:  a pass route
 *  - block:  ends in a block; may target a defender instead of carrying a path
 *  - motion: pre-snap motion (chains into following actions)
 *  - pitch:  the pitch relationship/flight
 *  - fake:   a fake (dive fake, play fake)
 */
export type ActionKind =
  | 'carry'
  | 'run'
  | 'route'
  | 'block'
  | 'motion'
  | 'pitch'
  | 'fake'

export interface Action {
  kind: ActionKind
  /**
   * Absolute field points, in yards, excluding the player's own start
   * (renderer prepends the player's alignment / previous action's end).
   * A 'block' with a targetId may omit path — the renderer draws from the
   * player (or chain end) to the defender and caps it with the block bar.
   */
  path?: Pt[]
  /** Defender id this action is aimed at (blocks, sometimes runs). */
  targetId?: string
}

export interface Assignment {
  /** Short, kid-facing, keeps varsity terms (Rip, Scoop, Base). */
  rule: string
  /** Optional coaching detail — the longer 'why/how'. */
  detail?: string
}

/** Everything specific to running the play against one front. */
export interface FrontPlan {
  /**
   * COMPLETE per-player action map for this front. Reuse across fronts is
   * done with TS spreads in data files, not schema magic.
   */
  actions: Partial<Record<OffPosId, Action[]>>
  /** Assignment-text overrides where this front changes the job. */
  assignments?: Partial<Record<OffPosId, Assignment>>
  /** Alignment tweaks vs this front, if any. */
  alignOverrides?: Partial<Record<OffPosId, Pt>>
  /** Defender id of the option read key, if this play reads one. */
  readKey?: string
  /**
   * Defender ids deliberately left unblocked in this picture (beyond the read
   * key) — the scheme handles them, e.g. the option. Drawn with a dashed ring.
   */
  ignored?: string[]
}

export type PlayFamily = 'run' | 'pass'

/** One word of a play call, plus what that word means. */
export interface CallPart {
  /** The word as it is said out loud, e.g. 'Red', 'Ram', '33'. */
  word: string
  /** What that word tells you, e.g. 'formation', 'protection', 'routes'. */
  label: string
}

export interface Play {
  /** e.g. 'veer-right-red', 'veer-left-red' — one Play per direction. */
  id: string
  /** Display name, e.g. 'Veer' */
  name: string
  /**
   * Legacy alternate call name from the scans. Runs no longer use this —
   * direction lives in `call` and Indy/Hoosier are line audibles
   * (DIRECTION_AUDIBLES), not names.
   */
  callName?: string
  /**
   * The call broken into the words you actually say, each with what that word
   * tells the huddle. Optional — `callPartsFor` falls back to formation + name.
   */
  call?: CallPart[]
  family: PlayFamily
  formation: FormationId
  direction: 'left' | 'right'
  /** Primary ball carrier (emphasized by the renderer). Option plays: the dive back. */
  ballCarrier: OffPosId
  /**
   * One line, said the way a coach says it on the sideline — the gist of the
   * concept, not its technique. Formations and fronts change the details, so
   * this stays above them; the specifics live in `description` and the
   * assignments.
   */
  summary: string
  /** Kid-facing: what this play is and why we run it. */
  description: string
  /** Front-independent teaching table. Feeds play page, quiz, and PDF alike. */
  assignments: Record<OffPosId, Assignment>
  vs: Record<FrontId, FrontPlan>
  /** Id of the same play run from the other formation (Red ⇄ Black). */
  formationTwinId?: string
  /**
   * Id of the play this becomes when the direction audible (Indy = left,
   * Hoosier = right) is called at the line: same formation, opposite direction.
   */
  audibleFlipId?: string
  /** Flags for Ryan's review, e.g. unverifiable call-name mapping. */
  reviewNotes?: string[]
}

export interface RouteDef {
  num: number // 0–9
  name: string
  /** Path from a receiver origin at (0,0), in yards. */
  path: Pt[]
  /** Kid-facing: how to run it. */
  description: string
}
