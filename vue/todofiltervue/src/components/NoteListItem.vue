<template>
  <div v-show="isShowing" :class="`note ${dragAddShow ? 'drag' : ''}`" :id="note.id"  @dragover.prevent="dragAddShow=true" @dragenter="dragAddShow=true" @dragleave.stop="dragAddShow=false"  @drop.prevent="drop">
    <note-header
      :note="note"
      @click="headerClick"
      @delete="headerDeleteClick"
    />
    <!--Предел ограничен 5ю единицами на общей странице заметок -->
    <todo-list-item
      v-for="todo in todos"
      :key="todo.id"
      :todo="todo"
      :isEnabled="!inList"
      :parent="note"
    />
    <!-- Выводим 6е дело с эффектом прозрачности - намекает, что в заметке есть ещё дела -->
    <button
      v-show="note.todos.length > LIMIT_FOR_TODOS"
      class="btn more-todos align-left"
      @click="buttonAllNoteTasksClick(note)"
    >
      Остальные задачи
    </button>
  </div>
</template>

<script>
import NoteHeader from "../components/NoteHeader.vue";
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
    name: String,

    filter: {
      default: {
        did: false,
        name: "",
      },
    },
  },
  data() {
    return {
      LIMIT_FOR_TODOS: 5,
      isShowing: true,
      todos: [],

      dragAddShow: false,
    };
  },

  mounted(){
    this.filteredTodos()
  },
  watch: {
    filter: function() {
      this.filteredTodos()
    },
    "todos.length": function(newValue) {
      this.isShowing = newValue > 0;
    },

    "note.todos": function() {
      this.filteredTodos()
    }
  },

  methods: {
    ...mapActions(["RemoveNote", "ChangeNote"]),
    filteredTodos() {
      const todosdid = [];
      
      if (this.filter.did) {
        todosdid.push( ...this.note.todos.filter((todo) => todo.isChecked) );
      } else {
        todosdid.push( ...this.note.todos);
      }

      if (this.filter.name.length > 0) {
        this.todos = 
          todosdid.filter((todo) =>
            todo.name.toLowerCase().includes(this.filter.name.toLowerCase())
          
        );
      } else {
        this.todos = todosdid;
      }

      this.todos = [...this.todos.filter((todo, index) => index < this.LIMIT_FOR_TODOS)];
    },

    headerClick(note) {
      this.$router.push({ name: "Note", params: { id: note.id } });
    },
    headerDeleteClick(note) {
      this.RemoveNote(note.id);
    },

    buttonAllNoteTasksClick(note) {
      this.headerClick(note);
    },

    drop(item) {
      const todoObject = JSON.parse(item.dataTransfer.getData('todos_id'));

      const todo = todoObject.todo;
      const parent = todoObject.parent;

      this.$emit('dndend', {parent, todo});

      // проверим на совпадение id
      todo.id = this.note.todos.length

      // создаём предельно полную копию объекта для сохранения его в сторе
      const newNote = {...this.note};
      newNote.todos = [todo, ...newNote.todos]
      this.ChangeNote(newNote);
 

    },

  },
};
</script>

<style lang="scss" scoped>
@import "@/App.scss";

.dimmer {
  opacity: 0.5;
}

.note {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid $color-blue;
  margin-bottom: 50px;
}

.more-todos {
  @include borderColor($color-pompadour, $color-white, $color-pompadour);
  width: 30%;
  margin-top: 15px;
  margin-bottom: 15px;
}
.more-todos:hover {
  @include borderColor($color-white, $color-pompadour, $color-white);
}

.drag {
  border: 1px solid $color-gray;
}

</style>
