import VueEasyLightbox from 'vue-easy-lightbox/dist/vue-easy-lightbox.esm.min.js'


// we globally register our component with Vue
export default ({ app }) => {
  app.component('VueEasyLightbox', VueEasyLightbox)
}
