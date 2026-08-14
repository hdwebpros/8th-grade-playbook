/**
 * SPLIT WIDE BULL 95-59 — the audible system said out of Split Wide.
 *
 * Coach Ryan's call, verbatim: "Split Wide Bull 95-59. Formation is split wide.
 * Blockers block to the left (Bull), same as stretch-boot-red. Routes are for
 * the 4 receivers RtoL, Fade (Go), curl, curl, fade (Go)."
 *
 *     X  (wide right, +13)   9 — fade
 *     R  (right slot, +8.5)  5 — curl
 *     ------------------------------- the hyphen is the middle of the field
 *     L  (left slot, −8.5)   5 — curl
 *     Y  (wide left, −13)    9 — fade
 *
 * Two fades outside, two curls inside: the fades run the corners off and the
 * curls sit down in the space they leave. It is the same picture on both sides
 * of the ball, which is exactly why a kid can learn it in one rep — and it is
 * also why the digits happen to read the same either direction.
 *
 * THIS FILE IS PROSE, NOT FOOTBALL
 * ---------------------------------------------------------------------------
 * The football lives in app/data/plays/audible-split-wide.ts, which builds ANY
 * four-digit Split Wide call — that is what the caller pad on /audible uses.
 * This call was the first one, so it keeps its hand-written coaching prose and
 * its review notes; everything geometric comes out of the same machine every
 * other Split Wide call comes out of, so the two can never drift apart.
 */

import type { Play } from '../../types/football'
import { buildSplitWideAudible } from './audible-split-wide'

