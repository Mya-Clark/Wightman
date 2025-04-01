import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'
import ModalFormPage from '../views/ModalFormPage.vue'  // Import the page where ModalForm will be displayed
import FrenchModalFormPage from '../views/FrenchModalFormPage.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: ModalFormPage,
    },
    {
      path: '/form/french',
      name: 'french',
      component: FrenchModalFormPage,
    }
  ],
})

router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.path); // Logs the path you are navigating to
  next(); // Allow navigation to continue
});

export default router
