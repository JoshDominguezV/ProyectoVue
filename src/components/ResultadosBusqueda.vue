<template>
    <div>
      <h2>Definición:</h2>
      <p>{{ definicion }}</p>
  
      <h2>Sinónimos:</h2>
      <ul>
        <li v-for="sinonimo in sinonimos" :key="sinonimo">{{ sinonimo }}</li>
      </ul>
  
      <h2>Antónimos:</h2>
      <ul>
        <li v-for="antonimo in antonimos" :key="antonimo">{{ antonimo }}</li>
      </ul>
  
      <button @click="agregarFavorito">Agregar a Favoritos</button>
    </div>
  </template>
  
  <script>
  export default {
    name: "ResultadosBusqueda",
    props: {
      definicion: String,
      sinonimos: Array,
      antonimos: Array,
    },
    methods: {
      agregarFavorito() {
        // Emitir el evento 'agregarFavorito' cuando se hace clic en el botón
        this.$emit("agregarFavorito");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para el componente de resultados de búsqueda */
  </style>
  