<template>
  <div :id="id" class="modal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>{{ header }}</h3>
      </div>
      <div class="modal-body">
        <p class="caption">{{ caption }}</p>
      </div>
      <div class="modal-footer">
        <button class="btn close" type="button" @click="modalCloseClick">
          Отмена
        </button>
        <button class="btn ok" type="button" @click="modalOKClick">ОК</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    showModal: {
      default: false
    },
    header: {
      default: ""
    },
    caption: {
      default: ""
    }
  },

  watch: {
    showModal: function(newValue) {
      if (newValue) this.modal.style.display = "block";
    }
  },

  computed: {
    modal() {
      return document.getElementById(this.id);
    }
  },

  methods: {
    modalOKClick() {
      this.modal.style.display = "none";
      this.$emit("close", true);
    },
    modalCloseClick() {
      this.modal.style.display = "none";
      this.$emit("close", false);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/App.scss";

.close {
  @include borderColor($color-green, $color-white, $color-green);
  width: 20%;
  height: 45px;
  margin-left: 5px;
  margin-bottom: 5px;
}
.close:hover {
  @include borderColor($color-white, $color-green, $color-white);
}

.ok {
  @include borderColor($color-red, $color-white, $color-red);
  width: 20%;
  margin-right: 5px;
  margin-bottom: 5px;
  height: 45px;
}
.ok:hover {
  @include borderColor($color-white, $color-red, $color-white);
}

.modal {
  display: none;
  position: fixed;
  z-index: 1;
  padding-top: 200px;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
  position: relative;
  background-color: $color-white;
  margin: auto;
  border-radius: 5px;
  box-shadow: 0 0 10px black;
  max-width: 500px;
  min-width: 200px;
  width: 50%;
}

.modal-header {
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 5px;
  padding-bottom: 5px;
  background-color: $color-lightred;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: 1px solid $color-lightred;
}
.modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.caption {
  width: 90%;
}

@media screen and (max-width: 800px) {
  dialog {
    width: 60%;
  }
}
@media screen and (max-width: 226px) {
  dialog {
    width: 80%;
  }
}

@media handheld {
  dialog {
    padding: 0;

    width: 95%;
  }
}
</style>
