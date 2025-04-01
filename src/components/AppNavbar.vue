<template className="app-navbar">
  <div class="padding-div">

    <div class="div">
      <div class="group">
        <img src="@/assets/roundcube_logo.png" class="logo" alt="wightman-logo" />
      </div>
      <div></div>
      <!-- <p className="underline" @click="navigateToFrench">Français</p> -->
    </div>
  </div>
</template>

<style scoped>
.padding-div {
  background: #f6f6f6;
  padding: 10px;
  padding-left: 20px;
  padding-right: 20px;
}

.div {
  background: #f6f6f6;
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

@media (max-width: 768px) {
  .padding-div {
    padding-left: 5px;
    padding-right: 5px;
  }

  .logo {
    height: 45px;
    width: 100px;
  }

}
</style>

<script>
export default {
  name: "AppNavbar",
  methods: {
    navigateToFrench() {
      console.log('Navigating to French Modal Form Page');
      this.$router.push('/form/french'); // Redirect to FrenchModalFormPage
    },
  },
};
</script>
