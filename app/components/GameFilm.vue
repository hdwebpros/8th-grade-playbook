<script setup lang="ts">
import type { FilmClip } from '~/data/film'

const props = defineProps<{ clips: FilmClip[] }>()

const current = ref(0)
const video = ref<HTMLVideoElement | null>(null)

const clip = computed(() => props.clips[current.value] ?? props.clips[0]!)

/** Navigating between plays swaps the clip list — start over on the new film. */
watch(
  () => props.clips,
  () => {
    current.value = 0
    video.value?.load()
  },
)

function pick(i: number) {
  if (i === current.value) return
  current.value = i
  // The <video> src binding updates on nextTick; load + play once it has.
  nextTick(() => {
    video.value?.load()
    video.value?.play()
  })
}

function fmt(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}
</script>

<template>
  <section class="film" aria-label="Game film">
    <header class="film-head">
      <h2 class="film-title">
        <Icon name="lucide:clapperboard" aria-hidden="true" /> Game film
      </h2>
      <span v-if="clips.length > 1" class="film-count muted">
        {{ clips.length }} clips
      </span>
    </header>

    <div class="player card">
      <video
        ref="video"
        :src="clip.src"
        :poster="clip.poster"
        controls
        playsinline
        preload="metadata"
      />
    </div>

    <div v-if="clips.length > 1" class="reel" role="tablist" aria-label="Clips">
      <button
        v-for="(c, i) in clips"
        :key="c.src"
        type="button"
        class="reel-clip"
        :class="{ active: i === current }"
        role="tab"
        :aria-selected="i === current"
        @click="pick(i)"
      >
        <span class="thumb">
          <img :src="c.poster" alt="" loading="lazy" />
          <span class="dur">{{ fmt(c.seconds) }}</span>
          <Icon v-if="i !== current" name="lucide:play" class="thumb-play" aria-hidden="true" />
        </span>
        <span class="reel-label">{{ c.label }}</span>
      </button>
    </div>
    <p v-else class="film-dur muted">
      <Icon name="lucide:timer" aria-hidden="true" /> {{ fmt(clip.seconds) }}
    </p>
  </section>
</template>

<style scoped>
.film {
  display: grid;
  gap: 10px;
}
.film-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}
.film-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.15rem;
  color: var(--steel);
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.film-title .iconify {
  color: var(--red);
}
.film-count {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.player {
  overflow: hidden;
  background: #000;
  line-height: 0;
}
.player video {
  width: 100%;
  aspect-ratio: 16 / 9;
  display: block;
}

/* --- Clip picker: a strip of poster thumbnails --- */
.reel {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 2px;
}
.reel-clip {
  flex: none;
  display: grid;
  gap: 4px;
  justify-items: start;
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
  color: var(--steel);
}
.thumb {
  position: relative;
  display: block;
  width: 128px;
  border-radius: calc(var(--r-ctl) - 2px);
  overflow: hidden;
  border: 2px solid var(--line);
  transition: border-color var(--t-fast) var(--ease);
  line-height: 0;
}
.thumb img {
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  display: block;
}
.thumb-play {
  position: absolute;
  inset: 0;
  margin: auto;
  font-size: 22px;
  color: #fff;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.8));
}
.dur {
  position: absolute;
  right: 4px;
  bottom: 4px;
  padding: 1px 5px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.7rem;
  letter-spacing: 0.06em;
  line-height: 1.4;
}
.reel-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  transition: color var(--t-fast) var(--ease);
}
.reel-clip:hover .thumb {
  border-color: var(--steel);
}
.reel-clip:hover .reel-label {
  color: var(--chalk);
}
.reel-clip.active .thumb {
  border-color: var(--red);
}
.reel-clip.active .reel-label {
  color: var(--red);
}

.film-dur {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
}
</style>
