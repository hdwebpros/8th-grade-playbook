<script setup lang="ts" generic="T extends string">
defineProps<{
  options: { value: T; label: string }[]
  modelValue: T
  /** Accessible name for the group, e.g. "Defensive front" */
  label: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', value: T): void }>()
</script>

<template>
  <div class="seg" role="group" :aria-label="label">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      class="seg-btn"
      :class="{ active: opt.value === modelValue }"
      :aria-pressed="opt.value === modelValue"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.seg {
  display: inline-flex;
  padding: 3px;
  gap: 3px;
  background: var(--panel);
  border: 1px solid var(--line);
  border-radius: var(--r-ctl);
}
.seg-btn {
  padding: 7px 16px;
  border-radius: calc(var(--r-ctl) - 3px);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--steel);
  transition:
    color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
  min-height: 38px;
}
.seg-btn:hover {
  color: var(--chalk);
}
.seg-btn.active {
  background: var(--red);
  color: #fff;
}
</style>