export const splitWideBull9559: Play = buildSplitWideAudible(
  { lean: 'left', digits: [9, 5, 5, 9] },
  {
    id: 'split-wide-9559',
    name: 'Split Wide 95-59',
    summary: 'Four-receiver pass. Fades outside, curls underneath, both sides.',
    description:
      'The audible system said out of Split Wide, with a digit for every one of the four receivers instead of two. Right to left: fade, curl, curl, fade. "Bull" is the protection — the line blocks the men in front of it and leans LEFT, the same way it does on Stretch Boot, and Super sets on the right tackle\'s inside hip to take anyone who comes through the thin side. The two fades run the corners off and the two curls sit down at ten in the room they leave. Same picture on both sides of the ball: the quarterback takes five steps, picks the curl the defense left alone, and throws the fade over the top of any corner who cheats up on it.',
    assignments: {
      X: {
        rule: 'First digit: 9 — fade. You are the widest man on the right.',
        detail:
          'Straight up the field, leaning toward the sideline. Run past him and go get the ball over your outside shoulder. Even when it does not come to you, your job is done: the corner has to run with you, and the room he leaves behind is exactly where R is curling up.',
      },
      R: {
        rule: 'Second digit: 5 — curl.',
        detail:
          'Ten yards straight up, then curl back inside toward the quarterback and find the open grass. Do not stop on a spot and stand there — work back downhill to him and show him your numbers. X has taken the corner deep, so the window is right where you are sitting.',
      },
      L: {
        rule: 'Third digit: 5 — curl. Same route as R, other side.',
        detail:
          'Ten up, curl back inside toward the quarterback, find the grass. You and R are running the identical route from both sides — whichever one of you the backers leave alone is the one who gets the ball, so never assume it is the other guy.',
      },
      Y: {
        rule: 'Fourth digit: 9 — fade. You are the widest man on the left.',
        detail:
          'Same fade X is running, other sideline. Straight up leaning out, and go get it over your outside shoulder. Two fades means neither corner can help inside on the curls — run it hard even on the snaps you know it is not coming.',
      },
      RT: {
        rule: 'Bull — block the man in front of you, lean LEFT. HOLD, and never downfield.',
        detail:
          'You are the blind side on a five-step drop and the fades take time, so your block has to last longest. Helmet to his outside shoulder, drive him left, and hold. Super is at your inside hip if somebody comes underneath.',
      },
      S: {
        rule: 'Off the inside hip of the RIGHT tackle — the tackle away from the lean. First man through is yours.',
        detail:
          'Four receivers are out, so you are the only help the line has. The line is leaning left, which leaves the right side thinner — set at the right tackle’s inside hip, chest square, eyes inside-out, and take the first man who comes through there. If nobody comes, STAY HOME. You are the last thing between a blitzer and the quarterback and there is no checkdown on this play.',
      },
      Q: {
        rule: 'Five-step drop. Curls first, fades if a corner jumps one.',
        detail:
          'Straight back off the midline, five steps, ball at your chest. Your first look is the two curls — they are the rhythm throw and they come open at ten. Pick the side where the backer has widened or where the corner has turned and run with the fade. If a corner sits down on a curl instead of running with the fade, throw the fade over the top of him. Feet set on the last step and let it go — Super is blocking, so there is no checkdown: if nothing is there, throw it away or run.',
      },
    },
    frontAssignments: {
      '44': {
        S: {
          rule: 'Set on the right tackle’s inside hip. Two backers inside — one of them may come.',
          detail:
            'The 4-4 keeps eight men close to the ball, so somebody usually comes. Get to the tackle’s inside hip fast, chest square, and take the first man through. Do not go looking for work outside — the tackle has that man.',
        },
      },
      '43': {
        C: {
          rule: 'Nobody in front of you — step BACK, help a guard, eat any blitz.',
          detail:
            'No one is on your nose. Snap it and take one short step back — never forward, that is a penalty on a pass play. The Mike is stacked straight over the ball: if he comes, he is yours. If he drops, push in and help whichever guard is losing his fight.',
        },
      },
    },
    reviewNotes: [
      'DRAFT — Coach Ryan must approve this football before it reaches a player.',
      'YOUR CALL, TRANSCRIBED: "Split Wide Bull 95-59 … blockers block to the left (Bull), same as stretch-boot-red … routes are for the 4 receivers RtoL, Fade (Go), curl, curl, fade (Go)." Read right to left across the formation: X (wide right) 9 fade, R (right slot) 5 curl, L (left slot) 5 curl, Y (wide left) 9 fade. Confirm "right to left" means across the formation from the offense\'s point of view — from the sideline it reverses, and because this particular call is symmetric you would never catch the mistake on this play, only on the next one.',
      'FOUR DIGITS IS NOW THE SPLIT WIDE RULE. Every other call in the book is two digits (three with the backside wing), the digits belonging to X and the wings with Y as a zero. Split Wide detaches four men, so out of this formation every one of them gets a number and nobody has a standing rule — and the caller pad on /audible now builds any four-digit Split Wide call, not just this one. That is the answer to the open Y question in app/data/plays/audible.ts, arrived at from a different direction: if four digits is right here, the Y being the fourth number in Red and Black is the same idea. Say the word and we will wire that side of it too.',
      'THE HYPHEN. Written as "95-59" the way you said it, with the hyphen splitting the right pair from the left pair — which also means each side reads outside-in, the same direction the Red/Black calls read. If the kids should say "ninety-five fifty-nine" as one four-digit number with no break, tell us and the label loses the hyphen everywhere.',
      'PROTECTION IS STRETCH BOOT\'S, NOT THE p15 SLIDE. You said "same as stretch-boot-red", so the builder imports the same `driveBlock` helper from app/data/plays/stretch-boot.ts — every lineman takes the man in front of him, gets to his outside shoulder, drives him LEFT, holds, and never goes downfield. Vs the 4-4 and 4-3 the center is uncovered and steps BACK to help and eat a blitz; vs the 5-2 everybody has a man immediately. That is a DIFFERENT protection from the "Bull" on varsity p15, which slides the whole line into the gap on the call side. We kept your word "Bull" because it names the direction the line leans, but two protections sharing one word will confuse a 13-year-old — worth either a second word or a decision that Bull always means this out of Split Wide.',
      'SUPER IS THE SIXTH BLOCKER and he is drawn off the inside hip of the RIGHT tackle — the tackle away from the lean — which is the rule the Red/Black dropback audibles already give him (varsity p15, "SUPER — OFF HIP OF TACKLE AWAY"). You did not say what he does on this call. The alternatives: (a) he scans the whole line like he does on Split Wide Chip rather than owning one hip; (b) he releases to the flat, which is the "Dash" tag and would make it a five-man route with no help at all — which is why Dash is not offered out of Split Wide on the caller pad. Drafted as the hip because four receivers are already out and the line is leaning away from the right side.',
      "NO CHECKDOWN. Four receivers run deep-ish routes (curls at ten, fades) and Super blocks, so there is nothing underneath. The quarterback's assignment says so out loud — throw it away or run. If you want an outlet on this particular call, the cheapest change is a digit, not a tag: make one of the 5s a 3 and somebody is sitting at six.",
      "ROUTE GEOMETRY comes straight off the tree in app/data/routes.ts with no stretching: the 5 breaks inside so the slots have no ground to make up sideways, and the 9 runs at tree width off a 13-yard split, finishing about 15 yards from the ball — the same fade picture Split Wide Chip already draws for X. Depths are the tree's: curls at ten, fades leaning out from eight.",
      'THE TWO CURLS SIT AT THE SAME DEPTH ON BOTH SIDES, which is the point — it is one picture the kid reads twice, once per side. It also means the middle of the field is empty on this call: nothing crosses, nothing sits inside the hashes. Against a front that drops a backer straight into the middle that is free grass we are not using. Flag it if you want one of the 5s to become something else (a 3 hitch underneath, or a 7 post) and it stops being symmetric.',
      'DIRECTION is set to "left" in the data because the line leans left; the football itself is balanced. That only affects playside/backside badges in the UI. And because the call is symmetric, this play has no mirror twin — the mirror of it is "Split Wide Ram 95-59", a different call rather than a translation, and the caller pad can now build that one on demand.',
      'Formation is app/data/split-wide-formation.ts off varsity page 4 — Y wide left at 13, L slot at 8.5 left, R slot at 8.5 right, X wide right at 13, slots a yard off the ball, Super 4½ deep, seven on the line so it is legal. Same confirmation still open as on the rest of the Split Wide package: 8½ and 13 are big splits for 8th graders.',
    ],
  },
)
