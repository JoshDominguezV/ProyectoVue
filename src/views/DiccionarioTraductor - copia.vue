<template>
  <audio id="sound"></audio>
  <div class="container">
    <div class="search-box">
      <input type="text" placeholder="Type the word here.." v-model="inputWord" />
      <button @click="handleClick">Search</button>
    </div>
    <div class="result">
      <div class="word">
        <h3>{{ word }}</h3>
        <button @click="urlSounds">
          <i class="fas fa-volume-up"></i>
        </button>
      </div>
      <div class="details">
        <p>{{ partOfSpeech }}</p>
        <p>/{{ phonetic }}/</p>
      </div>
      <p class="word-meaning">{{ definition }}</p>
      <p class="word-example">{{ example || '' }}</p>
    </div>
    <br>
    <hr>
    <hr>
    <div>
      <label for="languageSelect">Select Language:</label>
      <select v-model="selectedLanguage">
        <option value="">Selecciona un idioma</option>
        <option v-for="(language, code) in availableLanguages" :value="code">{{ language.name }}</option>
      </select>
      <div>
    <button @click="playAudio"><i class="fas fa-volume-up"></i></button>
  </div>
    </div>
    <p v-if="translation">Translation: {{ translation }}</p>
    <p v-else>No translation yet.</p>
    <p class="word-meaning">{{ definitionTranslation || definition }}</p>
    <p class="word-example">{{ exampleTranslation || example || '' }}</p>
  </div>
</template>

<script>
import axios from 'axios';
import languageData from '@/assets/data.json';

export default {
  data() {
    return {
      inputWord: '',
      word: '',
      partOfSpeech: '',
      phonetic: '',
      definition: '',
      example: '',
      textToTranslate: '', // Variable para almacenar el texto ingresado
      translation: null,
      definitionTranslation: null,
      exampleTranslation: null,
      availableLanguages: [], // Inicialmente nulo hasta que se carguen los idiomas
      selectedLanguage: 'es',
      textSound: null,
      vocesDisponibles: [], // Lista de voces disponibles
      indiceVoz: 0, // Índice de la voz seleccionada
      
    };
  },
  mounted() {
    this.getAvailableLanguages();
    this.cargarVoces();
  },
  methods: {
    getAvailableLanguages() {
      // Obtén los idiomas desde el archivo JSON
      const languageData = require('@/assets/data.json');

      // Crea una estructura de datos adecuada para el select
      // Crea una estructura de datos adecuada para el select
      this.availableLanguages = languageData.translation;

    },

    handleClick() {
      this.getAvailableLanguages();
      this.searchWord(); // Llama a la función de búsqueda
      this.translateText(this.selectedLanguage);
    },

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
            Text: this.inputWord // Usamos el texto ingresado
          }
        ]
      };

      try {
        const response = await axios.request(options);
       

        // Almacena la traducción en la propiedad 'translation' del componente
        this.translation = response.data[0].translations[0].text;
        console.log('Este es el arreglo de traduccion', this.translation);
      } catch (error) {
        console.error(error);
        // Puedes manejar el error de alguna manera en tu aplicación Vue
      }


      // Primero, traduce la definición
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
            Text: this.definition, // Usamos la definición
          },
        ],
      };

      try {
        const definitionResponse = await axios.request(definitionOptions);
        this.definitionTranslation = definitionResponse.data[0].translations[0].text;
      } catch (error) {
        console.error('Error al traducir la definición:', error);
      }

      // Luego, traduce el ejemplo
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
            Text: this.example, // Usamos el ejemplo
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
    searchWord() {
      const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
      fetch(`${url}${this.inputWord}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          this.word = this.inputWord;
          this.partOfSpeech = data[0].meanings[0].partOfSpeech;
          this.phonetic = data[0].phonetic;
          this.definition = data[0].meanings[0].definitions[0].definition;
          this.example = data[0].meanings[0].definitions[0].example || '';
        })
        .catch(() => {
          this.word = "Couldn't Find The Word";
        });
    },
    urlSounds() {
      const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
      fetch(`${url}${this.inputWord}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Que pasa aqui',data);
          const audioData = data[0].phonetics;
          console.log('aqui es', audioData)

          // Encuentra el primer audio no vacío
          let audioUrl = null;
          for (let i = 0; i < audioData.length; i++) {
            if (audioData[i].audio) {
              audioUrl = audioData[i].audio;
              break; // Sal del bucle tan pronto como encuentres un audio no vacío
            }
          }

          if (audioUrl) {
            this.playSound(audioUrl);
          } else {
            console.error('No se encontraron recursos de audio disponibles.');
          }
        })
        .catch((error) => {
          console.error('Error al obtener datos:', error);
        });
    },
    cargarVoces() {
      this.vocesDisponibles = speechSynthesis.getVoices();
      this.indiceVoz = this.vocesDisponibles.findIndex(voz => IDIOMAS_PREFERIDOS.includes(voz.lang));
      if (this.indiceVoz === -1) this.indiceVoz = 0;
    },

    playAudio() {
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
