/**
 * The Centennial route tree — transcribed from varsity page 14.
 *
 * Each path starts from a receiver at (0,0), in yards. Positive x is drawn to
 * the receiver's OUTSIDE (toward the sideline) and negative x to the inside;
 * the tree is drawn once and flipped by the renderer for the other side of the
 * formation. Depths are the ones the varsity picture implies, rounded to
 * numbers a 13-year-old can count out.
 *
 * Combos are called outside-to-in on the WR side (e.g. 54 = WR curl, wing
 * wheel) — that's the call system, not part of this reference.
 */

import type { RouteDef } from '../types/football'

export const routes: RouteDef[] = [
  {
    num: 0,
    name: 'Block',
    path: [{ x: -0.8, y: 1.5 }],
    description: "Don't release — go get the man over you and stay on him. Zero means we're running the ball.",
  },
  {
    num: 1,
    name: 'Slant',
    path: [
      { x: 0, y: 3 },
      { x: -4.5, y: 6.5 },
    ],
    description: 'Three hard steps upfield, then plant and cut inside on an angle. Look for the ball right now.',
  },
  {
    num: 2,
    name: 'Speed Out',
    path: [
      { x: 0, y: 5 },
      { x: 4.5, y: 5.8 },
    ],
    description: 'Five yards, roll your shoulders and break flat to the sideline. Fast in, fast out.',
  },
  {
    num: 3,
    name: 'Hitch',
    path: [
      { x: 0, y: 6 },
      { x: -1, y: 4.8 },
    ],
    description: 'Six yards, stop, and come back downhill toward the quarterback. Sit down and give him a target.',
  },
  {
    num: 4,
    name: 'Wheel',
    path: [
      { x: 2, y: 0.5 },
      { x: 4.5, y: 2 },
      { x: 5.5, y: 5 },
      { x: 5.8, y: 16 },
    ],
    description: 'Start flat like an out, then turn it up the sideline and run. Sell the short route first.',
  },
  {
    num: 5,
    name: 'Curl',
    path: [
      { x: 0, y: 10 },
      { x: -1.6, y: 8.6 },
    ],
    description: 'Ten yards up, then curl back inside toward the quarterback and find the open grass.',
  },
  {
    num: 6,
    name: 'Comeback',
    path: [
      { x: 0, y: 12 },
      { x: 2.4, y: 9.8 },
    ],
    description: 'Twelve yards up, sell that you are going deep, then snap back out toward the sideline.',
  },
  {
    num: 7,
    name: 'Post',
    path: [
      { x: 0, y: 15 },
      { x: -6.5, y: 21 },
    ],
    description: 'Run at the corner for fifteen, then break inside on an angle at the goal post. Keep running.',
  },
  {
    num: 8,
    name: 'Corner',
    path: [
      { x: 0, y: 15 },
      { x: 5.5, y: 20.5 },
    ],
    description: 'Fifteen yards up, then break out on an angle toward the pylon. Same stem as the post, other way.',
  },
  {
    num: 9,
    name: 'Fade',
    path: [
      { x: 0, y: 8 },
      { x: 1.4, y: 15 },
      { x: 2, y: 23 },
    ],
    description: 'Straight up the field, leaning toward the sideline. Run past him and go get the ball over your outside shoulder.',
  },
]
