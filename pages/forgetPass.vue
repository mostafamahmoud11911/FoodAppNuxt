<script setup>
import axios from "axios";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const forgetPassSchema = yup.object({
  email: yup.string().required().email(),
});

const router = useRouter();

const { handleSubmit, errors } = useForm({
  validationSchema: forgetPassSchema,
});

const { value: email } = useField("email");

const isLoading = ref(false);

const onSubmit = handleSubmit(async (email) => {
    isLoading.value = true;
    try {
      const { data } = await axios.post(
        `https://upskilling-egypt.com:3006/api/v1/Users/Reset/Request`,
        email
      );
      isLoading.value = false;
      useNuxtApp().$toast.success("Sent Code");
      setTimeout(() => {
        router.push({ name: "resetPass" });
      }, 2000);
    } catch (error) {
      isLoading.value = false;
      useNuxtApp().$toast.error(error.response.data.message);
    }
});
definePageMeta({
  layout: "auth-layout",
});
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <input
        type="text"
        class="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
        placeholder="E-mail"
        v-model="email"
      />
      <p
        v-if="errors.email"
        class="text-sm text-red-600 dark:text-red-500"
      >
        {{ errors.email }}
      </p>
    </div>
    <button
      type="submit"
      class="text-white bg-[#4AA35A] hover:bg-[#357741] mt-3 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2.5"
    >
      {{ isLoading ? "Sent..." : "Sent" }}
    </button>
  </form>
</template>
