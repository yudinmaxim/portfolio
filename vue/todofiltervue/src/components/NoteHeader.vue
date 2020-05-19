<template>
  <div class="row">
    <h2 @click="headerNoteClick">{{ note.name }}</h2>
    <button class="btn delete" @click="buttonDeleteClick">X</button>

    <ModalDialog
      id="rootnotedelete"
      header="ВНИМАНИЕ: Удаление заметки"
      caption="Нажатие кнопки 'OK' приведёт к удалению заметки. Удаление невозможно отменить. Хотите продолжить?"
      :showModal="wantNoteDelete"
      @close="noteDeleteDialogClose"
    />
  </div>
</template>

<script>
import ModalDialog from "../components/ModalDialog.vue";

export default {
  components: {
    ModalDialog
  },
  props: {
    note: Object
  },

  data() {
    return {
      wantNoteDelete: false
    };
  },

  methods: {
    // по сути заголовок инициирует событие открытия заметки или удаления её из стора и базы
    noteDeleteDialogClose(result) {
      this.wantNoteDelete = false;
      if (result) {
        this.$emit("delete", this.note);
      }
    },
    headerNoteClick() {
      this.$emit("click", this.note);
    },
    buttonDeleteClick() {
      this.wantNoteDelete = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/App.scss";

.delete {
  align-self: center;
  border-radius: 5px;
  border-width: 1px;
  border-style: solid;
  border-color: $color-red;
  background-color: $color-white;
  color: $color-red;

  margin-right: 10px;
  min-width: 32px;
  height: 32px;
}
.delete:hover {
  border-color: $color-white;
  background-color: $color-red;
  color: $color-white;
}


h2 {
  cursor: pointer;
  width: 100%;
  text-align: left;
  margin-right: 15px;
  border-bottom: 1px solid transparent;
}
h2:hover {
  border-bottom-color: $color-blue;
}
</style>
