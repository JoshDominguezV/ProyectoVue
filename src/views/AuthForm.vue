<template>
    <v-app>
        <v-main>
            <v-container fluid class="form-container">
                <v-row justify="center">
                    <v-col>
                        <transition name="fade" mode="out-in">
                            <v-card :key="isSignUp" class="animate-card-back">
                                <v-card-title>
                                    <h2>{{ isSignUp ? 'Sign Up' : 'Login' }}</h2>
                                </v-card-title>
                                <v-card-text>
                                    <v-form @submit.prevent="isSignUp ? signUp : login">
                                        <v-text-field label="Correo" placeholder="correo@ventaxperto.com" counter
                                            maxlength="70" color="indigo" clearable prepend-inner-icon="mdi-email"
                                            v-model="usuario.email"></v-text-field>
                                        <v-text-field label="Contraseña" placeholder="*********" counter maxlength="15"
                                            color="indigo" clearable type="password" prepend-inner-icon="mdi-key"
                                            v-model="usuario.password"></v-text-field>

                                        <v-btn type="submit" class="btn" block @click="login">{{ !isSignUp ? 'Sign Up' :
                                            'Login' }}</v-btn>
                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <div class="sign-link">
                                        <p>
                                            {{ !isSignUp ? "Already have an account?" : "Don't have an account?" }}
                                            <a @click="toggleView">{{ !isSignUp ? 'Sign In' : 'Sign Up' }}</a>
                                        </p>
                                    </div>
                                </v-card-actions>
                            </v-card>
                        </transition>
                        <transition name="fade" mode="out-in">
                            <v-card :key="isSignUp ? 'signUp' : 'login'" class="animate-card">
                                <v-card-title>
                                    <h2>{{ isSignUp ? 'Sign Up' : 'Login' }}</h2>
                                </v-card-title>
                                <v-card-text>
                                    <v-form @submit.prevent="isSignUp ? signUp : login">
                                        <v-text-field label="Nombre" placeholder="Nombre" counter maxlength="50"
                                            color="indigo" clearable prepend-inner-icon="mdi-account-star"
                                            v-model="usuario.name" v-if="isSignUp"></v-text-field>
                                        <v-text-field label="Correo" placeholder="correo@ventaxperto.com" counter
                                            maxlength="70" color="indigo" clearable prepend-inner-icon="mdi-email"
                                            v-model="usuario.email"></v-text-field>
                                        <v-text-field label="Contraseña" placeholder="*********" counter maxlength="15"
                                            color="indigo" clearable type="password" prepend-inner-icon="mdi-key"
                                            v-model="usuario.password"></v-text-field>
                                        <v-btn type="submit" class="btn" block @click="isSignUp ? signUp() : login()">
                                            {{ isSignUp ? 'Sign Up' : 'Login' }}
                                        </v-btn>

                                    </v-form>
                                </v-card-text>
                                <v-card-actions>
                                    <div class="sign-link">
                                        <p>
                                            {{ isSignUp ? "Already have an account?" : "Don't have an account?" }}
                                            <a @click="toggleView">{{ isSignUp ? 'Sign In' : 'Sign Up' }}</a>
                                        </p>
                                        <v-btn type="submit" class="btn" block to="/home">
                                            Invitado
                                        </v-btn>
                                    </div>
                                    
                                </v-card-actions>
                            </v-card>
                        </transition>
                    </v-col>
                </v-row>
                <v-snackbar :timeout="1500" color="red-darken-4" v-model="alertaEstado">
                    {{ alertaMensaje }}
                </v-snackbar>
            </v-container>
        </v-main>
    </v-app>
</template>
  
  
  
<script>
// Importar axios
import axios from 'axios'


