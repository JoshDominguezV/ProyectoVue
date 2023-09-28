<template>
    <audio id="sound"></audio>
    <div class="container">
      <div class="search-box">
        <input
          type="text"
          placeholder="Type the word here.."
          v-model="inputWord"
        />
        <button @click="searchWord">Search</button>
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
      </div>
    </div>
  </template>
  <script>
  export default {
    data() {
      return {
        inputWord: '',
        word: '',
        partOfSpeech: '',
        phonetic: '',
        definition: '',
        example: '',
      };
    },
    methods: {
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
            this.playSound(`https:${data[0].phonetics[1].audio}`);
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
}
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
}
</style>
