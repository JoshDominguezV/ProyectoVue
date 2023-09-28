<template>
    <div>
      <input type="text" v-model="palabra" placeholder="Buscar una palabra" />
      <button @click="buscar">Buscar</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "BarraBusqueda",
    data() {
      return {
        palabra: "",
      };
    },
    methods: {
      buscar() {
        // Emitir el evento 'buscarPalabra' con la palabra ingresada
        this.$emit("buscarPalabra", this.palabra);
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para el componente de la barra de búsqueda */
  </style>
  