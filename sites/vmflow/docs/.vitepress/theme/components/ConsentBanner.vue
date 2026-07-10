<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getConsent, setConsent, loadGA } from '../ads'
import { useConsentMessages } from '../i18n'

const show = ref(false)
const msgs = useConsentMessages()

onMounted(() => {
  const c = getConsent()
  if (c === 'accepted') loadGA()
  else if (c === null) show.value = true
})

const accept = () => {
  setConsent('accepted')
  show.value = false
}
const reject = () => {
  setConsent('rejected')
  show.value = false
}
</script>

<template>
  <Transition name="consent">
    <div v-if="show" class="consent-banner" role="dialog" :aria-label="msgs.ariaLabel.value">
      <p class="consent-text">
        {{ msgs.before.value }}
        <a href="/privacy">{{ msgs.privacy.value }}</a>{{ msgs.after.value }}
      </p>
      <div class="consent-actions">
        <button class="btn btn-reject" @click="reject">{{ msgs.reject.value }}</button>
        <button class="btn btn-accept" @click="accept">{{ msgs.accept.value }}</button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.consent-banner {
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translateX(-50%);
  z-index: 100;
  max-width: 720px;
  width: calc(100% - 32px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 18px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-2);
}
.consent-text {
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: var(--vp-c-text-2);
}
.consent-text a {
  color: var(--vp-c-brand);
  text-decoration: underline;
}
.consent-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}
.btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
  cursor: pointer;
  font-size: 13px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.btn-accept {
  background: var(--vp-c-brand);
  color: #fff;
  border-color: var(--vp-c-brand);
}
.consent-enter-active,
.consent-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.consent-enter-from,
.consent-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px);
}
@media (max-width: 640px) {
  .consent-banner {
    flex-direction: column;
    align-items: stretch;
  }
}
</style>
