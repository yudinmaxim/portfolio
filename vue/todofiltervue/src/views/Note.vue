<template>
  <div class="root">
    <div class="top">
      <h1>
        <input
          class="header name"
          type="text"
          :value="localNote.name"
          placeholder="Название вашей заметки"
          @input="noteNameUpdate"
          @blur="noteNameUpdate"
        />
      </h1>

      <div class="col">
        <div class="row">
          <button class="btn save" @click="buttonSaveClick">Сохранить</button>
          <button class="btn delete" @click="buttonDeleteClick">Удалить</button>
          <button class="btn cancel" @click="buttonCancelClick">
            Отменить
          </button>
        </div>
        <div class="row notwrap">
          <button
            :class="`btn udo ${udo.length > 0 ? '' : 'notactive'}`"
            @click="buttonUdoClick"
          >
            ↶
          </button>
          <button class="btn add" @click="buttonTodoAddClick">
            Добавить задачу
          </button>
          <button
            :class="`btn redo ${redo.length > 0 ? '' : 'notactive'}`"
            @click="buttonRedoClick"
          >
            ↷
          </button>
        </div>
      </div>
    </div>

    <div class="todos">
      <todo-list-item
        v-for="todo in localNote.todos"
        :key="todo.id"
        :todo="todo"
        :isEnabled="true"
        @update="todoUpdate"
        @delete="todoDelete"
      />
    </div>

    <ModalDialog
      id="cancel"
      header="ВНИМАНИЕ: Отмена всех изменений"
      caption="Нажатие кнопки 'OK' приведёт к отмене всех изменений и переходу к списку заметок, вы хотите продолжить?"
      :showModal="wantCancel"
      @close="cancelDialogClose"
    />

    <ModalDialog
      id="notedelete"
      header="ВНИМАНИЕ: Удаление заметки"
      caption="Нажатие кнопки 'OK' приведёт к удалению заметки. Удаление невозможно отменить. Хотите продолжить?"
      :showModal="wantNoteDelete"
      @close="noteDeleteDialogClose"
    />

    <ModalDialog
      id="saveDialog"
      header="ВНИМАНИЕ: Содержание заметки"
      caption="Вы не указали название заметки. При продолжении сохранения поиск настоящей заметик будет затруднён! Вы хотите продолжить?"
      :showModal="wantSave"
      @close="saveDialogClose"
    />
  </div>
</template>

