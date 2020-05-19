<template>
  <div class="root">
    <h1>Список заметок</h1>
    <div class="notes">

      <div class="row col">
        <div class="mb-10">
          <span>Только выполненные</span>
          <input v-model="filterDid" type="checkbox" />
        </div>
        <div class="mb-10">
          <span>Поиск:</span>
          <input
            v-model="filterString"
            class="filter"
            type="text"
            placeholder="Название задачи"
          />
        </div>
      </div>

      <button class="btn add" @click="buttonNoteAddClick">
        Добавить карточку
      </button>

      <note-list-item
        v-for="note in getNotes"
        :key="note.id"
        :note="note"
        :inList="true"
        :filter="filter"
        @dndend="dndend"
      />
    </div>
  </div>
</template>

<script>
import NoteListItem from "../components/NoteListItem.vue";

import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    NoteListItem,
  },

  data() {
    return {
      filterDid: false,
      filterString: "",
    };
  },

  computed: {
    ...mapGetters(["notes"]),
    filter() {
      return { did: this.filterDid, name: this.filterString };
    },
    getNotes() {
      // если мы ещё не загрузили заметки в стор - делаем это
      if (!this.notes || this.notes.length === 0) {
        this.LoadSaveData();
      }

      return this.notes;
    },
  },

  methods: {
    ...mapActions(["LoadSaveData", "RemoveNote"]),

    buttonNoteAddClick() {
      this.$router.push({ name: "Note", params: { id: this.notes.length } });
    },

    dndend(args) {
      // найдёт карточку
      const note = this.notes.find((note) => note.id === args.parent.id)

      // найдем в ней задачу и удалим
      const todoIndex = note.todos.findIndex((todo) => todo.id === args.todo.id)
      note.todos.splice(todoIndex, 1)

      if(note.todos.length == 0) {
        this.RemoveNote(note.id)
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/App.scss";

.add {
  @include borderColor($color-blue, $color-white, $color-blue);
  width: 100%;
  margin-top: 15px;
  margin-bottom: 15px;
  cursor: pointer;
}
.add:hover {
  @include borderColor($color-white, $color-blue, $color-white);
}

.notes {
  display: flex;
  flex-direction: column;

  width: 50%;
  padding-left: 25%;
}

.filter {
  outline: none;
  border-bottom: 1px solid $color-blue;
}
.filter:focus {
  outline: none;
  border-bottom: 1px solid $color-red;
}



@media screen and (max-width: 900px) {
  .notes {
    width: 90%;
    padding-left: 5%;
  }
}

@media handheld {
  .notes {
    width: 90%;
    padding-left: 5%;
  }
}
</style>
