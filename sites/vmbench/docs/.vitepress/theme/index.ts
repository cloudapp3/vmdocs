import Teek from 'vitepress-theme-teek';
import 'vitepress-theme-teek/index.css';
import './style.css';
import { h } from 'vue';
import GATracker from './components/GATracker.vue';
import ConsentBanner from './components/ConsentBanner.vue';

export default {
  extends: Teek,
  Layout: () =>
    h(Teek.Layout, null, {
      // GA4 SPA page_view tracker (fires on each route change, after consent).
      'layout-top': () => h(GATracker),
      // Cookie-consent banner shown once, until the visitor chooses.
      'layout-bottom': () => h(ConsentBanner),
    }),
};
