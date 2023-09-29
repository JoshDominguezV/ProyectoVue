<template>
  <audio id="sound"></audio>
  <div class="container">
    <div class="search-box">
      <input
        type="text"
        placeholder="Type the word here.."
        v-model="inputWord"
        @input="searchWords"
      />
      <button @click="handleClick">Search</button>



       <!-- ... palabras guardadas -->
      <button @click="saveWord">Save Word</button>
    </div>
    <div class="result">
      <div class="word">
        <h3>{{ word }}</h3>
        <button @click="playSound">

          <i class="fas fa-volume-up"></i>
        </button>
      </div>
      <div class="details">
        <p>{{ partOfSpeech }}</p>
        <p>/{{ phonetic }}/</p>
      </div>
      <p class="word-meaning">{{ definition }}</p>
      <p class="word-example">{{ example || '' }}</p>
      <p v-if="translation">Translation: {{ translation }}</p>
      <p v-else>No translation yet.</p>
    </div>



     <!-- ... div para las palabras -->
    <div class="saved-words">
    <h2>palabras guardadas</h2>
    <ul>
      <li v-for="savedWord in savedWords" :key="savedWord">{{ savedWord }}</li>
    </ul>
  </div>
  <div class="synonyms">
      <h2>sinonimos</h2>
      <ul>
        <li v-for="synonym in synonyms" :key="synonym">{{ synonym }}</li>
      </ul>
    </div>
    <div class="antonyms">
      <h2>antonimos</h2>
      <ul>
        <li v-for="antonym in antonyms" :key="antonym">{{ antonym }}</li>
      </ul>
    </div>

  </div>

</template>
<script>
import axios from 'axios';
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

      ///////////////////////////////////////////////
      savedWords: [],  //array de las palabras
      synonyms: [], // array para los sinonimos
      antonyms: [], // array para los antónimos
    };
  },
  methods: {
    handleClick() {
      this.searchWord(); // Llama a la primera función
      this.translateText(); // Llama a la segunda función
    },
    ///////////
    searchWords() {
      this.searchSynonyms(); // Buscar sinónimos
      this.searchAntonyms(); // Buscar antónimos
    },
    
    async translateText() {
      const options = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
        params: {
          'to[0]': 'es',
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
        console.log(response.data);

        // Almacena la traducción en la propiedad 'translation' del componente
        this.translation = response.data[0].translations[0].text;
      } catch (error) {
        console.error(error);
        // Puedes manejar el error de alguna manera en tu aplicación Vue
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
          this.playSound(`https:${data[0].phonetics[0].audio}`);
        })
        .catch(() => {
          this.word = "Couldn't Find The Word";
        });
    },
    playSound(audioUrl) {
      const sound = new Audio(audioUrl);
      sound.addEventListener('error', (error) => {
        console.error('Error al cargar el recurso de audio:', error);
        // Puedes mostrar un mensaje de error al usuario aquí
      });

      sound.addEventListener('canplay', () => {
        // El audio está listo para reproducirse
        sound.play();
      });
    },
    /////////////////////////////////////////////////////////////
    //para las palabras guardadasa
    saveWord() {
      if (this.inputWord && !this.savedWords.includes(this.inputWord)) {
        this.savedWords.push(this.inputWord);
      }
    },
    //para los sinonimos
    async searchSynonyms() {
      try {
        const response = await axios.get(`https://api.datamuse.com/words?rel_syn=${this.inputWord}`);
        this.synonyms = response.data.map(item => item.word);
      } catch (error) {
        console.error(error);
      }
    },
    //para los antonimos
    async searchAntonyms() {
      try {
        const response = await axios.get(`https://api.datamuse.com/words?rel_ant=${this.inputWord}`);
        this.antonyms = response.data.map(item => item.word);
      } catch (error) {
        console.error(error);
      }
    },
    ////////////////////////////////////
  },
};


</script>
<style>
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}

*:not(i) {
  font-family: "Poppins", sans-serif;
}

body {
  background-color: #ae9cff;
}

.container {
  background-color: #ffffff;
  width: 90vmin;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  padding: 80px 50px;
  border-radius: 10px;
  box-shadow: 0 20px 40px rgba(38, 33, 61, 0.2);
}

.search-box {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.search-box input {
  padding: 5px;
  width: 70%;
  border: none;
  outline: none;
  border-bottom: 3px solid #ae9cff;
  font-size: 16px;
}

.search-box button {
  padding: 15px 0;
  width: 25%;
  background-color: #ae9cff;
  border: none;
  outline: none;
  color: #ffffff;
  border-radius: 5px;
}

.result {
  position: relative;
}

.result h3 {
  font-size: 30px;
  color: #1f194c;
}

.result .word {
  display: flex;
  justify-content: space-between;
  margin-top: 80px;
}

.result button {
  background-color: transparent;
  color: #ae9cff;
  border: none;
  outline: none;
  font-size: 18px;
}

.result .details {
  display: flex;
  gap: 10px;
  color: #b3b6d4;
  margin: 5px 0 20px 0;
  font-size: 14px;
}

.word-meaning {
  color: #575a7b;
}

.word-example {
  color: #575a7b;
  font-style: italic;
  border-left: 5px solid #ae9cff;
  padding-left: 20px;
  margin-top: 30px;
}

.error {
  margin-top: 80px;
  text-align: center;
}</style>


