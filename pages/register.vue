<script setup>
import axios from "axios";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const RegisterSchema = yup.object({
  userName: yup.string().required(),
  email: yup.string().required().email(),
  country: yup.string().required(),
  phoneNumber: yup.string().required(),
  password: yup
    .string()
    .required()
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
      message: "Please create a stronger password",
    }),
  confirmPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("password")]),
});

const router = useRouter();

const { handleSubmit, errors } = useForm({
  validationSchema: RegisterSchema,
});
const { value: userName } = useField("userName");
const { value: country } = useField("country");
const { value: phoneNumber } = useField("phoneNumber");
const { value: email } = useField("email");
const { value: password } = useField("password");
const { value: confirmPassword } = useField("confirmPassword");

const isLoading = ref(false);

const onSubmit = handleSubmit(async (user) => {
  isLoading.value = true;
  try {
    const { data } = await axios.post(
      `https://upskilling-egypt.com:3006/api/v1/Users/Register`,
      user
    );
    isLoading.value = false;
    useNuxtApp().$toast.success("Register successfully");
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
    <div class="grid grid-cols-2 gap-4">
      <div class="mb-2">
        <input
          type="text"
          id="username-success"
          class="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
          placeholder="Bonnie Green"
          v-model="userName"
        />
        <p
          v-if="errors.userName"
          class="mt-2 text-sm text-red-600 dark:text-red-500"
        >
          {{ errors.userName }}
        </p>
      </div>
      <div class="mb-2">
        <input
          type="text"
          id="email"
          class="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
          placeholder="mail"
          v-model="email"
        />
        <p
          v-if="errors.email"
          class="mt-2 text-sm text-red-600 dark:text-green-500"
        >
          {{ errors.email }}
        </p>
      </div>
      <div class="mb-2">
        <input
          type="text"
          class="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
          placeholder="Country"
          v-model="country"
        />
        <p class="mt-2 text-sm text-red-600 dark:text-green-500">
          {{ errors.country }}
        </p>
      </div>
      <div class="mb-2">
        <input
          type="text"
          class="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
          placeholder="PhoneNumber"
          v-model="phoneNumber"
        />
        <p
          v-if="errors.phoneNumber"
          class="mt-2 text-sm text-red-600 dark:text-green-500"
        >
          {{ errors.phoneNumber }}
        </p>
      </div>
      <div class="mb-2">
        <input
          type="password"
          class="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
          placeholder="Password"
          v-model="password"
        />
        <p
          v-if="errors.password"
          class="mt-2 text-sm text-red-600 dark:text-green-500"
        >
          {{ errors.password }}
        </p>
      </div>
      <div>
        <input
          type="password"
          class="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
          placeholder="Confirm Password"
          v-model="confirmPassword"
        />
        <p
          v-if="errors.confirmPassword"
          class="mt-2 text-sm text-red-600 dark:text-green-500"
        >
          {{ errors.confirmPassword }}
        </p>
      </div>
    </div>
    <div class="flex justify-end items-center">
      <NuxtLink :to="{ name: 'index' }" class="mb-2">Login</NuxtLink>
    </div>
    <button
      type="submit"
      class="text-white bg-[#4AA35A] hover:bg-[#357741] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full px-5 py-2.5"
    >
      {{ isLoading ? "Register..." : "Register" }}
    </button>
  </form>
</template>
