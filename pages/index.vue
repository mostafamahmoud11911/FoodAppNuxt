<script setup>
import axios from "axios";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const LoginSchema = yup.object({
  email: yup.string().required().email(),
  password: yup
    .string()
    .required()
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
      message: "Please create a stronger password",
    }),
});

const router = useRouter();

const { handleSubmit, errors } = useForm({
  validationSchema: LoginSchema,
});

const { value: email } = useField("email");
const { value: password } = useField("password");
const isLoading = ref(false);

const onSubmit = handleSubmit(async (user) => {
  isLoading.value = true;
  try {
    const { data } = await axios.post(
      `https://upskilling-egypt.com:3006/api/v1/Users/Login`,
      user
    );
    isLoading.value = false;
    useNuxtApp().$toast.success("Login successfully");
    useCookie("token").value = data.token;
    setTimeout(() => {
      router.push({ name: "dashboard" });
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
      <label
        for="email"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Your email</label
      >
      <div class="relative">
        <div
          class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 16"
          >
            <path
              d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z"
            />
            <path
              d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z"
            />
          </svg>
        </div>
        <input
          type="text"
          id="email-address-icon"
          v-model="email"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="name@flowbite.com"
        />
      </div>

      <p
        v-if="errors.email"
        class="mt-2 text-sm text-red-600 dark:text-red-500"
      >
        {{ errors.email }}
      </p>
    </div>
    <div class="mb-5">
      <label
        for="password"
        class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >Your password</label
      >
      <div class="relative">
        <div
          class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none"
        >
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"
            />
          </svg>
        </div>
        <input
          type="password"
          v-model="password"
          class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full ps-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="xxxxxx"
        />
        <div
          class="absolute inset-y-0 end-0 flex items-center pe-3.5 pointer-events-none"
        >
          <svg
            class="w-6 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M21 12c0 1.2-4.03 6-9 6s-9-4.8-9-6c0-1.2 4.03-6 9-6s9 4.8 9 6Z"
            />
            <path
              stroke="currentColor"
              stroke-width="2"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>
        </div>
      </div>
      <p
        v-if="errors.password"
        class="mt-2 text-sm text-red-600 dark:text-red-500"
      >
        {{ errors.password }}
      </p>
    </div>
    <div class="flex items-end justify-between mb-5">
      <NuxtLink to="/register">Register Now?</NuxtLink>
      <NuxtLink to="/forgetpass" class="forgetPass">Forget Password?</NuxtLink>
    </div>
    <button
      type="submit"
      :disabled="isLoading"
      class="text-white bg-[#4AA35A] hover:bg-[#357741] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2.5"
    >
      {{ isLoading ? "Login..." : "Login" }}
    </button>
  </form>
</template>

<style scoped>
.forgetPass {
  color: #4aa35a;
}
</style>
