import Teek from 'vitepress-theme-teek';
import 'vitepress-theme-teek/index.css';
import './style.css';
import { h } from 'vue';
import AdSlot from './components/AdSlot.vue';
import ConsentBanner from './components/ConsentBanner.vue';
import { slots } from './ads-config';

export default {
  extends: Teek,
  Layout: () =>
    h(Teek.Layout, null, {
      // Below doc content — a horizontal ad unit appears after you finish reading.
      'doc-bottom': () => h(AdSlot, { slot: slots.docBottom }),
      // Bottom of the right outline column.
      'aside-bottom': () => h(AdSlot, { slot: slots.aside }),
      // Cookie-consent banner shown once, until the visitor chooses.
      'layout-bottom': () => h(ConsentBanner),
    }),
};
