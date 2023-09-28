<template>
    <div>
      <h2>Palabras Favoritas:</h2>
      <ul>
        <li v-for="favorito in favoritos" :key="favorito">{{ favorito }}</li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    name: "ListaFavoritos",
    props: {
      favoritos: Array,
    },
  };
  </script>
  
  <style scoped>
  /* Estilos para el componente de lista de favoritos */
  </style>
  