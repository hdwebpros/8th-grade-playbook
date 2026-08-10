<script setup lang="ts">
/**
 * The "who does what" panel that sits beside (or under) a play diagram.
 *
 * Shared by the play page and /audible, because an audible is just a play the
 * kid made up — it deserves the same eleven rows of teaching text as one out
 * of the book.
 */
import type { Assignment, Formation, FrontId, OffPosId, Play } from '~/types/football'
import {
  FRONT_LABELS,
  POSITION_GROUPS,
  POSITION_NAMES,
  mergedAssignments,
  playSideOf,
} from '~/utils/playbook'

const props = defineProps<{
  play: Play
  front: FrontId
  formation: Formation
  /** The player whose detail is expanded, kept by the parent so the diagram agrees. */
  selected: OffPosId | null
}>()

const emit = defineEmits<{ select: [pos: OffPosId | null] }>()

const assignments = computed(() => mergedAssignments(props.play, props.front))

const groups = computed(() =>
  POSITION_GROUPS.map((g) => ({
    label: g.label,
    rows: g.positions
      .filter((pos) => assignments.value[pos])
      .map((pos) => ({
        pos,
        name: POSITION_NAMES[pos],
        side: playSideOf(pos, props.play, props.formation, props.front),
        assignment: assignments.value[pos] as Assignment,
        overridden: Boolean(props.play.vs[props.front]?.assignments?.[pos]),
      })),
  })).filter((g) => g.rows.length),
)

/** Rows are scroll targets so tapping the diagram can bring one into view. */
const rowEls = ref<Partial<Record<OffPosId, HTMLElement>>>({})
function setRowEl(pos: OffPosId, el: unknown) {
  if (el instanceof HTMLElement) rowEls.value[pos] = el
}

function onRowClick(pos: OffPosId) {
  emit('select', props.selected === pos ? null : pos)
}

/** Called by the parent when the pick came from the diagram, not from a row. */
function revealRow(pos: OffPosId) {
  nextTick(() => rowEls.value[pos]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }))
}

defineExpose({ revealRow })
</script>

<template>
  <div class="assignments">
    <div v-for="group in groups" :key="group.label" class="group">
      <h2 class="group-title">{{ group.label }}</h2>
      <ul class="rows">
        <li v-for="row in group.rows" :key="row.pos" :ref="(el) => setRowEl(row.pos, el)">
          <button
            type="button"
            class="row"
            :class="{ selected: selected === row.pos }"
            :aria-expanded="selected === row.pos"
            @click="onRowClick(row.pos)"
          >
            <span class="pos-chip" :class="{ hot: row.pos === play.ballCarrier }">
              {{ row.pos }}
            </span>
            <span class="row-main">
              <span class="row-top">
                <span class="row-name">{{ row.name }}</span>
                <PlaySideBadge :side="row.side" />
                <span v-if="row.overridden" class="vs-chip">vs {{ FRONT_LABELS[front] }}</span>
              </span>
              <span class="row-rule">{{ row.assignment.rule }}</span>
              <span
                v-if="row.assignment.detail && selected === row.pos"
                class="row-detail muted"
              >
                {{ row.assignment.detail }}
              </span>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.assignments {
  display: grid;
  gap: 16px;
}
.group {
  display: grid;
  gap: 8px;
}
.group-title {
  font-size: 0.95rem;
  color: var(--steel);
  letter-spacing: 0.14em;
}
.rows {
  display: grid;
  gap: 6px;
}
.row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  width: 100%;
  text-align: left;
  padding: 10px 12px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-left: 3px solid var(--line);
  border-radius: var(--r-card);
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.row:hover {
  background: var(--panel-raised);
}
.row.selected {
  border-color: var(--red);
  background: var(--panel-raised);
}
.pos-chip {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex: none;
  border-radius: 999px;
  border: 2px solid var(--chalk);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.05rem;
  color: var(--chalk);
}
.pos-chip.hot {
  background: var(--red);
  border-color: var(--red);
  color: #fff;
}
.row-main {
  display: grid;
  gap: 2px;
  min-width: 0;
}
.row-top {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.row-name {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--steel);
}
.vs-chip {
  padding: 2px 8px;
  border-radius: 999px;
  background: var(--panel-raised);
  border: 1px solid var(--steel);
  color: var(--chalk);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}
.row-rule {
  font-size: 1rem;
  font-weight: 600;
  color: var(--chalk);
}
.row-detail {
  font-size: 0.92rem;
  padding-top: 2px;
}
</style>
