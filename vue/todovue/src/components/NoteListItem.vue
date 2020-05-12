<template>
  <div class="note">

    <note-header :note="note" @click="headerClick" @delete="headerDeleteClick"/>

    <!-- Перечедь дел ограничен 5ю единицами на общей странице заметок -->
    <todo-list-item
      v-for="todo in note.todos.filter((todo, index) => index < 5)"
      :key="todo.id"
      :todo="todo"
      :isEnabled="!inList"
    />
    <!-- Выводим 6е дело с эффектом прозрачности - намекает, что в заметке есть ещё дела -->
    <todo-list-item
      class="dimmer"
      v-show="note.todos.length > 5"
      :key="(note.todos.length > 5) ? note.todos[5].id : ''"
      :todo="(note.todos.length > 5) ? note.todos[5] : null"
      :isEnabled="false"
    />
  </div>
</template>

<script>
import NoteHeader from "../components/NoteHeader.vue"
import TodoListItem from "../components/TodoListItem.vue";

import { mapActions } from "vuex";
export default {
  name: "NoteItem",

  components: {
    TodoListItem,
    NoteHeader,
  },

  props: {
    inList: {
      default: false,
    },

    note: Object,
    id: String,
    name: String,
    todos: Array,
  },
  data() {
    return {};
  },


  methods: {
    ...mapActions(["RemoveNote"]),
    headerClick(note) {
      this.$router.push({ name: 'Note', params: { id: note.id }});
    },
    headerDeleteClick(note) {
      this.RemoveNote(note.id);
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/App.scss";

.dimmer {
  opacity: 0.5;
}

.note {
  border-bottom: 1px solid $color-blue;
  margin-bottom: 50px;
}


</style>
