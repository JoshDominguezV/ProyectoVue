<template>
  <div>
    <audio id="sound"></audio>
    <div class="container">
      <!-- Input Container -->
      <div class="search-box">
        <!-- Input para ingresar una palabra -->
        <input type="text" placeholder="Ingresa la palabra aquí..." v-model="inputWord" />
        <!-- Botón para iniciar la traducción -->
        <button @click="handleClick">Traducir</button>
      </div>
      <div class="result">
        <div class="word">
          <!-- Mostrar el idioma detectado -->
          <p>Idioma detectado: {{ detectLanguage }}</p>
          <!-- Mostrar la palabra traducida -->
          <h3>{{ wordTraslate }}</h3>
          <!-- Botón para reproducir audio de la palabra traducida -->
          <button @click="playAudioInput">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
        <div class="details">
          <!-- Mostrar la definición traducida o la original -->
          <p class="word-meaning">{{ definitionTraslate || definition }}</p>
          <!-- Mostrar el ejemplo traducido o el original -->
          <p class="word-example">{{ exampleTraslate || example || '' }}</p>
        </div>
      </div>
      <!-- Output Container -->
      <div class="search-box">
        <!-- Título de la sección de traducción -->
        <h2>Traducción</h2>
        <!-- Etiqueta y lista desplegable para seleccionar un idioma de traducción -->
        <label for="languageSelect">Selecciona un idioma:</label>
        <select v-model="selectedLanguage">
          <option value="">Selecciona un idioma</option>
          <!-- Generar opciones para cada idioma disponible -->
          <option v-for="(language, code) in availableLanguages" :value="code">{{ language.name }}</option>
        </select>
        <div>
          <!-- Botón para reproducir audio de la traducción -->
          <button @click="playAudioOutput">
            <i class="fas fa-volume-up"></i>
          </button>
        </div>
      </div>
      <!-- Mostrar la traducción o un mensaje si no hay traducción -->
      <p v-if="translation">Traducción: {{ translation }}</p>
      <p v-else>No hay traducción aún.</p>
      <!-- Mostrar la definición traducida o la original -->
      <p class="word-meaning">{{ definitionTranslation || definition }}</p>
      <!-- Mostrar el ejemplo traducido o el original -->
      <p class="word-example">{{ exampleTranslation || example || '' }}</p>
    </div>
  </div>
</template>

<script>
// Importar la librería Axios para realizar solicitudes HTTP
import axios from 'axios';
// Importar datos de idioma desde un archivo JSON
import languageData from '@/assets/data.json';