export default {
    name: 'AuthForm',
    data() {
        return {
            isSignUp: false,
            // Variable de formulario
            usuario: {
                email: '',
                password: ''
            },
            // Variables para controlar la alerta
            alertaEstado: false,
            alertaMensaje: ''
        };
    },
    methods: {
        toggleView() {
            this.isSignUp = !this.isSignUp;
        },
        signUp() {
    // Validar que los campos requeridos estén completos antes de hacer la solicitud
    if (!this.usuario.email || !this.usuario.password) {
        this.alertaEstado = true;
        this.alertaMensaje = "Por favor, complete todos los campos requeridos.";
        return;
    }

    // Crear un objeto que contenga los datos del usuario para el registro
    const userData = {
        name: this.usuario.name, 
        email: this.usuario.email,
        password: this.usuario.password
    };

    // Realizar la solicitud de registro al servidor (usando axios u otra biblioteca)
    axios.post("http://127.0.0.1:8000/api/usuario/register", userData)
        .then(response => {
            if (response.status === 200) {
                // Registro exitoso, puedes redirigir al usuario a la página de inicio de sesión
                this.alertaEstado = true;
                this.alertaMensaje = "Registro exitoso. Ahora puedes iniciar sesión.";
                this.$router.push('/home'); // Redirigir al usuario a la página de inicio 
            }
        })
        .catch(error => {
            // Manejar errores en caso de que el registro falle
            this.alertaEstado = true;
            if (error.response && error.response.data) {
                this.alertaMensaje = error.response.data.message;
            } else {
                this.alertaMensaje = "Ha ocurrido un error en el registro.";
            }
        });
},

        // Petición para realizar login
        login() {
            axios.post('http://127.0.0.1:8000/api/usuario/login', this.usuario)
                .then(response => {
                    // console.log(response)
                    if (response.status == 200) {
                        // Se extrae el usuario y token de 
                        // la respuesta que retorna el endpoint de login 
                        let datos = {
                            usuario: response.data.data.name,
                            token: response.data.token,
                            id: response.data.data.id,
                        }

                        localStorage.setItem('token', datos.token);
                        // Guardando datos en el storage y el state
                        this.$store.dispatch('login', datos)
                        // Redireccionando a la pantalla de bienvenida
                        this.$router.push('/home')
                    }
                })
                .catch(error => {
                    console.log('Ha ocurrido un error ' + error)
                    this.alertaEstado = true
                    // Usuario no autorizado 
                    if (error.response.status == 401) {
                        this.alertaMensaje = error.response.data.data
                    } else {
                        this.alertaMensaje = '¡Ups! Algo salió mal'
                    }
                })
        }
    },
};
</script>
  
<style>
.transparent-container {
    background-color: transparent;
}


.fade-back-leave-active {
    transition: all 0.5s;
}

.fade-back-leave-to {
    opacity: 0;
    transform: translateX(-50px) rotate(7deg);
}

.form-container {
    position: relative;
    height: 100%;
    width: 100%;
    margin: 30px 0 100px;
    padding: auto;
}

.animate-card-back {
    transform: translateX(-10px) rotate(10deg);
    animation-delay: 0.1s;
    margin: 35px;
    top: 0;
    left: -5px;
    z-index: 0;
    height: 500px;


}

.animate-card {
    transform: rotate(-3deg);
    animation: rotateForm 0.7s ease-in-out forwards;
    animation-delay: 0.1s;
    position: absolute;
    margin: 40px;
    height: 500px;
    top: 0;
    left: 0;
    z-index: 1;
}

@keyframes rotateForm {
    0% {
        transform: rotate(7deg);
    }

    100% {
        transform: rotate(0);
    }
}



@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');



h2 {
    font-size: 30px;
    color: #555;
    text-align: center;
}


.input-group input {
    width: 80%;
    height: 40px;
    font-size: 16px;
    color: #333;
    padding: 0 100px;
    background: transparent;
    border: 1px solid #333;
    outline: none;
    border-radius: 5px;
}


.input-group input:focus~label,
.input-group input:valid~label {
    top: 0;
    font-size: 12px;
    background: #fff;
}

.forgot-pass {
    margin: -15px 0 15px;
}

.forgot-pass a {
    color: #333;
    font-size: 14px;
    text-decoration: none;
}

.forgot-pass a:hover {
    text-decoration: underline;
}

.btn {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
    width: 1px;
    margin-right: 10%;
    height: 40px;
    background: linear-gradient(to right, #2196f3, #e91e63);
    box-shadow: 0 2px 10px rgba(0, 0, 0, .4);
    font-size: 16px;
    color: #fff;
    font-weight: 50;
    cursor: pointer;
    border-radius: 10px;
    border: none;
    outline: none;
}

.sign-link {
    font-size: 15px;
    text-align: center;
    margin: 10px 100px;
}

.sign-link p {
    color: #333;
}

.sign-link p a {
    color: #e91e63;
    text-decoration: none;
    font-weight: 600;
}

.sign-link p a:hover {
    text-decoration: underline;
}
</style>
  