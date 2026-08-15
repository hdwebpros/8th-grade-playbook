/**
 * Game film — practice/scrimmage clips of plays actually being run.
 *
 * This is deliberately NOT part of the Play schema (football.ts is frozen and
 * pure football data). Film is an app asset: clips live in /public/film/, this
 * map hangs them off play ids, and the play page shows a player for any id
 * found here. To add film for a play: drop the .mp4 in public/film/, make a
 * poster (ffmpeg -ss 1 -i clip.mp4 -frames:v 1 -vf scale=640:-2 posters/clip.jpg),
 * and add an entry below.
 */

export interface FilmClip {
  /** Path under /public, e.g. '/film/red-veer-right.mp4'. */
  src: string
  /** Poster frame shown before play and in the clip picker. */
  poster: string
  /** Kid-facing label for the clip picker, e.g. 'Rep 1'. */
  label: string
  /** Whole seconds, for the duration badge. */
  seconds: number
}

/** Keyed by Play.id. A play absent here simply shows no film section. */
export const film: Record<string, FilmClip[]> = {
  'veer-right-red': [
    { src: '/film/red-veer-right.mp4', poster: '/film/posters/red-veer-right.jpg', label: 'Rep 1', seconds: 59 },
  ],
  'veer-left-red': [
    { src: '/film/red-veer-left.mp4', poster: '/film/posters/red-veer-left.jpg', label: 'Rep 1', seconds: 30 },
  ],
  'veer-left-black': [
    { src: '/film/black-veer-left.mp4', poster: '/film/posters/black-veer-left.jpg', label: 'Rep 1', seconds: 68 },
    { src: '/film/black-veer-left-2.mp4', poster: '/film/posters/black-veer-left-2.jpg', label: 'Rep 2', seconds: 16 },
  ],
  'crush-right-tight': [
    { src: '/film/tight-crush-right.mp4', poster: '/film/posters/tight-crush-right.jpg', label: 'Rep 1', seconds: 25 },
  ],
}

/** Play ids that have at least one clip — for "has film" badges in lists. */
export const filmPlayIds = new Set(Object.keys(film))
