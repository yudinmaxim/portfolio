<template>
  <div class="todo-item"  :id="todo.id" :draggable="!isEnabled"  @dragstart="dragStart" @dragover.stop>
    <div class="todo-name">
      <input
        type="checkbox"
        v-model="isChecked"
        :disabled="!isEnabled"
        @change="todoUpdate"
      />
      <input
        :class="`${isEnabled ? 'header' : ''} name ${isChecked ? 'did' : ''}`"
        type="text"
        placeholder="Имя вашей задачи"
        v-model="name"
        :disabled="!isEnabled"
        @change="todoUpdate"
      />
      <button
        v-show="isEnabled"
        class="btn delete"
        @click="deleteTodoButtonClick"
      >
        X
      </button>
    </div>

    <div v-show="isEnabled" class="todo-description">
      <textarea
        class="description"
        name="description"
        placeholder="Тут можно добавить описание вашей задачи"
        v-model="description"
        @change="todoUpdate"
      >
      </textarea>
    </div>
  </div>
</template>

<script>
export default {
  name: "Todo",

  props: {
    parent: Object,
    todo: Object,
    isEnabled: { default: true }
  },

  data() {
    return {
      isChecked: false,
      description: "",
      name: ""
    };
  },

  mounted() {
    // поскольку мы не можем менять данные стора напрямую
    // а задача является свойством заметки
    // тут введены дополнительные поля, которые позволяют изменять себя
    // далее эти поля переходят к родителю, который уже умеет собирать их в свойства заметки
    if (this.todo) {
      this.isChecked = this.todo.isChecked;
      this.name = this.todo.name;

      this.description = this.todo.description;
    }
  },

  methods: {
    todoUpdate() {
      const newTodo = {
        ...this.todo,
        ...{
          name: this.name,
          isChecked: this.isChecked,
          description: this.description
        }
      };
      this.$emit("update", newTodo);
    },
    deleteTodoButtonClick() {
      this.$emit("delete", this.todo);
    },

    dragStart(item) {

      item.dataTransfer.setData('todos_id', JSON.stringify({todo: this.todo, parent: this.parent}))

      
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/App.scss";

.delete {
  @include borderColor($color-red, $color-white, $color-red);
  margin-right: 10px;
  margin-left: 10px;
  min-width: 24px;
  height: 24px;
}
.delete:hover {
  @include borderColor($color-white, $color-red, $color-white);
}

.todo-item {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.todo-name {
  display: flex;
  flex-direction: row;
  user-select: none;
  width: 100%;
}

.header {
  font-size: 22px;
  font-weight: bold;
  width: 100%;
}
.header:hover {
  outline: none;
  border-bottom: 1px solid $color-blue;
}
.header:focus {
  outline: none;
  border-bottom: 1px solid $color-red;
}


.todo-description {
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: flex-start;
}

.did {
  text-decoration: line-through;
}

.description {
  min-height: 50px;
  width: 87%;
  height: 50px;
  margin-top: 5px;
  margin-bottom: 25px;
  margin-left: 25px;
  border: none;
  resize: none;
}
.description:hover {
  resize: vertical;
  border-width: 1px;
  border-style: solid;
  border-color: $color-blue;
}
.description:focus {
  outline: none;
  border: 1px solid $color-red;
}
</style>
