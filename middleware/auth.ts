export default defineNuxtRouteMiddleware((to, from) => {
  if (!useCookie("token").value) {
    return navigateTo({name: 'index'});
  }
});
