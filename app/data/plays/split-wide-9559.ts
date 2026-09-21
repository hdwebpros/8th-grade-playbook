/**
 * SPLIT WIDE 95-59 — the audible system said out of Split Wide.
 *
 * Coach Ryan's call, verbatim: "Split Wide Bull 95-59. Formation is split wide.
 * Blockers block to the left (Bull), same as stretch-boot-red. Routes are for
 * the 4 receivers RtoL, Fade (Go), curl, curl, fade (Go)."
 *
 * IT IS CALLED WITH NO PROTECTION WORD NOW. When this went in, the only two
 * protections in the system were Ram and Bull, so a call had to pick one. Coach
 * Ryan has since given us the default: "We don't have to call out a protection
 * where we push left or right. If we don't say anything, you just block
 * straight up like a normal pass protection, create a pocket." Nothing about
 * this call needs the line slid — the routes are the same on both sides — so it
 * is now said plain, "Split Wide 95-59", and the five linemen block the men in
 * front of them. Say "Split Wide Bull 95-59" and you get the identical four
 * routes with the line sliding left, exactly as it was drawn before.
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

export const splitWide9559: Play = buildSplitWideAudible(
  { protection: 'none', digits: [9, 5, 5, 9] },
  {
    id: 'split-wide-9559',
    name: 'Split Wide 95-59',
    summary: 'Four-receiver pass. Fades outside, curls underneath, both sides.',
    description:
      'The audible system said out of Split Wide, with a digit for every one of the four receivers instead of two. Right to left: fade, curl, curl, fade. Nobody says a protection word, so the line blocks STRAIGHT UP — each of the five pass blocks the man in front of him, kick-steps back and builds a pocket, nobody past the line — and Super stays back to chip the nearest man who comes free. The two fades run the corners off and the two curls sit down at ten in the room they leave. Same picture on both sides of the ball. The fades are deep routes, so this one is a five-step drop, and the quarterback throws to whichever of the four the defense left alone.',
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
        rule: 'Pass block STRAIGHT UP. Take the man in front of you and HOLD.',
        detail:
          'You are the blind side on a five-step drop and the fades take time, so your block has to last longest. Short kick-step back, hands inside on the man in front of you, take him around the pocket and hold — never up the field, that is a penalty on a pass.',
      },
      S: {
        rule: 'Stay back and protect. Chip the nearest man who comes free.',
        detail:
          'Four receivers are out, so you are the only help the line has. You do not have a gap and you do not have a side — sit back there, find the nearest incoming defender and block him. If nobody comes, STAY HOME. You are the last thing between a blitzer and the quarterback.',
      },
      Q: {
        rule: 'Five-step drop — the fades are deep routes.',
        detail:
          'Straight back off the midline, five steps, ball at your chest. Four men are out, so take whichever one the defense left alone. Feet set on the last step and let it go; if nothing is there, throw it away or run. If they are getting in quickly, come back to three steps and get the ball out.',
      },
    },
    reviewNotes: [
      'DRAFT — Coach Ryan must approve this football before it reaches a player.',
      'YOUR CALL, TRANSCRIBED: "Split Wide Bull 95-59 … blockers block to the left (Bull) … routes are for the 4 receivers RtoL, Fade (Go), curl, curl, fade (Go)." Read right to left across the formation: X (wide right) 9 fade, R (right slot) 5 curl, L (left slot) 5 curl, Y (wide left) 9 fade. Confirm "right to left" means across the formation from the offense\'s point of view — from the sideline it reverses, and because this call is symmetric you would never catch the mistake on this play, only on the next one.',
      'FOUR DIGITS IS NOW THE SPLIT WIDE RULE. Every Red and Black call is two digits (three with the backside wing), the digits belonging to X and the wings with Y as a zero. Split Wide detaches four men, so out of this formation every one of them gets a number and nobody has a standing rule — and the caller pad on /audible now builds any four-digit Split Wide call, not just this one. If four digits is right here, the Y being a fourth number in Red and Black is the same idea. Say the word and we will wire that side of it too.',
      'THE HYPHEN. Written as "95-59" the way you said it, with the hyphen splitting the right pair from the left pair. If the kids should say "ninety-five fifty-nine" as one four-digit number with no break, tell us and the label loses the hyphen everywhere.',
      'THE PROTECTION WORD CAME OFF THIS CALL (2026-09-21). You gave us the default — "if we don\'t say anything, you just block straight up like a normal pass protection, create a pocket" — and nothing about 95-59 needs the line slid, so it is now called plain: "Split Wide 95-59", five men on the five men in front of them, no lean. Your original transcription did say "Bull", so if you meant the line to slide LEFT on this specific call, say so and the one word goes back — the routes and everything else are untouched either way, and "Split Wide Bull 95-59" is still callable on the pad.',
      'THE PROTECTION IS A PASS SET. Your rule: on a pass the linemen pass block whoever is in front of them and never go upfield. So this call no longer borrows the Boot drive block: all five take a short kick-step back off the ball and stay square. Same helper as Red, Black and Tight (`passLine` in app/data/plays/audible-shared.ts), so a pass set means one thing everywhere.',
      'SUPER IS THE SIXTH BLOCKER and he does what he does on every call: stays back and chips the nearest man who comes free. You did not say anything different for this one. The old build gave him an alignment off the right tackle\'s hip; that is gone.',
      'THE TWO CURLS SIT AT THE SAME DEPTH ON BOTH SIDES, which is the point — it is one picture the kid reads twice, once per side. It also means the middle of the field is empty on this call. Flag it if you want one of the 5s to become something else (a 3 hitch underneath, or a 7 post) and it stops being symmetric.',
      'ROUTE GEOMETRY comes straight off the tree in app/data/routes.ts with nothing stretched: curls at ten, fades leaning out from eight, each off the man\'s own alignment.',
      'ALIGNMENT, 2026-09-17, your words: "N is directly over C. DT should be directly over the last letter on the guard (either the L or the G in RG). DE should be directly over the edge of the circle on the OT." Every front is drawn that way now, so the five pass sets meet the same five spots on all three fronts.',
      'DIRECTION is set to "right" in the data only because the badge code needs a side; nothing in this call leans anywhere, and the football itself is balanced. That only affects playside/backside badges in the UI. And because the call is symmetric, this play has no mirror twin — the mirror of it is itself — with no slide there is nothing to flip, and the caller pad can build that one on demand.',
      'Formation is app/data/split-wide-formation.ts — Y wide left at 13, L slot at 8.5 left, R slot at 8.5 right, X wide right at 13, slots a yard off the ball, Super 4½ deep, seven on the line so it is legal. Same confirmation still open as on the rest of the Split Wide package: 8½ and 13 are big splits for 8th graders.',
    ],
  },
)
