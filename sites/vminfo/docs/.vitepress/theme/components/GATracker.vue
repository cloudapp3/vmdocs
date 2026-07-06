<script setup lang="ts">
import { watch } from 'vue'
import { useRoute } from 'vitepress'
import { trackPageview } from '../ads'

// GA4 only records the first page_view on load; VitePress is a SPA, so route
// changes need an explicit page_view. This sits in the global layout and
// fires once per navigation (only after consent).
const route = useRoute()
watch(
  () => route.path,
  (path) => {
    if (path) trackPageview(path)
  }
)
</script>

<template>
  <span aria-hidden="true" style="display: none" />
</template>
