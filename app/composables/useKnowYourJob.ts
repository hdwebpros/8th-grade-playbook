/**
 * Know-your-job quiz engine.
 *
 * Builds a round of tap-the-right-answer questions for ONE position across
 * every play and front in the book. Fronts where the job text is identical
 * are collapsed into a single question (a kid should never answer the same
 * card three times in a row just because the defense renamed itself), and a
 * representative front is re-rolled every round so "Run it again" shows a
 * different picture for the same job.
 *
 * Pure functions, no state, nothing stored — the page owns the (in-memory,
 * disposable) round state.
 */
import type { Assignment, FrontId, OffPosId, Play } from '~/types/football'
import { FRONT_ORDER, POSITION_GROUPS, mergedAssignments } from '~/utils/playbook'

export interface JobQuestion {
  play: Play
  pos: OffPosId
  /** The front this question (and its reveal diagram) is asked against. */
  front: FrontId
  /** Every front this exact rule holds against (includes `front`). */
  frontsCovered: FrontId[]
  answer: Assignment
  /** Shuffled tappable rule texts — `answer.rule` plus distractors. */
  options: string[]
  /** Which teammate owns each option's rule — powers the miss teach-back. */
  ownerOf: Partial<Record<string, OffPosId>>
}

export interface JobResult {
  question: JobQuestion
  /** The rule text the kid tapped. */
  picked: string
  correct: boolean
}

function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j]!, arr[i]!]
  }
  return arr
}

function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!
}

/**
 * Distractors: other players' rules on the SAME play vs the SAME front, so
 * every wrong option is real football a teammate is actually doing on this
 * snap. Same-side-of-the-ball jobs (line vs line, backs vs backs) come
 * first — those are the confusable ones.
 */
function buildOptions(
  play: Play,
  front: FrontId,
  pos: OffPosId,
  answer: Assignment,
  count = 3,
): { options: string[]; ownerOf: Partial<Record<string, OffPosId>> } {
  const merged = mergedAssignments(play, front)
  const myGroup = POSITION_GROUPS.find((g) => g.positions.includes(pos))

  const seen = new Set<string>([answer.rule])
  const near: { pos: OffPosId; rule: string }[] = []
  const far: { pos: OffPosId; rule: string }[] = []

  for (const [key, a] of Object.entries(merged) as [OffPosId, Assignment][]) {
    if (key === pos || !a || seen.has(a.rule)) continue
    seen.add(a.rule)
    ;(myGroup?.positions.includes(key) ? near : far).push({ pos: key, rule: a.rule })
  }

  const distractors = [...shuffle(near), ...shuffle(far)].slice(0, count - 1)
  const ownerOf: Partial<Record<string, OffPosId>> = { [answer.rule]: pos }
  for (const d of distractors) ownerOf[d.rule] = d.pos

  return {
    options: shuffle([answer.rule, ...distractors.map((d) => d.rule)]),
    ownerOf,
  }
}

/** One round: every distinct job `pos` has across `playList` × all fronts. */
export function buildRound(pos: OffPosId, playList: Play[]): JobQuestion[] {
  const questions: JobQuestion[] = []

  for (const play of playList) {
    // Group fronts by identical rule text — one question per distinct job.
    const groups = new Map<string, { fronts: FrontId[]; answer: Assignment }>()
    for (const front of FRONT_ORDER) {
      const a = mergedAssignments(play, front)[pos]
      if (!a) continue
      const g = groups.get(a.rule)
      if (g) g.fronts.push(front)
      else groups.set(a.rule, { fronts: [front], answer: a })
    }

    for (const { fronts: frontsCovered, answer } of groups.values()) {
      const front = pickOne(frontsCovered)
      // Reveal detail should match the front actually shown when it varies.
      const shown = mergedAssignments(play, front)[pos] ?? answer
      questions.push({
        play,
        pos,
        front,
        frontsCovered,
        answer: shown,
        ...buildOptions(play, front, pos, shown),
      })
    }
  }

  return shuffle(questions)
}
