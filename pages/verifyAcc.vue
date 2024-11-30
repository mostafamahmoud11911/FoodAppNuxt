<script setup>
import axios from "axios";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const verifySchema = yup.object({
  email: yup.string().required().email(),
  code: yup.string().required(),
});

const router = useRouter();

const { handleSubmit, errors } = useForm({
  validationSchema: verifySchema,
});

const { value: email } = useField("email");
const { value: code } = useField("code");

const isLoading = ref(false);

const onSubmit = handleSubmit(async (user) => {
  isLoading.value = true;
  try {
    const { data } = await axios.put(
      `https://upskilling-egypt.com:3006/api/v1/Users/verify`,
      user
    );
    isLoading.value = false;
    useNuxtApp().$toast.success("Sent Verify");
    setTimeout(() => {
      router.push({ name: "verifyAcc" });
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
    <div class="mb-5">
      <input
        type="text"
        class="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
        placeholder="E-mail"
        v-model="email"
      />
      <p
        v-if="errors.email"
        class="mt-2 text-sm text-red-600 dark:text-red-500"
      >
        {{ errors.email }}
      </p>
    </div>
    <div class="mb-5">
      <input
        type="text"
        class="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
        placeholder="Code"
        v-model="code"
      />
      <p v-if="errors.code" class="mt-2 text-sm text-red-600 dark:text-red-500">
        {{ errors.code }}
      </p>
    </div>
    <button
      type="submit"
      class="text-white bg-[#4AA35A] hover:bg-[#357741] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2.5"
    >
      {{ isLoading ? "Register..." : "Register" }}
    </button>
  </form>
</template>
