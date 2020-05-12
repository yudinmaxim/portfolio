<template>
  <div class="root">
    <h1>Список заметок</h1>
    <div class="notes">
      <button class="btn add" @click="buttonNoteAddClick">Добавить заметку</button>

      <note-list-item
        v-for="note in getNotes"
        :key="note.id"
        :note="note"
        :inList="true"
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
    return {};
  },

  computed: {
    ...mapGetters(["notes"]),
    getNotes() {
      // если мы ещё не загрузили заметки в стор - делаем это
      if (!this.notes || this.notes.length === 0) {
        this.LoadSaveData();
      }

      return this.notes;
    },
  },

  methods: {
    ...mapActions(["LoadSaveData"]),

    buttonNoteAddClick() {
      this.$router.push({ name: "Note", params: { id: this.notes.length } });
    },
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
