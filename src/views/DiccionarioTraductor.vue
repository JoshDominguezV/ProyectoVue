<template>
  <v-app>
    <audio id="sound"></audio>
    <v-container>
      <v-row>
        <v-col cols="12" sm="6">
          <h3>Bienvenid@ {{ this.$store.getters.getUsuario }}</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <!-- Contenedor de entrada -->
          <v-text-field v-model="inputWord" label="Ingresa la palabra aquí..."></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn @click="guardarPalabra" class="mb-3" :class="{ 'custom-button': true }">Guardar Palabra</v-btn>
          <span></span>
          <v-btn @click="mostrarPalabrasGuardadas" class="mb-3" :class="{ 'custom-button': true }">Ver Palabras
            Guardadas</v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6" class="text-right">
          <h3>Idioma a traducir:</h3>
        </v-col>
        <v-col cols="12" sm="6">
          <select v-model="selectedLanguage">
            <option value="Selecciona">Selecciona un idioma</option>
            <option v-for="(language, code) in availableLanguages" :value="code" :key="code">{{ language.name }}</option>
          </select>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="6">
          <!-- Botones para consumo -->
          <v-card>
            <v-card-title>
              {{ wordTraslate }}
              <v-btn @click="playAudioInput">
                <span class="mdi mdi-volume-high"></span>
              </v-btn>
            </v-card-title>
            <v-card-subtitle>
              Idioma detectado:
              <select v-model="detectLanguage">
                <option v-for="(language, code) in detectLanguagesSelect" :value="code" :key="code">{{ language.name }}
                </option>
              </select>
            </v-card-subtitle>
            <v-card-text>
              {{ definitionTraslate || definition }}
            </v-card-text>
            <v-card-actions>
              {{ exampleTraslate || example || '' }}
            </v-card-actions>
            <v-row>
              <v-col cols="6">
                <v-card>
                  <v-card-actions>
                    <div class="synonyms">
                      <h2>Antónimos</h2>
                      <v-list>
                        <v-list-item v-for="(antonym, index) in translatedAntonyms.slice(0, 5)" :key="index">
                          <v-list-item-content>
                            <v-list-item-title>{{ antonym }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card>
                  <v-card-actions>
                    <div class="synonyms">
                      <h2>Sinónimos</h2>
                      <v-list>
                        <v-list-item v-for="(synonym, index) in translatedSynonyms.slice(0, 5)" :key="index">
                          <v-list-item-content>
                            <v-list-item-title>{{ synonym }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <!-- Contenedor de salida -->
          <v-card>
            <v-card-title>
              {{ translation }}
              <v-btn @click="playAudioOutput">
                <span class="mdi mdi-volume-high"></span>
              </v-btn>
            </v-card-title>
            <v-card-subtitle></v-card-subtitle>
            <v-card-text>
              {{ definitionTranslation || definition }}
            </v-card-text>
            <v-card-actions>
              {{ exampleTranslation || example || '' }}
            </v-card-actions>
            <v-row>
              <v-col cols="6">
                <v-card>
                  <v-card-actions>
                    <div class="synonyms">
                      <h2>Antónimos</h2>
                      <v-list>
                        <v-list-item v-for="(antonym, index) in translatedAntonymsDetect.slice(0, 5)" :key="index">
                          <v-list-item-content>
                            <v-list-item-title>{{ antonym }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card>
                  <v-card-actions>
                    <div class="synonyms">
                      <h2>Sinónimos</h2>
                      <v-list>
                        <v-list-item v-for="(synonym, index) in translatedSynonymsDetect.slice(0, 5)" :key="index">
                          <v-list-item-content>
                            <v-list-item-title>{{ synonym }}</v-list-item-title>
                          </v-list-item-content>
                        </v-list-item>
                      </v-list>
                    </div>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Desplazamientos -->
    <v-snackbar v-model="alertaPvacia" :timeout="3000" :top="true" color="orange-darken-4">
      {{ mensajePvacia }}
    </v-snackbar>
    <v-snackbar v-model="alertaVacia" :timeout="3000" :top="true" color="orange-darken-4">
      {{ mensajeVacia }}
    </v-snackbar>
    <v-snackbar v-model="alertaGuardado" :timeout="3000" color="green-darken-4">
      {{ mensaje }}
    </v-snackbar>
    <v-snackbar v-model="alertaEliminacion" :timeout="3000" color="red-darken-4">
      {{ mensajeEliminacion }}
    </v-snackbar>
    <v-dialog v-model="dialogPalabras" max-width="600">
      <v-card>
        <v-card-title>Palabras Guardadas</v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item-group v-if="palabrasGuardadas.length > 0">
              <v-list-item v-for="(palabra, index) in palabrasGuardadas" :key="index">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-btn variant="plain" @click="seleccionarPalabraGuardada(palabra.palabra)">{{ palabra.palabra
                    }}</v-btn>
                  </v-list-item-title>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn @click="eliminarPalabra(palabra.id)">Eliminar</v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list-item-group>
            <v-list-item v-else>
              <v-list-item-content>No hay palabras guardadas.</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialogPalabras = false" :class="{ 'custom-button': true }">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Modal para la eliminacion -->
    <v-dialog v-model="mostrarModalConfirmacion" max-width="600">
      <v-card>
        <v-card-title class="headline">Confirmación</v-card-title>
        <v-card-text>{{ mensajeConfirmacion }}</v-card-text>
        <v-card-actions>
          <v-btn @click="confirmarEliminarPalabra" :class="{ 'custom-button': true }">Confirmar</v-btn>
          <v-btn @click="mostrarModalConfirmacion = false" :class="{ 'custom-button': true }">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Modal para la alerta -->
    <v-dialog v-model="mostrarModal" max-width="600">
      <v-card>
        <v-card-title class="headline">Alerta</v-card-title>
        <v-card-text>
          Por favor, inicia sesión o regístrate para realizar esta acción.
        </v-card-text>
        <v-card-actions>
          <v-btn @click="irALogin" :class="{ 'custom-button': true }">Ir a Login</v-btn>
          <v-btn @click="cancelarAccion" :class="{ 'custom-button': true }">Cancelar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- Indicador de carga -->
    <div v-if="isLoading" class="loading-indicator">
      Cargando...
    </div>
  </v-app>
</template>

<script>


import axios from 'axios';

const IDIOMAS_PREFERIDOS = ['es-ES', 'es-US'];
//const API_KEY = 'b36a79ac92msh6504e17d2821d79p18201ejsn6afb4893beec'; //Josue
const API_KEY = '3297a65d75msh3cb3fdbe5ae003cp1b38fdjsn79917f68ec6f';  //Gama
//const API_KEY = '4061271065msh8170cd022a7b775p14a9f4jsn18b9afd97a07'; //Kevin


export default {
  data() {
    return {
      isLoading: false, //Prueba de renderizacion 
      inputWord: '', // Palabra ingresada por el usuario
      translation: '', // Traducción de la palabra
      definition: '', // Definición de la palabra
      example: '', // Ejemplo de uso de la palabra
      detectLanguage: '', // Idioma detectado
      definitionTraslate: '', // Definición de la palabra traducida
      exampleTraslate: '', // Ejemplo de uso de la palabra traducida
      translatedSynonyms: [], // Sinónimos traducidos
      translatedAntonyms: [], // Antónimos traducidos
      synonyms:[],
      antonyms: [],
      translatedSynonymsDetect: [], // Sinónimos traducidos del idioma detectado
      translatedAntonymsDetect: [], // Antónimos traducidos del idioma detectado
      detectLanguagesSelect: {},
      availableLanguages: {}, // Idiomas disponibles
      selectedLanguage: 'en', // Idioma seleccionado para la traducción
      selectedLanguageDetect: '',
      palabrasGuardadas: [], // Lista de palabras guardadas por el usuario
      alertaGuardado: false, // Mostrar alerta de palabra guardada
      mensaje: '', // Mensaje de la alerta de palabra guardada
      alertaEliminacion: false, // Mostrar alerta de eliminación de palabra
      mensajeEliminacion: '', // Mensaje de la alerta de eliminación de palabra
      dialogPalabras: false, // Mostrar diálogo de palabras guardadas
      palabraSeleccionada: '', // Palabra seleccionada del diálogo
      palabraIdSeleccionada: 0, // ID de la palabra seleccionada del diálogo
      wordTraslate: '', // Palabra traducida
      palabraTraducida: '',
      definitionTranslation: '', // Definición de la palabra traducida
      exampleTranslation: '', // Ejemplo de uso de la palabra traducida
      mostrarModal: false,
      alertaPvacia: false,
      mensajePvacia: "Por favor ingresa una palabra",
      alertaVacia: false,
      mensajeVacia: "No se ha guardado ninguna palabra",
      mostrarModalConfirmacion: false,


    };
  },

  watch: {
    detectLanguage: 'translateTextAndDetectLanguage',
    selectedLanguage: function (newLanguage) {
      if (newLanguage !== 'Selecciona') {
        // Si se selecciona un idioma válido
        this.translateText(newLanguage);
      }
    },


    inputWord: function () {
      if (this.inputDebouncer) {
        clearTimeout(this.inputDebouncer);
      }

      this.inputDebouncer = setTimeout(() => {
        // Verificar si el input está vacío y borrar las variables si es así
        if (this.inputWord.trim() === '') {
          // Recargar la página actual
          window.location.reload();
          return;
        }

        // Detectar y traducir automáticamente después de 2 segundos de inactividad
        this.detectLanguageAutomatically(); // Traducir y detectar el idioma
        this.traslateToEn(); // Traducir al inglés
        this.getAvailableLanguages(); // Obtener la lista de idiomas disponibles
        this.translateText(this.selectedLanguage); // Traducir al idioma seleccionado

      }, 1500);
    },


  },
  mounted() {
    // Llamar a la detección de idioma automáticamente al cargar el componente
    this.trabajoInternoCompleto = true; // Trabajo interno completo
    // Inicializar datos al cargar el componente
    this.getAvailableLanguages(); // Obtener la lista de idiomas disponibles
    this.cargarVoces(); // Cargar las voces de texto disponibles
  },
  methods: {
    seleccionarPalabraGuardada(palabra) {
      this.palabraGuardada = palabra;
      this.inputWord = palabra; // Asigna la palabra guardada al input
    },

    guardarPalabra() {
      // Validar que inputWord no esté vacío antes de hacer la solicitud
      if (this.inputWord.trim() !== "") {
        // Verificar si hay un usuario registrado
        if (!this.$store.getters.getUsuario || !this.$store.getters.getId) {
          // Mostrar el modal en lugar de la alerta
          this.mostrarModal = true;
          return;
        }

        // Hacer la solicitud POST
        axios
          .post("http://127.0.0.1:8000/api/palabraguardada/store", {
            palabra: this.inputWord,
            fk_user: this.$store.getters.getId
          })
          .then((response) => {
            if (response.data.code == 200) {
              this.mensaje = "Palabra guardada exitosamente.";
              this.alertaGuardado = true;
            }
          })
          .catch((error) => {
            console.error(error);
          });
      } else {
        this.alertaPvacia = true;
      }
    },
    irALogin() {
      // Redirigir a la página de inicio de sesión
      this.$router.push("/");
      this.mostrarModal = false;
    },

    cancelarAccion() {
      // Cancelar la acción
      this.mostrarModal = false;
    },
    mostrarPalabrasGuardadas() {
      // Verificar si hay un usuario registrado
      if (!this.$store.getters.getUsuario || !this.$store.getters.getId) {
        // Mostrar el modal en lugar de la alerta
        this.mostrarModal = true;
        return;
      }

      // Palabras guardadas
      axios
        .get(`http://127.0.0.1:8000/api/palabraguardada/${this.$store.getters.getId}`)
        .then((response) => {
          if (response.data.code == 200) {
            let res = response.data;
            this.palabrasGuardadas = res.data;
            this.dialogPalabras = true;
          } else {
            console.error('Error al obtener palabras guardadas:', response.data.data);
          }
        })
        .catch((error) => {
          this.alertaVacia = true;
          console.error('Error en la solicitud:', error);
        });
    },
    //PARA ELIMINAR
    eliminarPalabra(id) {
      this.mensajeConfirmacion = "¿Estás seguro de que quieres eliminar esta palabra?";
      this.callbackConfirmacion = () => {
        axios
          .delete(`http://127.0.0.1:8000/api/palabraguardada/delete/${id}`)
          .then((response) => {
            if (response.data.code == 200) {
              this.mensajeEliminacion = "Palabra eliminada exitosamente.";
              this.alertaEliminacion = true;
              this.mostrarPalabrasGuardadas();


              // Verificar si no hay más palabras después de eliminar
              if (this.palabrasGuardadas.length === 1) {
                this.dialogPalabras = false;

              }
            }
          })
          .catch((error) => {
            console.error(error);
          });
      };
      this.mostrarModalConfirmacion = true;
    },

    confirmarEliminarPalabra() {
      if (this.callbackConfirmacion) {
        this.callbackConfirmacion();
      }
      this.mostrarModalConfirmacion = false;
    },



    cargarVoces() {
      // Cargar las voces de texto disponibles
      this.vocesDisponibles = speechSynthesis.getVoices();
      // Establecer el índice de la voz preferida
      this.indiceVoz = this.vocesDisponibles.findIndex(voz => IDIOMAS_PREFERIDOS.includes(voz.lang));
      if (this.indiceVoz === -1) this.indiceVoz = 0; // Usar la primera voz si no se encuentra la preferida
    },
    ///////////Input Methods///////////
    async detectLanguageAutomatically() {
      this.isLoading = true;
      // Detectar automáticamente el idioma del texto ingresado por el usuario
      const detectOptions = {
        method: 'POST',
        url: 'https://microsoft-translator-text.p.rapidapi.com/Detect',
        params: {
          'api-version': '3.0',
        },
        headers: {
          'content-type': 'application/json',
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
        },
        data: [
          {
            Text: this.inputWord,
          },
        ],
      };

      try {
        const detectResponse = await axios.request(detectOptions);
        this.detectLanguage = detectResponse.data[0].language;
        // Esperar 1 segundo antes de llamar a translateTextAndDetectLanguage
        setTimeout(() => {
          this.translateTextAndDetectLanguage();
        }, 1000);
      } catch (error) {
        console.error('Error al detectar el idioma automáticamente:', error);
      }
    },
    async translateTextAndDetectLanguage() {
      this.isLoading = true;

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
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com'
        },
        data: [
          {
            Text: this.inputWord, // Texto a traducir
          }
        ]
      };

      try {
        const translationResponse = await axios.request(translationOptions);
        this.wordTraslate = translationResponse.data[0].translations[0].text;

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
            'X-RapidAPI-Key': API_KEY,
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
          console.log('prueba de definicion' + this.definitionTraslate)
        } catch (error) {
          console.error('Error al traducir la definición al idioma detectado:', error);
        }

        // Traducir el ejemplo al idioma detectado
        // Verificar si el ejemplo está vacío
        const ejemploAEnviar = this.example.trim() !== '' ? this.example : 'Ejemplo no encontrado';

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
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
          },
          data: [
            {
              Text: ejemploAEnviar, // Texto a traducir (ejemplo)
            },
          ],
        };

        try {
          const exampleResponse = await axios.request(exampleOptions);
          this.exampleTraslate = exampleResponse.data[0].translations[0].text;
        } catch (error) {
          console.error('Error al traducir el ejemplo al idioma detectado:', error);
        }
        // Para cada sinónimo 
        this.translatedSynonyms = [];
        for (let i = 0; i < this.synonyms.length; i++) {
          const synonymOptions = {
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
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
            },
            data: [
              {
                Text: this.synonyms[i], // Sinónimo a traducir
              },
            ],
          };

          try {
            const synonymResponse = await axios.request(synonymOptions);
            this.synonymTraslate = synonymResponse.data[0].translations[0].text;
            this.translatedSynonyms.push(this.synonymTraslate);
          } catch (error) {
            console.error('Error al traducir el sinonimo al idioma detectado:', error);
          }
        }
        // Para cada antonimos 
        this.translatedAntonyms = [];
        for (let i = 0; i < this.antonyms.length; i++) {
          const antonymOptions = {
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
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
            },
            data: [
              {
                Text: this.antonyms[i], // Sinónimo a traducir
              },
            ],
          };

          try {
            const antonymResponse = await axios.request(antonymOptions);
            this.antonymTraslate = antonymResponse.data[0].translations[0].text;
            this.translatedAntonyms.push(this.antonymTraslate);
          } catch (error) {
            console.error('Error al traducir el antonimo al idioma detectado:', error);
          }
        }

      } catch (error) {
        console.error('Error al traducir al idioma detectado:', error);
      }
      this.isLoading = false; // Finalizar el estado de carga
    },
    async traslateToEn() {
      this.isLoading = true; // Iniciar el estado de carga
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
          'X-RapidAPI-Key': API_KEY,
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
          console.log(this.example)
        })
        .catch(() => {
          this.word = "No se pudo encontrar la palabra";
        });
      //para los sinonimos
      try {
        const response = await axios.get(`https://api.datamuse.com/words?rel_syn=${this.traslateToEnLanguaje}`);
        let uniqueSynonyms = [];
        for (let item of response.data) {
          if (!uniqueSynonyms.includes(item.word)) {
            uniqueSynonyms.push(item.word);
            if (uniqueSynonyms.length == 5) {
              break;
            }
          }
        }
        this.synonyms = uniqueSynonyms;


      } catch (error) {
        console.error(error);
      }
      //para los antonimos
      try {
        const response = await axios.get(`https://api.datamuse.com/words?rel_ant=${this.traslateToEnLanguaje}`);
        let uniqueAntonyms = [];
        for (let item of response.data) {
          if (!uniqueAntonyms.includes(item.word)) {
            uniqueAntonyms.push(item.word);
            if (uniqueAntonyms.length == 5) {
              break;
            }
          }
        }
        this.antonyms = uniqueAntonyms;
      } catch (error) {
        console.error(error);
      }
      this.isLoading = false; // Finalizar el estado de carga
    },

    playAudioInput() {
      // Reproducir audio de la palabra traducida
      if (!this.wordTraslate || !this.selectedLanguage) {
        console.error('Falta texto o idioma seleccionado.');
        return;
      }
      const mensaje = new SpeechSynthesisUtterance();
      mensaje.voice = this.vocesDisponibles[this.indiceVoz];
      mensaje.volume = 2;
      mensaje.rate = 1;
      mensaje.text = this.wordTraslate;
      mensaje.pitch = 1;
      speechSynthesis.speak(mensaje);
    },
    ///////////Output Methods///////////
    async translateText(selectedLanguage) {
      this.isLoading = true; // Iniciar el estado de carga
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
          'X-RapidAPI-Key': API_KEY,
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
      } catch (error) {
        console.error('Error al traducir:', error);
      }


      this.definitionTraslate = '',
        console.log(this.definitionTraslate);
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
          'X-RapidAPI-Key': API_KEY,
          'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
        },
        data: [
          {
            Text: this.definitionTraslate,
          },
        ],
      };

      try {
        const definitionResponse = await axios.request(definitionOptions);
        this.definitionTranslation = definitionResponse.data[0].translations[0].text;
        console.log('prueba de definicion traducida' + this.definitionTranslation)
      } catch (error) {
        console.error('Error al traducir la definición:', error);
      }

      // Para cada sinónimo obtenido
        this.translatedSynonymsDetect = [];
        for (let i = 0; i < this.synonyms.length; i++) {
          const synonymOptions = {
            method: 'POST',
            url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
            params: {
              'to[0]': this.selectedLanguage,
              'api-version': '3.0',
              profanityAction: 'NoAction',
              textType: 'plain',
            },
            headers: {
              'content-type': 'application/json',
              'X-RapidAPI-Key': API_KEY,
              'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
            },
            data: [
              {
                Text: this.synonyms[i], // Sinónimo a traducir
              },
            ],
          };

          try {
            const synonymResponse = await axios.request(synonymOptions);
            this.synonymTraslate = synonymResponse.data[0].translations[0].text;
            this.translatedSynonymsDetect.push(this.synonymTraslate);
          } catch (error) {
            console.error('Error al traducir el sinonimo al idioma detectado:', error);
          }
        }
      // Para cada antonimos obtenido
      this.translatedAntonymsDetect = [];
      for (let i = 0; i < this.antonyms.length; i++) {
        const antonymOptions = {
          method: 'POST',
          url: 'https://microsoft-translator-text.p.rapidapi.com/translate',
          params: {
            'to[0]': this.selectedLanguage,
            'api-version': '3.0',
            profanityAction: 'NoAction',
            textType: 'plain',
          },
          headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': API_KEY,
            'X-RapidAPI-Host': 'microsoft-translator-text.p.rapidapi.com',
          },
          data: [
            {
              Text: this.antonyms[i], // Sinónimo a traducir
            },
          ],
        };

        try {
          const antonymResponse = await axios.request(antonymOptions);
          this.antonymTraslate = antonymResponse.data[0].translations[0].text;
          this.translatedAntonymsDetect.push(this.antonymTraslate);
        } catch (error) {
          console.error('Error al traducir el antonimo al idioma detectado:', error);
        }
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
          'X-RapidAPI-Key': API_KEY,
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
      this.isLoading = false; // Finalizar el estado de carga
    },
    getAvailableLanguages() {
      // Obtener la lista de idiomas disponibles desde un archivo JSON
      const languageData = require('@/assets/data.json');
      this.availableLanguages = languageData.translation;
      this.detectLanguagesSelect = languageData.translation;
    },
    playAudioOutput() {
      // Reproducir audio de la traducción
      if (!this.translation || !this.selectedLanguage) {
        console.error('Falta texto o idioma seleccionado.');
        return;
      }
      const mensaje = new SpeechSynthesisUtterance();
      mensaje.voice = this.vocesDisponibles[this.indiceVoz];
      mensaje.volume = 2;
      mensaje.rate = 1;
      mensaje.text = this.translation;
      mensaje.pitch = 1;
      speechSynthesis.speak(mensaje);
    },

  },
};
</script>



<style scoped>
.synonyms {
  margin: 10px 0;
}

.loading-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(255, 255, 255, 0.8);
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  z-index: 9999;
}

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

.custom-button {
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

.sign-link {
  font-size: 15px;
  text-align: center;
  margin: 50px 100px;
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
