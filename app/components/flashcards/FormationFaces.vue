<script setup lang="ts">
/**
 * FormationFaces — both faces of a Name That Formation flashcard.
 *
 * Renders as a Vue fragment of EXACTLY two roots — `.face.front.card` and
 * `.face.back.card` — dropped straight inside the page's flipping
 * `.flash-card` button. The page owns the button, the `.flipped` rotation and
 * the preserve-3d; this component owns the face content and ALL face CSS
 * (grid-area stacking, backface-visibility, the back's 180° turn), because
 * the page's scoped styles can't reach into a child component.
 *
 * The front diagram is drawn HERE, not with PlayDiagram: PlayDiagram needs a
 * Play, draws a defensive front, and letters every marker — and the letters
 * give the answer away (Y sitting on the left IS Red). So this draws just the
 * eleven offensive dots in the diagram layer's own visual language, reusing
 * its geometry helpers, style tokens and DiagramField stage so the picture
 * matches every other diagram in the app. The QB ring and the square center
 * stay — they're identical in all three sets, so they orient without leaking.
 */
import { computed } from 'vue'
import type { Pt } from '~/types/football'
import type { FormationCard } from '~/composables/useFormationDeck'
import { fitViewBox, U } from '~/components/diagram/geometry'
import { C, M } from '~/components/diagram/style'
import DiagramField from '~/components/diagram/DiagramField.vue'

const props = defineProps<{ card: FormationCard }>()

const dots = computed(() =>
  props.card.formation.players.map((p) => ({
    key: p.pos,
    at: p.at,
    isQb: p.pos === 'Q',
    isCenter: p.pos === 'C',
  })),
)

const fit = computed(() => {
  const pts: Pt[] = props.card.formation.players.map((p) => p.at)
  return fitViewBox(pts, { pad: 1.8, minWidth: 16, minHeight: 11 })
})
</script>

<template>
  <span class="face front card" aria-hidden="false">
    <span class="face-context">Mystery formation · offense only</span>
    <span class="face-diagram">
      <svg
        class="dots"
        :viewBox="fit.viewBox"
        width="100%"
        role="img"
        aria-label="Eleven unlabeled offensive dots lined up on the line of scrimmage"
      >
        <DiagramField :box="fit.box" />
        <g pointer-events="none">
          <g
            v-for="d in dots"
            :key="d.key"
            :transform="`translate(${d.at.x * U}, ${-d.at.y * U})`"
          >
            <circle
              v-if="d.isQb"
              :r="M.playerR + M.qbRingGap"
              fill="none"
              :stroke="C.playerStroke"
              :stroke-width="M.qbRingStroke"
            />
            <rect
              v-if="d.isCenter"
              :x="-M.playerR * 0.94"
              :y="-M.playerR * 0.94"
              :width="M.playerR * 1.88"
              :height="M.playerR * 1.88"
              rx="2.5"
              :fill="C.playerFill"
              :stroke="C.playerStroke"
              :stroke-width="M.playerStroke"
            />
            <circle
              v-else
              :r="M.playerR"
              :fill="C.playerFill"
              :stroke="C.playerStroke"
              :stroke-width="M.playerStroke"
            />
          </g>
        </g>
      </svg>
    </span>
    <span class="face-prompt">
      What's the formation?
      <span class="tap-hint muted">
        <Icon name="lucide:pointer" aria-hidden="true" /> Tap to flip
      </span>
    </span>
  </span>

  <span class="face back card" role="status" aria-live="polite">
    <span class="face-context">Formation · same eleven kids</span>
    <span class="answer-name">{{ card.formation.name }}</span>
    <span class="answer-desc muted">{{ card.cue }}</span>
  </span>
</template>

<style scoped>
/* Face plumbing — must live here, the page's scoped CSS can't reach in.
   Matches app/pages/quiz/flashcards.vue exactly. */
.face {
  grid-area: 1 / 1;
  display: grid;
  gap: 10px;
  padding: 14px 16px;
  backface-visibility: hidden;
  min-height: 100%;
}
.face.back {
  transform: rotateY(180deg);
  align-content: center;
  justify-items: center;
  text-align: center;
  border-left: 3px solid var(--red);
}
.face-context {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--steel);
}
.face-diagram {
  display: block;
  border-radius: var(--r-ctl);
  overflow: hidden;
  background: var(--dg-field);
}
.dots {
  display: block;
}
.face-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--chalk);
}
.tap-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.1em;
}
.answer-name {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 1.05;
  text-transform: uppercase;
  letter-spacing: 0.03em;
  color: var(--chalk);
}
.answer-desc {
  font-size: 0.95rem;
  max-width: 46ch;
}

@media (min-width: 640px) {
  .answer-name {
    font-size: 3rem;
  }
}
</style>
