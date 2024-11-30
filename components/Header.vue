<script setup>
defineProps({
  name: String,
  item: String,
  desc: String,
});
</script>

<template>
  <div class="container mx-auto mb-3">
    <div class="container-img py-3 px-5">
      <div class="flex justify-between items-center">
        <div class="text-white">
          <div class="flex gap-1 text-3xl">
            <h3 class="">{{ name }}</h3>
            <span class="font-light">{{ item }}</span>
          </div>
          <p class="mt-3">
            {{ desc }}
          </p>
        </div>
        <div>
          <img src="@/assets/images/logo-header.png" class="w-[200px]" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container-img {
  background-image: url(../assets/images/bg-header.png);
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 20px;
}
</style>
