 <template>
    <div class="french-modal-form-page">
      <FrenchAppNavbar />
      <FrenchMainContainer />
    </div>
  </template>
  
  <script>
  import FrenchAppNavbar from '@/components/FrenchAppNavbar.vue';
  import FrenchMainContainer from '@/components/FrenchMainContainer.vue';
  
  export default {
     name: 'FrenchModalFormPage',
    components: {
      FrenchAppNavbar,
      FrenchMainContainer,
    },
   
  };
  </script>
  
  <style scoped>
  .french-modal-form-page {
    display: flex;
    flex-direction: column;
    min-height: 100vh; 
    width: 100%;     
    box-sizing: border-box;
  }
  
  /* Ensure AppNavbar doesn't shrink and takes fixed height */
  .french-modal-form-page > FrenchAppNavbar {
    flex-shrink: 0; 
  }
  
  
  .french-modal-form-page > FrenchMainContainer {
    flex-grow: 1;     
    display: flex;   
    flex-direction: column;  
  }
  </style>