export default {
  data() {
    return {
      // Variables utilizadas en el componente
      inputWord: '',
      wordTraslate: null,
      partOfSpeech: '',
      phonetic: '',
      definitionTraslate: '',
      exampleTraslate: '',
      textToTranslate: '',
      translation: null,
      definitionTranslation: null,
      exampleTranslation: null,
      availableLanguages: [], // Lista de idiomas disponibles
      selectedLanguage: 'es', // Idioma seleccionado para la traducción
      textSound: null,
      vocesDisponibles: [], // Lista de voces de texto disponibles
      indiceVoz: 0, // Índice de la voz seleccionada
      traslateToEnLanguaje: '', // Traducción al inglés
      detectLanguage: '', // Idioma detectado automáticamente
    };
  },
  mounted() {
    // Inicializar datos al cargar el componente
    this.getAvailableLanguages(); // Obtener la lista de idiomas disponibles
    this.cargarVoces(); // Cargar las voces de texto disponibles
  },
  methods: {
    handleClick() {
      // Realizar las siguientes acciones al hacer clic en el botón "Traducir"
      this.translateTextAndDetectLanguage(); // Traducir y detectar el idioma
      this.traslateToEn(); // Traducir al inglés
      this.getAvailableLanguages(); // Obtener la lista de idiomas disponibles
      this.translateText(this.selectedLanguage); // Traducir al idioma seleccionado
    },
    cargarVoces() {
      // Cargar las voces de texto disponibles
      this.vocesDisponibles = speechSynthesis.getVoices();
      // Establecer el índice de la voz preferida
      this.indiceVoz = this.vocesDisponibles.findIndex(voz => IDIOMAS_PREFERIDOS.includes(voz.lang));
      if (this.indiceVoz === -1) this.indiceVoz = 0; // Usar la primera voz si no se encuentra la preferida
    },
    ///////////Input Methods///////////
    async translateTextAndDetectLanguage() {
      // Detectar el idioma del texto ingresado por el usuario
      const detectOptions = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/Detect',
        params: {
          'api-version': '3.0'
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'b36a79ac92msh6504e17d2821d79p18201ejsn6afb4893beec',
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [
          {
            Text: this.inputWord
          }
        ]
      };

      try {
        const detectResponse = await axios.request(detectOptions);
        this.detectLanguage = detectResponse.data[0].language;
        console.log('Idioma detectado:', this.detectLanguage);
      } catch (error) {
        console.error('Error al detectar el idioma:', error);
      }

      // Traducir la palabra, definición y ejemplo al idioma detectado
      const translationOptions = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {
          'to[0]': this.detectLanguage,
          'api-version': '3.0',
          profanityAction: 'NoAction',
          textType: 'plain'
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'b36a79ac92msh6504e17d2821d79p18201ejsn6afb4893beec',
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [
          {
            Text: this.inputWord // Texto a traducir
          }
        ]
      };

      try {
        const translationResponse = await axios.request(translationOptions);
        this.wordTraslate = translationResponse.data[0].translations[0].text;
        console.log('Traducción a idioma detectado:', this.wordTraslate);

        // Traducir la definición al idioma detectado
        const definitionOptions = {
          method: 'POST',
          url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
          params: {
            'to[0]': this.detectLanguage,
            'api-version': '3.0',
            profanityAction: 'NoAction',
            textType: 'plain',
          },
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'b36a79ac92msh6504e17d2821d79p18201ejsn6afb4893beec',
            'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
          },
          data: [
            {
              Text: this.definition, // Texto a traducir (definición)
            },
          ],
        };

        try {
          const definitionResponse = await axios.request(definitionOptions);
          this.definitionTraslate = definitionResponse.data[0].translations[0].text;
        } catch (error) {
          console.error('Error al traducir la definición al idioma detectado:', error);
        }

        // Traducir el ejemplo al idioma detectado
        const exampleOptions = {
          method: 'POST',
          url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
          params: {
            'to[0]': this.detectLanguage,
            'api-version': '3.0',
            profanityAction: 'NoAction',
            textType: 'plain',
          },
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': 'b36a79ac92msh6504e17d2821d79p18201ejsn6afb4893beec',
            'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
          },
          data: [
            {
              Text: this.example, // Texto a traducir (ejemplo)
            },
          ],
        };

        try {
          const exampleResponse = await axios.request(exampleOptions);
          this.exampleTraslate = exampleResponse.data[0].translations[0].text;
        } catch (error) {
          console.error('Error al traducir el ejemplo al idioma detectado:', error);
        }
      } catch (error) {
        console.error('Error al traducir al idioma detectado:', error);
      }
    },
    async traslateToEn() {
      const options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {
          'to[0]': 'en',
          'api-version': '3.0',
          profanityAction: 'NoAction',
          textType: 'plain'
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'b36a79ac92msh6504e17d2821d79p18201ejsn6afb4893beec',
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [
          {
            Text: this.inputWord
          }
        ]
      };

      try {
        const response = await axios.request(options);
        this.traslateToEnLanguaje = response.data[0].translations[0].text;
        console.log('Traducción al inglés:', this.traslateToEnLanguaje);
      } catch (error) {
        console.error('Error al traducir al inglés:', error);
      }
      const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
      fetch(`${url}${this.traslateToEnLanguaje}`)
        .then((response) => response.json())
        .then((data) => {
          this.word = this.traslateToEnLanguaje;
          this.partOfSpeech = data[0].meanings[0].partOfSpeech;
          this.phonetic = data[0].phonetic;
          this.definition = data[0].meanings[0].definitions[0].definition;
          this.example = data[0].meanings[0].definitions[0].example || '';
        })
        .catch(() => {
          this.word = "No se pudo encontrar la palabra";
        });
    },
    playAudioInput() {
      // Reproducir audio de la palabra traducida
      if (!this.wordTraslate || !this.selectedLanguage) {
        console.error('Falta texto o idioma seleccionado.');
        return;
      }
      const mensaje = new SpeechSynthesisUtterance();
      mensaje.voice = this.vocesDisponibles[this.indiceVoz];
      mensaje.volume = 1;
      mensaje.rate = 1;
      mensaje.text = this.translation;
      mensaje.pitch = 1;
      speechSynthesis.speak(mensaje);
    },

    ///////////Output Methods///////////
    async translateText(selectedLanguage) {
      const options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {
          'to[0]': selectedLanguage,
          'api-version': '3.0',
          profanityAction: 'NoAction',
          textType: 'plain'
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'b36a79ac92msh6504e17d2821d79p18201ejsn6afb4893beec',
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [
          {
            Text: this.inputWord
          }
        ]
      };

      try {
        const response = await axios.request(options);
        this.translation = response.data[0].translations[0].text;
        console.log('Traducción:', this.translation);
      } catch (error) {
        console.error('Error al traducir:', error);
      }

      const definitionOptions = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {
          'to[0]': selectedLanguage,
          'api-version': '3.0',
          profanityAction: 'NoAction',
          textType: 'plain',
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'b36a79ac92msh6504e17d2821d79p18201ejsn6afb4893beec',
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
        },
        data: [
          {
            Text: this.definition,
          },
        ],
      };

      try {
        const definitionResponse = await axios.request(definitionOptions);
        this.definitionTranslation = definitionResponse.data[0].translations[0].text;
      } catch (error) {
        console.error('Error al traducir la definición:', error);
      }

      const exampleOptions = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {
          'to[0]': selectedLanguage,
          'api-version': '3.0',
          profanityAction: 'NoAction',
          textType: 'plain',
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': 'b36a79ac92msh6504e17d2821d79p18201ejsn6afb4893beec',
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
        },
        data: [
          {
            Text: this.example,
          },
        ],
      };

      try {
        const exampleResponse = await axios.request(exampleOptions);
        this.exampleTranslation = exampleResponse.data[0].translations[0].text;
      } catch (error) {
        console.error('Error al traducir el ejemplo:', error);
      }
    },
    getAvailableLanguages() {
      // Obtener la lista de idiomas disponibles desde un archivo JSON
      const languageData = require('@/assets/data.json');
      this.availableLanguages = languageData.translation;
    },
    playAudioOutput() {
      // Reproducir audio de la traducción
      if (!this.translation || !this.selectedLanguage) {
        console.error('Falta texto o idioma seleccionado.');
        return;
      }
      const mensaje = new SpeechSynthesisUtterance();
      mensaje.voice = this.vocesDisponibles[this.indiceVoz];
      mensaje.volume = 1;
      mensaje.rate = 1;
      mensaje.text = this.translation;
      mensaje.pitch = 1;
      speechSynthesis.speak(mensaje);
    },
  },
};
</script>

<style></style>
