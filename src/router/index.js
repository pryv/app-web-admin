import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import UsersManagement from "../views/UsersManagement.vue";
import Config from "../views/Config.vue";
import Login from "../views/Login.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/users-management",
    name: "UsersManagement",
    component: UsersManagement
  },
  {
    path: "/platform-config",
    name: "Config",
    component: Config
  }
];

const router = new VueRouter({
  routes
});

export default router;
