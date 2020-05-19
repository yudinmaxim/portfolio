import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);
const STORAGE_NAME = "test-todo";

export default new Vuex.Store({
  state: {
    defaultNotes: [
      {
        id: "01",
        name: "Note 1",
        todos: [
          {
            id: "01",
            name: "Первая задача",
            isChecked: false,
            description: "Задача о том, чтобы сделать задачу"
          },
          {
            id: "02",
            name: "Вторая задача",
            isChecked: false,
            description: "Задача о том, чтобы сделать задачу"
          },
          {
            id: "03",
            name: "Третья задача",
            isChecked: true,
            description: "Задача о том, чтобы сделать задачу"
          },
          {
            id: "04",
            name: "Четвёртая задача",
            isChecked: false,
            description: "Задача о том, чтобы сделать задачу"
          },
          {
            id: "05",
            name: "Пятая задача",
            isChecked: false,
            description: "Задача о том, чтобы сделать задачу"
          },
          {
            id: "06",
            name: "Шестая задача",
            isChecked: false,
            description: "Задача о том, чтобы сделать задачу"
          },
          {
            id: "07",
            name: "Седьмая задача",
            isChecked: false,
            description: "Задача о том, чтобы сделать задачу"
          }
        ]
      },
      {
        id: "02",
        name: "Note 2",
        todos: [
          {
            id: "01",
            name: "Первая задача",
            isChecked: true,
            description: "Задача о том, чтобы сделать задачу"
          },
          {
            id: "02",
            name: "Вторая задача",
            isChecked: false,
            description: "Задача о том, чтобы сделать задачу"
          },
          {
            id: "03",
            name: "Третья задача",
            isChecked: true,
            description: "Задача о том, чтобы сделать задачу"
          },
          {
            id: "04",
            name: "Четвёртая задача",
            isChecked: false
          }
        ]
      },
      {
        id: "03",
        name: "Note 3",
        todos: [
          {
            id: "01",
            name: "Первая задача",
            isChecked: false
          },
          {
            id: "02",
            name: "Вторая задача",
            isChecked: false
          },
          {
            id: "03",
            name: "Третья задача",
            isChecked: true
          },
          {
            id: "04",
            name: "Четвёртая задача",
            isChecked: false
          }
        ]
      },
      {
        id: "04",
        name: "Note 4",
        todos: [
          {
            id: "01",
            name: "Первая задача",
            isChecked: false,
            description:
              "Описаниеэтой задачи состоит из описания к задаче по описанию задачи."
          },
          {
            id: "02",
            name: "Вторая задача",
            isChecked: false
          },
          {
            id: "03",
            name: "Третья задача",
            isChecked: true
          },
          {
            id: "04",
            name: "Четвёртая задача",
            isChecked: false
          }
        ]
      }
    ],
    notes: []
  },
  getters: {
    notes(state) {
      return state.notes;
    },
    workNote(state) {
      return state.workNote;
    }
  },
  mutations: {
    notesAdd(state, note) {
      state.notes.unshift(note);
      localStorage.setItem(STORAGE_NAME, JSON.stringify(state.notes));
    },
    noteRemove(state, id) {
      const index = state.notes.findIndex(note => note.id === id);
      state.notes.splice(index, 1);
      localStorage.setItem(STORAGE_NAME, JSON.stringify(state.notes));
    },
    noteChange(state, note) {
      const index = state.notes.findIndex(item => item.id === note.id);
      if (index >= 0) state.notes.splice(index, 1, note);
      else state.notes.splice(0, 0, note); // несмотря н ато, что мы меняем заметку, если у нас неизвестный id - считаем, что это новая заметка - добавим её в хранилище
      localStorage.setItem(STORAGE_NAME, JSON.stringify(state.notes));
    },

    loadNotes(state) {
      if (localStorage.getItem(STORAGE_NAME)) {
        state.notes = JSON.parse(localStorage.getItem(STORAGE_NAME));
      } else {
        state.notes = [...state.defaultNotes];
      }
    },

    saveNotes(state) {
      localStorage.setItem(STORAGE_NAME, JSON.stringify(state.notes));
    }
  },
  actions: {
    RemoveNote({ commit }, id) {
      console.log("Remove Note: " + id);
      commit("noteRemove", id);
    },
    AddNote({ commit }, note) {
      commit("noteAdd", note);
    },
    ChangeNote({ commit }, note) {
      commit("noteChange", note);
    },
    LoadSaveData({ commit }) {
      commit("loadNotes");
    },
    SaveData({ commit }) {
      commit("saveNotes");
    }
  },
  modules: {}
});
