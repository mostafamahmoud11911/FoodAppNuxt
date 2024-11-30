<script setup>
import axios from "axios";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

const { token } = userData();

const forgetPassSchema = yup.object({
  oldPassword: yup
    .string()
    .required()
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
      message: "Please create a stronger password",
    }),
  newPassword: yup
    .string()
    .required()
    .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
      message: "Please create a stronger password",
    }),
  confirmNewPassword: yup
    .string()
    .required()
    .oneOf([yup.ref("newPassword")]),
});

const spinner = ref(false);

const { handleSubmit, errors } = useForm({
  validationSchema: forgetPassSchema,
});

const { value: oldPassword } = useField("oldPassword");
const { value: newPassword } = useField("newPassword");
const { value: confirmNewPassword } = useField("confirmNewPassword");

const onSubmit = handleSubmit(async (user) => {
  spinner.value = true;
  try {
    await axios.put(
      `https://upskilling-egypt.com:3006/api/v1/Users/ChangePassword`,
      user,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );

    useNuxtApp().$toast.success(`Changed password successfully`);
  } catch (error) {
    useNuxtApp().$toast.error(error.response.data.message);
  } finally {
    spinner.value = false;
  }
});
</script>

<template>
  <form @submit.prevent="onSubmit" class="flex flex-col gap-5 w-[500px] my-5">
    <input
      type="password"
      placeholder="old password"
      v-model="oldPassword"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
    <p class="text-red-500" v-if="errors.oldPassword">
      {{ errors.oldPassword }}
    </p>
    <input
      type="password"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="new password"
      v-model="newPassword"
    />
    <p class="text-red-500" v-if="errors.newPassword">
      {{ errors.newPassword }}
    </p>
    <input
      type="password"
      placeholder="confirm password"
      v-model="confirmNewPassword"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
    <p class="text-red-500" v-if="errors.confirmNewPassword">
      {{ errors.confirmNewPassword }}
    </p>
    <button :disabled="spinner"lass="bg-[#009247] text-white py-2 px-4 rounded-md" type="submit">
        {{ spinner ? "Changing..." : "Change Password" }}
    </button>
  </form>
</template>
