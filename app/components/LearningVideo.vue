<script setup lang="ts">
import type { LearningVideo } from '~/data/learning'

const props = defineProps<{ video: LearningVideo }>()

/**
 * The player only loads once tapped — the card is a thumbnail facade until then.
 * `blocked` flips when YouTube refuses to embed (owner disabled embeds, or a
 * copyright claim — "content from the NFL, who has blocked it"); then the card
 * hands off to YouTube itself since nothing else can play it.
 */
const playing = ref(false)
const blocked = ref(props.video.embed === false)
const host = ref<HTMLDivElement | null>(null)

declare global {
  interface Window {
    YT?: any
    onYouTubeIframeAPIReady?: () => void
  }
}

let apiReady: Promise<void> | null = null
function loadApi() {
  if (window.YT?.Player) return Promise.resolve()
  apiReady ??= new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(s)
    }
  })
  return apiReady
}

async function play() {
  playing.value = true
  await loadApi()
  await nextTick()
  new window.YT.Player(host.value, {
    host: 'https://www.youtube-nocookie.com',
    videoId: props.video.id,
    playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1, start: props.video.start ?? 0 },
    events: {
      // 101/150: embedding not allowed. 100: removed/private. 2: bad id.
      onError: () => {
        blocked.value = true
      },
    },
  })
}

const thumb = computed(() => `https://i.ytimg.com/vi/${props.video.id}/hqdefault.jpg`)
const watchUrl = computed(() => {
  const t = props.video.start ? `&t=${props.video.start}s` : ''
  return `https://www.youtube.com/watch?v=${props.video.id}${t}`
})
</script>

<template>
  <article class="vid card">
    <div class="frame">
      <a v-if="blocked" :href="watchUrl" target="_blank" rel="noopener" class="blocked">
        <img :src="thumb" alt="" class="blocked-bg" />
        <span class="blocked-msg">
          <Icon name="lucide:external-link" aria-hidden="true" />
          <strong>Watch on YouTube</strong>
          <span>The owner doesn't allow this one to play here.</span>
        </span>
      </a>
      <div v-else-if="playing" ref="host" class="host" />
      <button
        v-else
        type="button"
        class="facade"
        :aria-label="`Play: ${video.title}`"
        @click="play"
      >
        <img :src="thumb" alt="" loading="lazy" />
        <span class="play">
          <Icon name="lucide:play" aria-hidden="true" />
        </span>
      </button>
    </div>
    <div class="meta">
      <span class="group">{{ video.group }}</span>
      <h3 class="title">{{ video.title }}</h3>
      <p v-if="video.note" class="note muted">{{ video.note }}</p>
      <a :href="watchUrl" target="_blank" rel="noopener" class="ext muted">
        <Icon name="lucide:external-link" aria-hidden="true" /> Open in YouTube
      </a>
    </div>
  </article>
</template>

<style scoped>
.vid {
  display: grid;
  overflow: hidden;
  padding: 0;
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.vid:hover {
  border-color: var(--red);
  background: var(--panel-raised);
}
.frame {
  position: relative;
  aspect-ratio: 16 / 9;
  background: #000;
  line-height: 0;
}
.host,
.frame :deep(iframe) {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.blocked {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: #fff;
}
.blocked-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.25;
  filter: blur(2px);
}
.blocked-msg {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 4px;
  padding: 16px;
  text-align: center;
  line-height: 1.3;
  font-size: 0.85rem;
}
.blocked-msg .iconify {
  font-size: 26px;
  color: var(--red);
}
.blocked-msg strong {
  font-family: var(--font-display);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 1rem;
}
.facade {
  position: absolute;
  inset: 0;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
}
.facade img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform var(--t-fast) var(--ease), opacity var(--t-fast) var(--ease);
  opacity: 0.85;
}
.vid:hover .facade img {
  transform: scale(1.03);
  opacity: 1;
}
.play {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 60px;
  height: 60px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: var(--red);
  color: #fff;
  font-size: 26px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
  transition: transform var(--t-fast) var(--ease);
}
.play .iconify {
  margin-left: 3px;
}
.vid:hover .play {
  transform: scale(1.08);
}
.meta {
  display: grid;
  gap: 4px;
  padding: 12px 14px 14px;
}
.group {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--red);
}
.title {
  font-size: 1.05rem;
  line-height: 1.25;
}
.note {
  font-size: 0.88rem;
}
.ext {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
  font-size: 0.8rem;
  width: fit-content;
}
.ext:hover {
  color: var(--chalk);
}
</style>