<script>
import TodoListItem from "../components/TodoListItem.vue";
import ModalDialog from "../components/ModalDialog.vue";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    TodoListItem,
    ModalDialog
  },

  data() {
    return {
      localNote: {
        id: "",
        name: "",
        todos: [
          {
            id: "",
            name: "",
            isChecked: false,
            description: ""
          }
        ]
      },

      udo: [],
      redo: [],

      wasEdited: false,

      wantCancel: false,
      wantNoteDelete: false,
      wantSave: false
    };
  },

  created: function() {
    console.log("Was mounted and try init");
    // при создании страницы определяем внутренний экземпляр заметки. чтыб его можно было менять
    if (this.note) {
      this.localNote = JSON.parse(JSON.stringify(this.note));
    } else {
      this.localNote.id = this.$route.params.id;
      this.localNote.todos = [
        {
          id: `01`,
          name: "",
          isChecked: false,
          description: ""
        }
      ];
    }
  },

  watch: {
    "udo.length": function(newValue) {
      this.wasEdited = newValue > 0;
    }
  },
  computed: {
    ...mapGetters(["notes"]),
    note() {
      // в случае перезагрузки страницы на экране редактирования заметки
      // загружаем данные в стор перед работой с ними
      if (!this.notes || this.notes.length === 0) {
        this.LoadSaveData();
      }

      return this.notes.find(note => note.id === this.$route.params.id);
    },
    todos() {
      return this.localNote.todos;
    }
  },

  methods: {
    ...mapActions(["LoadSaveData", "ChangeNote", "RemoveNote", "Udo", "Redo"]),

    cancelDialogClose(result) {
      console.log(`Cancel Modal dialog closing with result -> ${result}`);
      this.wantCancel = false;

      if (result) this.$router.push({ name: "Notes" });
    },
    noteDeleteDialogClose(result) {
      this.wantNoteDelete = false;
      if (result) {
        this.RemoveNote(this.$route.params.id);
        this.$router.push({ name: "Notes" });
      }
    },
    saveDialogClose(result) {
      this.wantSave = false;

      if (result) {
        this.SaveNote();
      }
    },

    buttonUdoClick() {
      if (this.udo.length > 0) {
        this.redo.push(JSON.stringify(this.localNote));

        const bufferNote = JSON.parse(this.udo.pop());

        this.localNote.id = bufferNote.id;
        this.localNote.name = bufferNote.name;
        this.localNote.todos = []; // очистим список задач, для обеспечения реактивности его изменения на следующем такте

        // для обеспечения реактивности вложенный список задач обновляем при слеущем обновлении
        // в противном случае реактивность ВЬЮ ломается и изменения задач не видны
        this.$nextTick(() => {
          this.localNote.todos = [...bufferNote.todos];
        });
      }
    },
    buttonRedoClick() {
      if (this.redo.length > 0) {
        this.udoAdd();

        const bufferNote = JSON.parse(this.redo.pop());

        this.localNote.id = bufferNote.id;
        this.localNote.name = bufferNote.name;
        this.localNote.todos = [];

        this.$nextTick(() => {
          this.localNote.todos = [...bufferNote.todos];
        });
      }
    },

    buttonDeleteClick() {
      console.log("Delete Button pressed");
      this.wantNoteDelete = true;
    },

    buttonSaveClick() {
      if (this.localNote.name.length == 0) {
        this.wantSave = true;
      } else {
        this.SaveNote();
      }
    },
    SaveNote() {
      // создаём предельно полную копию объекта для сохранения его в сторе
      const bufNote = JSON.parse(
        JSON.stringify(
          this.note
            ? { ...this.note, ...this.localNote }
            : { id: this.$route.params.id, ...this.localNote }
        )
      );
      this.ChangeNote(bufNote);

      this.$router.push({ name: "Notes" });
    },
    buttonCancelClick() {
      if (this.wasEdited) this.wantCancel = true;
      else this.$router.push({ name: "Notes" });
    },

    buttonTodoAddClick() {
      console.log("Try add todo in note");

      this.udoAdd();

      this.localNote.todos = [
        {
          id: `${this.localNote.todos.length}`, // не самый лучший способ создания ID, но дял теста подходит
          name: "",
          isChecked: false,
          description: ""
        },
        ...this.localNote.todos
      ];
    },

    todoUpdate(todo) {
      console.log(todo);
      this.udoAdd();

      // т.к. изменению может подвергаться и ещё не существующая заметка
      // определяем её наличие и меням или добавляем, если она отсутствует
      const index = this.localNote.todos.findIndex(td => td.id === todo.id);
      if (index > -1) {
        this.localNote.todos.splice(index, 1, JSON.parse(JSON.stringify(todo)));
      } else {
        this.localNote.todos.unshift(JSON.parse(JSON.stringify(todo)));
      }
    },
    todoDelete(todo) {
      this.udoAdd();
      const index = this.localNote.todos.findIndex(td => td.id === todo.id);
      this.localNote.todos.splice(index, 1);
    },

    noteNameUpdate(event) {
      if (this.localNote.name !== event.target.value) {
        this.udoAdd();
        this.$set(this.localNote, "name", event.target.value);
      }
    },

    udoAdd() {
      if (this.udo[this.udo.length - 1] !== JSON.stringify(this.localNote)) {
        this.udo.push(JSON.stringify(this.localNote));
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/App.scss";

.udo {
  @include borderColor($color-gold, $color-white, $color-gold);
  min-width: 30px;
}
.udo:hover {
  @include borderColor($color-white, $color-gold, $color-white);
}

.redo {
  @include borderColor($color-gray, $color-white, $color-gray);
  margin-right: 10px;
  min-width: 30px;
}
.redo:hover {
  @include borderColor($color-white, $color-gray, $color-white);
}

.save {
  @include borderColor($color-green, $color-white, $color-green);
  width: 15%;
}
.save:hover {
  @include borderColor($color-white, $color-green, $color-white);
}

.delete {
  @include borderColor($color-red, $color-white, $color-red);
  margin-right: 10px;
  margin-left: 10px;
  width: 15%;
}
.delete:hover {
  @include borderColor($color-white, $color-red, $color-white);
}

.cancel {
  @include borderColor($color-pompadour, $color-white, $color-pompadour);
  width: 15%;
}
.cancel:hover {
  @include borderColor($color-white, $color-pompadour, $color-white);
}

.add {
  @include borderColor($color-blue, $color-white, $color-blue);
  width: 80%;
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 15px;
  margin-right: 15px;
}
.add:hover {
  @include borderColor($color-white, $color-blue, $color-white);
}

.notactive {
  @include borderColor($color-gray, $color-lightgray, $color-gray);
}
.notactive:hover {
  @include borderColor($color-gray, $color-gray, $color-gray);
}

.header {
  font-size: 35px;
  font-weight: bold;
  width: 100%;
}

.name {
  border: 0px;
  outline: none;
  background-color: transparent;
  border-bottom: 1px solid $color-blue;
}
.name:focus {
  border: 0px;
  outline: none;
  background-color: transparent;
  border-bottom: 1px solid $color-red;
}

.col {
  width: 100%;
}
.row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.notwrap {
  flex-wrap: nowrap;
}

.root {
  display: flex;
  flex-direction: column;

  width: 60%;
  padding-left: 20%;
  padding-top: 2%;

  align-items: flex-start;
  align-self: center;
  .top {
    width: 85%;
    align-self: center;
  }

  .todos {
    width: 100%;
  }
}

@media screen and (max-width: 900px) {
  .root {
    width: 95%;
    padding-left: 2.5%;
    align-items: center;
    .todos {
      width: 80%;
    }

    .top {
      width: 80%;
    }
  }
}
@media screen and (max-width: 226px) {
  .udo,
  .redo,
  .save,
  .delete,
  .cancel {
    margin: 0 0 0 0;
  }
}

@media handheld {
  .udo,
  .redo,
  .save,
  .delete,
  .cancel {
    margin: 0 0 0 0;
  }
  .root {
    width: 95%;
    padding-left: 5%;

    .todos {
      width: 80%;
    }

    .top {
      width: 80%;
      align-self: flex-start;
    }
  }
}
</style>
