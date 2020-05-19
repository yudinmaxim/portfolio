import Vue from "vue";
import VueRouter from "vue-router";
import Notes from "../views/NotesList.vue";
import Note from "../views/Note.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Notes",
    component: Notes
  },
  {
    path: "/note/:id",
    name: "Note",
    component: Note
  }
];

const router = new VueRouter({
  routes
});

export default router;
