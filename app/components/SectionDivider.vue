<template>
  <!--
    SectionDivider — a quiet rule between big page sections: two hairlines
    fading out from a small Wolves mark in the middle.
  -->
  <div class="divider" aria-hidden="true">
    <span class="rule rule--l" />
    <img src="/brand/wolves-mark.png" alt="" class="pup" width="46" height="31" loading="lazy" />
    <span class="rule rule--r" />
  </div>
</template>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  gap: 18px;
  max-width: 460px;
  margin: 10px auto 44px;
}
.rule {
  flex: 1;
  height: 1px;
}
.rule--l {
  background: linear-gradient(to left, var(--line), transparent);
}
.rule--r {
  background: linear-gradient(to right, var(--line), transparent);
}
.pup {
  opacity: 0.85;
  flex: none;
}
</style>
