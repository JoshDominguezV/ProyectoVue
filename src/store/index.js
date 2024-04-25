import { createStore } from "vuex";
export default createStore({
  state: {
    // Variables de estado global en la aplicación
    usuario: null,
    token: null,
    id: null,
  },
  getters: {
    // Retorna el usuario
    getUsuario(state) {
      return state.usuario;
    },
    // Retornar el id
    getId(state) {
      return state.id;
    },
    // Retorna el token
    getToken(state) {
      return state.token;
    },
  },
  mutations: {
    // Modifica el valor del usuario
    setUsuario(state, usuario) {
      state.usuario = usuario;
    },
    // Modifica el valor del token
    setToken(state, token) {
      state.token = token;
    },
    // Modifica el valor del id
    setId(state, id) {
      state.id = id;
    },
  },
  actions: {
    // Acción para realizar el login
    login(context, data) {
      // Llenar variables de estado
      context.commit("setUsuario", data.usuario);
      context.commit("setToken", data.token);
      context.commit("setId", data.id);
      // Guardar data en el local storage
      localStorage.setItem("userData", JSON.stringify(data));
    },
    // Acción para realizar el logout
    logout(context) {
      // Vaciar variables de estado
      context.commit("setUsuario", null);
      context.commit("setToken", null);
      context.commit("setId", null);
      // Eliminar data de local storage
      localStorage.removeItem("userData");
    },
  },
});
