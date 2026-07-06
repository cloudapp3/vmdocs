<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { pushAd } from '../ads'
import { adsClient } from '../ads-config'

const props = defineProps<{ slot: string }>()
// While a slot still holds its placeholder ID we render nothing, so unfilled
// slots don't leave blank boxes. The moment a real slot ID is supplied, ads show.
const configured = computed(
  () => !!props.slot && !props.slot.startsWith('0000') && !props.slot.includes('X')
)
onMounted(() => {
  if (configured.value) pushAd()
})
</script>

<template>
  <div v-if="configured" class="ad-slot" aria-label="Advertisement">
    <ins
      class="adsbygoogle"
      style="display: block; min-height: 90px"
      :data-ad-client="adsClient"
      :data-ad-slot="slot"
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  </div>
</template>

<style scoped>
.ad-slot {
  margin: 20px 0;
  overflow: hidden;
  border-radius: 8px;
}
</style>
