<script setup>
import axios from "axios";
import { useField, useForm } from "vee-validate";
import * as yup from "yup";

// get recipe data for edit
const { query } = useRoute();
const edit = query.type === "edit";

const recipeData = {
  name: query.name,
  description: query.description,
  price: query.price,
  tagId: query.tagId,
  tagName: query.tagName,
  recipeImage: query.image,
  catId: query.catId,
  categoryname: query.categoryname,
};

// edit category and tag
const categoryEdit = ref("");
const tagEdit = ref("");

const router = useRouter();

const { token } = userData();

const categoryList = reactive({
  categories: [],
});

const RecipeSchema = yup.object({
  name: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  tagId: yup.string().required(),
  recipeImage: yup.mixed().optional(),
  categoryId: yup.string().required(),
});

const { handleSubmit, errors } = useForm({
  validationSchema: RecipeSchema,
});

const { value: name } = useField("name");
const { value: description } = useField("description");
const { value: price } = useField("price");
const { value: tagId } = useField("tagId");
const { value: recipeImage } = useField("recipeImage");
const { value: categoryId } = useField("categoryId");

const tagData = useTag();
const tags = await tagData.getTag();

const getAllCategory = async () => {
  try {
    const { data } = await axios.get(
      `https://upskilling-egypt.com:3006/api/v1/Category`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    categoryList.categories = data.data;
  } catch (error) {
    useNuxtApp().$toast.error(error.response.data.message);
  }
};

const getFile = (e) => {
  recipeImage.value = e.target.files[0];
};

const appendToFormData = (data) => {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("categoriesIds", data.categoryId);
  formData.append("price", data.price);
  formData.append("tagId", data.tagId);
  formData.append("description", data.description);
  formData.append("recipeImage", data.recipeImage);
  return formData;
};

const onSubmit = handleSubmit(async (recipe) => {
  const newData = appendToFormData(recipe);

  try {
    const { data } = await axios({
      method: edit ? "put" : "post",
      url: edit
        ? `https://upskilling-egypt.com:3006/api/v1/Recipe/${query.id}`
        : `https://upskilling-egypt.com:3006/api/v1/Recipe`,
      data: newData,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });
    setTimeout(() => {
      router.push({ path: "/dashboard/recipes" });
    }, 1000);
    useNuxtApp().$toast.success(
      edit ? "Recipe updated successfully" : "Recipe added successfully"
    );
  } catch (error) {
    useNuxtApp().$toast.error(error.response.data.message);
  }
});

// return category, tag to edit recipe

onMounted(() => {
  getAllCategory();
  if (edit) {
    name.value = recipeData.name;
    tagEdit.value = recipeData.tagId;
    tagId.value = recipeData.tagId;
    description.value = recipeData.description;
    price.value = recipeData.price;
    categoryEdit.value = recipeData.catId;
    categoryId.value = recipeData.catId;
  }
});

definePageMeta({
  layout: "master-layout",
  middleware: "auth",
});
</script>

<template>
  <RecipeHeader />

  <div class="w-[80%] mx-auto">
    <form @submit.prevent="onSubmit" class="flex flex-col gap-3">
      <input
        type="text"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="name"
        v-model="name"
      />
      <p v-if="errors.name" class="text-sm text-red-600 dark:text-red-500">
        {{ errors.name }}
      </p>
      <select
        v-model="tagId"
        @change="(event) => (tagEdit = event.target.value)"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option selected>Tag</option>
        <option v-for="tag in tags" :key="tag.id" :value="tag.id">
          {{ tag.name }}
        </option>
      </select>
      <p v-if="errors.name" class="text-sm text-red-600 dark:text-red-500">
        {{ errors.tagId }}
      </p>
      <input
        type="number"
        v-model="price"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="price"
      />
      <p v-if="errors.price" class="text-sm text-red-600 dark:text-red-500">
        {{ errors.price }}
      </p>
      <select
        v-model="categoryId"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option>Category</option>
        <option
          v-for="category in categoryList.categories"
          :key="category.id"
          :value="category.id"
        >
          {{ category.name }}
        </option>
      </select>
      <p
        v-if="errors.categoryId"
        class="text-sm text-red-600 dark:text-red-500"
      >
        {{ errors.categoryId }}
      </p>
      <input
        type="text"
        v-model="description"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        placeholder="description"
      />
      <p
        v-if="errors.description"
        class="text-sm text-red-600 dark:text-red-500"
      >
        {{ errors.description }}
      </p>
      <input
        @change="getFile"
        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        type="file"
      />
      <div class="mt-7 flex justify-end items-center gap-3">
        <NuxtLink
          to="/dashboard/recipes"
          class="border text-[#009247] border-[#009247] px-14 py-2 rounded hover:bg-[#009247] hover:text-white transition-all duration-300"
          >Cancel</NuxtLink
        >

        <button
          class="bg-[#009247] border border-[#009247] text-white px-6 py-2 rounded hover:border-[#009247] hover:bg-white hover:text-[#009247]"
        >
          save
        </button>
      </div>
    </form>
  </div>
</template>
