<script setup>
import axios from "axios";
import * as yup from "yup";
import { useForm, useField } from "vee-validate";

const ResetPassSchema = yup.object({
  email: yup.string().email().required(),
  seed: yup.string().required(),
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

const { handleSubmit, errors } = useForm({
  validationSchema: ResetPassSchema,
});
const { value: email } = useField("email");
const { value: seed } = useField("seed");
const { value: password } = useField("password");
const { value: confirmPassword } = useField("confirmPassword");

const onSubmit = handleSubmit(async (user) => {
  isLoading.value = true;
  try {
    const { data } = await axios.post(
      `https://upskilling-egypt.com:3006/api/v1/Users/Reset`,
      user
    );
    useNuxtApp().$toast.success(data.message);
    isLoading.value = false;
    setTimeout(() => {
      router.push({ name: "index" });
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
  <p>Reset Password</p>
  <p>Please Enter Your Otp or Check Your index</p>

  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <input
        type="text"
        id="username-success"
        class="bg-green-50 border border-red-500 text-red-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
        placeholder="Email"
        v-model="email"
      />
      <p
        v-if="errors.email"
        class="mt-2 text-sm text-red-600 dark:text-red-500"
      >
        {{ errors.email }}
      </p>
    </div>
    <div class="mb-3">
      <input
        type="text"
        id="username-error"
        class="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
        placeholder="OTP"
        v-model="seed"
      />
      <p v-if="errors.seed" class="mt-2 text-sm text-red-600 dark:text-red-500">
        {{ errors.seed }}
      </p>
    </div>
    <div class="mb-3">
      <input
        type="text"
        id="username-error"
        class="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
        placeholder="Password"
        v-model="password"
      />
      <p
        v-if="errors.password"
        class="mt-2 text-sm text-red-600 dark:text-red-500"
      >
        {{ errors.password }}
      </p>
    </div>
    <div class="mb-3">
      <input
        type="text"
        id="username-error"
        class="bg-red-50 border border-red-500 text-red-900 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-gray-700 focus:border-red-500 block w-full p-2.5 dark:text-red-500 dark:placeholder-red-500 dark:border-red-500"
        placeholder="Confirm Password"
        v-model="confirmPassword"
      />
      <p
        v-if="errors.confirmPassword"
        class="mt-2 text-sm text-red-600 dark:text-red-500"
      >
        {{ errors.confirmPassword }}
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
