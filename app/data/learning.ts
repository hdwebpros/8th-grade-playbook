/** Coaching videos players can study on their own. All YouTube. */
export interface LearningVideo {
  /** YouTube video id */
  id: string
  title: string
  /** Position group tag shown on the card */
  group: string
  /** Optional one-liner under the title */
  note?: string
  /** Start playback here (seconds) */
  start?: number
  /**
   * false when the owner (or a copyright holder like the NFL) blocks embedding —
   * the card sends players to YouTube instead of showing a dead player.
   */
  embed?: boolean
}

export const learningVideos: LearningVideo[] = [
  { id: 'hHyjR__k3XA', group: 'O-Line', title: 'Techniques for run and pass blocking' },
  { id: 'jbpw_nIr6KU', group: 'O-Line', title: 'The art of run and pass blocking', embed: false },
  { id: 'SVRFS_Iq8cY', group: 'Center & QB', title: 'The center-to-QB exchange' },
  {
    id: 'gV72PtmmEZw',
    group: 'Defense',
    title: 'Hawk tackling',
    note: 'How Centennial varsity teaches it.',
    embed: false,
  },
  { id: 'DbFeu4T_35c', group: 'D-Line', title: 'How to explode from your stance', embed: false },
  { id: 'b8Y-BrxoGQc', group: 'WR', title: 'Drills to improve route running', start: 163, embed: false },
  { id: 'XZ-dRS32sj4', group: 'Superback', title: 'Habits and footwork' },
  { id: 'kafczztzTRA', group: 'QB', title: 'How to throw farther' },
]
