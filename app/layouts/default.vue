<script setup lang="ts">
/** `short` is the phone tab-bar label when the full one won't fit. */
const tabs: { to: string; label: string; short?: string; icon: string }[] = [
  { to: '/plays', label: 'Playbook', icon: 'lucide:book-open' },
  { to: '/formations', label: 'Formations', icon: 'lucide:layout-grid' },
  { to: '/defense', label: 'Defense', icon: 'lucide:shield' },
  { to: '/special-teams', label: 'Special Teams', short: 'Specials', icon: 'lucide:goal' },
  { to: '/routes', label: 'Routes', icon: 'lucide:route' },
  { to: '/quiz', label: 'Quiz', icon: 'lucide:zap' },
  { to: '/export', label: 'Export', icon: 'lucide:printer' },
]

const route = useRoute()
const isActive = (to: string) => route.path === to || route.path.startsWith(to + '/')
</script>

<template>
  <div class="shell">
    <header class="topbar">
      <div class="topbar-inner">
        <NuxtLink to="/" class="mark" aria-label="Wolves Playbook home">
          <img src="/brand/wolves-mark.png" alt="" class="mark-img" width="86" height="58" />
          <span class="mark-word">
            Wolves<span class="mark-red">&nbsp;Playbook</span>
          </span>
        </NuxtLink>
        <nav class="topnav" aria-label="Primary">
          <NuxtLink
            v-for="tab in tabs"
            :key="tab.to"
            :to="tab.to"
            class="topnav-link"
            :class="{ active: isActive(tab.to) }"
            :aria-current="isActive(tab.to) ? 'page' : undefined"
          >
            <Icon :name="tab.icon" class="topnav-icon" aria-hidden="true" />
            {{ tab.label }}
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="content">
      <slot />
    </main>

    <nav class="tabbar" aria-label="Primary">
      <NuxtLink
        v-for="tab in tabs"
        :key="tab.to"
        :to="tab.to"
        class="tab"
        :class="{ active: isActive(tab.to) }"
        :aria-current="isActive(tab.to) ? 'page' : undefined"
      >
        <span class="tab-indicator" aria-hidden="true" />
        <Icon :name="tab.icon" class="tab-icon" aria-hidden="true" />
        <span class="tab-label">{{ tab.short ?? tab.label }}</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<style scoped>
.shell {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}

/* --- Top bar --- */
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: color-mix(in srgb, var(--ink) 88%, transparent);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}
.topbar-inner {
  max-width: var(--content-max);
  margin: 0 auto;
  height: var(--header-h);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.mark {
  display: flex;
  align-items: center;
  gap: 10px;
  border-radius: 6px;
}
.mark-img {
  width: 52px;
  height: auto;
}
.mark-word {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  white-space: nowrap;
}
.mark-red {
  color: var(--red);
}

/* --- Desktop nav (hidden on phones) --- */
.topnav {
  display: none;
}

/* --- Content --- */
.content {
  flex: 1;
  width: 100%;
  max-width: var(--content-max);
  margin: 0 auto;
  padding: 20px 16px calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px) + 24px);
}

/* --- Bottom tab bar (phone-first) --- */
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  height: calc(var(--tabbar-h) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  background: color-mix(in srgb, var(--ink) 92%, transparent);
  backdrop-filter: blur(10px);
  border-top: 1px solid var(--line);
}
.tab {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: var(--steel);
  transition: color var(--t-fast) var(--ease);
}
.tab.active {
  color: var(--chalk);
}
.tab-indicator {
  position: absolute;
  top: 0;
  width: 28px;
  height: 3px;
  border-radius: 0 0 3px 3px;
  background: transparent;
  transition: background var(--t-fast) var(--ease);
}
.tab.active .tab-indicator {
  background: var(--red);
}
.tab-icon {
  font-size: 22px;
}
.tab.active .tab-icon {
  color: var(--red);
}
.tab-label {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.62rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  white-space: nowrap;
}

@media (min-width: 880px) {
  .tabbar {
    display: none;
  }
  .topnav {
    display: flex;
    gap: 4px;
  }
  .topnav-link {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 7px 14px;
    border-radius: var(--r-ctl);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: var(--steel);
    transition:
      color var(--t-fast) var(--ease),
      background var(--t-fast) var(--ease);
  }
  .topnav-link:hover {
    color: var(--chalk);
    background: var(--panel);
  }
  .topnav-link.active {
    color: var(--chalk);
    background: var(--panel);
    box-shadow: inset 0 -2px 0 var(--red);
  }
  .topnav-icon {
    font-size: 17px;
    color: var(--red);
  }
  .content {
    padding-bottom: 48px;
  }
}

@media print {
  .topbar,
  .tabbar {
    display: none;
  }
}
</style>
