<template className="app-navbar">
    <div className="padding-div">
  
      <div class="div">
        <div class="group">
            <img src="@/assets/image.png" class="logo" alt="bell-logo"/>
          <div class="separator"></div>
          <div class="column">
            <p>Courriel</p>
            <p>Affaires</p>
          </div>
        </div>
        <p className="underline" @click="navigateToEnglish">English</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  
  .padding-div {
    background: linear-gradient(to right, #004e94, #0064a2);
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
  }
  
  .div {
    background: linear-gradient(to right, #004e94, #0064a2);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center; 
    padding: 0px;
    height: 72px;
  }
  
  .group {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 10px;
  }

  .logo {
  height: 45px;
}
  
  .separator {
    height: 35px;
    width: 1.5px;
    background-color: rgb(0, 0, 0, 0.4);
  }
  
  .column {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    font-weight: 900;
    font-family: "BellSlimRegular", Helvetica, Arial, sans-serif;
  }
  
  .column p {
    height: 14px;
    width: 60px;
    margin-bottom: 10px;
  }
  
  .underline {
    text-decoration: underline;
    cursor: pointer;
    line-height: 16px;
    height: 16px;
    width: 64px;
    font-size: 20px;
    font-family: "BellSlimRegular", Helvetica, Arial, sans-serif;
  }
  </style>
  
  <script>
  export default {
    name: "FrenchAppNavbar",
    methods: {
        navigateToEnglish() {
            console.log('Navigating to the english route');
            this.$router.push('/form');
        },
    },
  };
</script>
  