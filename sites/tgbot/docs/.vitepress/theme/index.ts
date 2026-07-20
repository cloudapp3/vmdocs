import { useData } from 'vitepress';
import Teek, { en, zhCn } from 'vitepress-theme-teek';
import 'vitepress-theme-teek/index.css';
import { defineComponent, h } from 'vue';
import './style.css';

const TgbotLayout = defineComponent({
  setup() {
    const { lang } = useData();

    return () =>
      h(Teek.Layout, {
        locale: lang.value.toLowerCase().startsWith('zh') ? zhCn : en,
      });
  },
});

export default {
  extends: Teek,
  Layout: TgbotLayout,
};
