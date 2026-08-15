<script setup lang="ts">
useHead({ title: 'Centennial Wolves Playbook' })

const quickLinks = [
  {
    to: '/plays/veer-right-red',
    icon: 'lucide:flame',
    title: 'Veer',
    sub: 'Our bread and butter. Start here.',
    hot: true,
  },
  {
    to: '/formations',
    icon: 'lucide:layout-grid',
    title: 'Formations',
    sub: 'Where do I stand? All four sets.',
    hot: false,
  },
  {
    to: '/routes',
    icon: 'lucide:route',
    title: 'Route Tree',
    sub: 'All ten routes, 0 through 9.',
    hot: false,
  },
  {
    to: '/quiz',
    icon: 'lucide:zap',
    title: 'Know Your Job',
    sub: 'Pick your position. Get quizzed.',
    hot: false,
  },
]
</script>

<template>
  <div class="home">
    <section class="hero">
      <img
        src="/brand/wolves-lockup.png"
        alt="Centennial Wolves '26"
        class="hero-mark"
        width="320"
        height="256"
      />
      <p class="eyebrow">Centennial &middot; 8th Grade Football</p>
      <h1 class="hero-title">Know your job.<br />Run it full speed.</h1>
      <p class="hero-sub muted">
        Every play, every front, every assignment. Works on the bus with no signal.
      </p>
      <NuxtLink to="/plays" class="hero-cta">
        Open the playbook
        <Icon name="lucide:arrow-right" aria-hidden="true" />
      </NuxtLink>
    </section>

    <section class="quick" aria-label="Jump in">
      <NuxtLink v-for="q in quickLinks" :key="q.to" :to="q.to" class="card quick-card">
        <span class="quick-icon" :class="{ hot: q.hot }">
          <Icon :name="q.icon" aria-hidden="true" />
        </span>
        <span class="quick-text">
          <span class="quick-title">{{ q.title }}</span>
          <span class="quick-sub muted">{{ q.sub }}</span>
        </span>
        <Icon name="lucide:chevron-right" class="quick-chev" aria-hidden="true" />
      </NuxtLink>
    </section>
  </div>
</template>

<style scoped>
.home {
  display: grid;
  gap: 28px;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 18px 8px 6px;
  gap: 10px;
}
.hero-mark {
  width: min(280px, 70vw);
  height: auto;
  filter: drop-shadow(0 8px 32px rgba(214, 32, 47, 0.25));
}
.hero-title {
  font-size: clamp(2.2rem, 8vw, 3.4rem);
}
.hero-sub {
  max-width: 34ch;
  font-size: 1rem;
}
.hero-cta {
  margin-top: 8px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  background: var(--red);
  color: #fff;
  border-radius: var(--r-ctl);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.15rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  transition:
    background var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease);
}
.hero-cta:hover {
  background: var(--red-deep);
}
.hero-cta:active {
  transform: translateY(1px);
}

.quick {
  display: grid;
  gap: 10px;
}
.quick-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  transition:
    border-color var(--t-fast) var(--ease),
    background var(--t-fast) var(--ease);
}
.quick-card:hover {
  border-color: var(--steel);
  background: var(--panel-raised);
}
.quick-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: var(--r-ctl);
  background: var(--panel-raised);
  color: var(--chalk);
  font-size: 20px;
  flex: none;
}
.quick-icon.hot {
  background: var(--red-glow);
  color: var(--red);
}
.quick-text {
  display: grid;
  gap: 1px;
  min-width: 0;
}
.quick-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.2rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.quick-sub {
  font-size: 0.9rem;
}
.quick-chev {
  margin-left: auto;
  color: var(--steel);
  flex: none;
}

@media (min-width: 880px) {
  .home {
    gap: 40px;
  }
  .hero {
    padding-top: 36px;
  }
  .quick {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
