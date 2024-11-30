<script setup>
definePageMeta({
  middleware: "auth",
  layout: "master-layout",
});
</script>

<template>
  <Header />

  <RecipeHeader />
</template>
