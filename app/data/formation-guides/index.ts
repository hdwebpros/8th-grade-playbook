/**
 * One guide per formation, keyed by FormationId, in book order.
 * The guides themselves are authored one file each — see types.ts.
 */
import type { FormationId } from '~/types/football'
import type { FormationGuide } from './types'
import { redGuide } from './red'
import { blackGuide } from './black'
import { tightGuide } from './tight'
import { splitWideGuide } from './split-wide'

export type { FormationGuide, LineupSpot, Strength } from './types'

/** Book order: the base set, its mirror, then the two balanced sets. */
export const formationGuideList: FormationGuide[] = [redGuide, blackGuide, tightGuide, splitWideGuide]

export const formationGuides: Record<FormationId, FormationGuide> = Object.fromEntries(
  formationGuideList.map((g) => [g.id, g]),
) as Record<FormationId, FormationGuide>
