<script setup lang="ts">
useHead({ title: 'Export — Wolves Playbook' })

const contents = [
  { icon: 'lucide:map', text: 'Every formation, drawn clean' },
  { icon: 'lucide:swords', text: 'Every play vs the 4-4, 4-3, and 5-2' },
  { icon: 'lucide:table', text: 'Assignment tables for all eleven jobs' },
  { icon: 'lucide:route', text: 'The full route tree, 0 through 9' },
]
</script>

<template>
  <div class="export-page">
    <header class="page-head">
      <p class="eyebrow">Print</p>
      <h1>The Paper Playbook</h1>
      <p class="muted lead">
        The same book, on paper &mdash; built straight from the app's data, so the printout and the
        screen can never disagree. Print it, hole-punch it, keep it in the bag.
      </p>
    </header>

    <ul class="contents">
      <li v-for="c in contents" :key="c.text" class="card content-row">
        <Icon :name="c.icon" class="content-icon" aria-hidden="true" />
        <span>{{ c.text }}</span>
      </li>
    </ul>

    <div class="card build">
      <div class="build-text">
        <p class="build-title">Build the printable book</p>
        <p class="build-sub muted">
          One tap &rarr; the whole package on Letter paper. Print it, or &ldquo;Save as PDF&rdquo;.
        </p>
      </div>
      <NuxtLink to="/print/book" class="build-btn" data-export-slot="build-book">
        <Icon name="lucide:printer" aria-hidden="true" />
        Open the book
      </NuxtLink>
    </div>

    <footer class="school">
      <img
        src="/brand/centennial-school.png"
        alt="Centennial High School"
        class="school-logo"
        width="240"
        height="45"
      />
      <p class="muted school-note">Wolves 8th grade feeds Centennial High School football.</p>
    </footer>
  </div>
</template>

<style scoped>
.export-page {
  display: grid;
  gap: 20px;
  max-width: 720px;
  margin: 0 auto;
}
.page-head {
  display: grid;
  gap: 6px;
}
.page-head h1 {
  font-size: 2.2rem;
}
.lead {
  font-size: 0.95rem;
  max-width: 52ch;
}

.contents {
  display: grid;
  gap: 8px;
}
.content-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  font-size: 0.98rem;
}
.content-icon {
  font-size: 20px;
  color: var(--red);
  flex: none;
}

.build {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  flex-wrap: wrap;
}
.build-title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.25rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.build-sub {
  font-size: 0.9rem;
}
.build-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 22px;
  border-radius: var(--r-ctl);
  background: var(--red);
  border: 1px solid var(--red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition:
    background var(--t-fast) var(--ease),
    transform var(--t-fast) var(--ease);
}
.build-btn:hover {
  background: #ef2735;
}
.build-btn:active {
  transform: translateY(1px);
}

.school {
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 18px 0 6px;
  border-top: 1px solid var(--line);
}
.school-logo {
  width: 220px;
  height: auto;
  background: var(--chalk);
  padding: 8px 14px;
  border-radius: var(--r-ctl);
}
.school-note {
  font-size: 0.85rem;
}
</style>
