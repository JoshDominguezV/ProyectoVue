<template>
  <v-app class="transparent-container">
    <v-main class="transparent-container">
      <v-container fluid class="transparent-container">
        <v-layout justify-center align-center class="transparent-container">
          <v-flex xs12 class="transparent-container">
            <v-row>
              <v-col cols="12" sm="12" class="text-right">
                <template v-if="this.$store.getters.getUsuario !== null">
                  <v-btn prepend-icon="mdi-logout" @click="logout" :class="{ 'custom-button': true }">Logout</v-btn>
                </template>
              </v-col>
            </v-row>
            <router-view class="transparent-container" />
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  }),
  methods: {
    // Este método realiza el cierre de sesión
    logout() {
      localStorage.removeItem('token');
      // Vaciando el estado de la aplicación y el storage
      this.$store.dispatch('logout')
      // Redireccionando al login
      this.$router.push('/')
    },
    // Este método verifica si hay sesión para mantener o expulsar al usuario de la aplicación
    validarAcceso() {
      let datos = localStorage.getItem('userData');
      let token  =localStorage.getItem('token');
      if (datos && token) {
        // Si hay data en el storage se valida el acceso
        this.$store.dispatch('login', {token});
        this.$store.dispatch('login', JSON.parse(datos));
        this.$router.push('/home')
      } else {
        // Si no hay data se redirecciona al login
        this.$router.push('/')
      }
    }
  },
  created() {
    // El método se ejecuta cada vez que el componente se crea
    this.validarAcceso()
  }
};
</script>

<style >
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');

.transparent-container {
  background-color: transparent;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(#2196f3, #1edce9);
  overflow: hidden;
}

.wrapper {
  position: relative;
  width: 400px;
  height: 525px;
}

.form-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, .2);
}
.custom-button{
  position: relative;
  top: 0;
  left: 0;
  right: 0;
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

</style>
