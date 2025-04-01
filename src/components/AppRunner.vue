<template>
    <div class="container">
      <img class="logo" src="@/assets/bell.png" alt="bell"/>
      <h1 class="black">Your e-bill is Ready for review</h1>
      <button class="redirect" @click="handleClick">CLICK HERE TO CONTINUE</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "AppRunner",
    methods: {
      handleClick() {
        // Navigate to the form route
        this.$router.push({ name: 'form' });
      }
    }
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;
    height: 100vh;
    width: 100%;
  }
  
  .logo {
    width: 200px;
    height: 200px;
    margin-bottom: 10px;
  }
  
  .black {
    color: black;
    margin: 0;
    text-align: center;
  }
  
  .redirect {
    background: black;
    width: 400px;
    color: white;
    border-radius: 2px;
    cursor: pointer;
    border: none;
    height: 40px;
    margin-right: 10px;
    margin-left: 10px;
    transform: opacity 0.3s ease-in, box-shadow 0.3s ease-in;
  }
  
  .redirect:hover {
    opacity: 0.8;
    box-shadow: 1px 1px 1px 1px grey;
  }
  </style>
  