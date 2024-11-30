<script setup>
import axios from "axios";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";
import * as yup from "yup";
import { useField, useForm } from "vee-validate";

const CategorySchema = yup.object({
  name: yup.string().required(),
});

const { handleSubmit, errors } = useForm({
  validationSchema: CategorySchema,
});

const { value: name } = useField("name");

const { token } = userData();

const categoryList = reactive({
  categories: [],
  loading: false,
});
const arrayOfPages = ref([]);
const spinner = ref(false);
const searchByName = ref("");
const categoryId = ref("");
const categoryName = ref("");
const isDelOpen = ref(false);
const isOpen = ref(false);
const isEdit = ref("add");

function setIsOpen(value) {
  isOpen.value = value;
  isEdit.value = "add";
}
function setIsDelOpen(value) {
  isDelOpen.value = value;
}

const getAllCategory = async (name, pageSize, pageNumber) => {
  categoryList.loading = true;
  try {
    const { data } = await axios.get(
      `https://upskilling-egypt.com:3006/api/v1/Category/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        params: {
          name,
        },
      }
    );
    arrayOfPages.value = Array(data.totalNumberOfPages)
      .fill()
      .map((_, i) => i + 1);
    categoryList.categories = data.data;
  } catch (error) {
    useNuxtApp().$toast.error(error.response.data.message);
  } finally {
    categoryList.loading = false;
  }
};

const getName = ({ target }) => {
  const name = target.value;
  searchByName.value = name;
  getAllCategory(name, 10, 1);
};

const deleteCategory = (category) => {
  isDelOpen.value = !isDelOpen.value;
  categoryId.value = category.id;
  categoryName.value = category.name;
};

const handleDelete = async () => {
  spinner.value = true;
  try {
    await axios.delete(
      `https://upskilling-egypt.com:3006/api/v1/Category/${categoryId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    useNuxtApp().$toast.success("Category deleted successfully");
    setIsDelOpen(false);
    getAllCategory("", 10, 1);
  } catch (error) {
    useNuxtApp().$toast.error(error.response.data.message);
  } finally {
    spinner.value = false;
  }
};

const onSubmit = handleSubmit(async (category) => {
  try {
    const { data } = await axios({
      method: isEdit.value == "edit" ? "put" : "post",
      url:
        isEdit.value == "edit"
          ? `https://upskilling-egypt.com:3006/api/v1/Category/${categoryId.value}`
          : `https://upskilling-egypt.com:3006/api/v1/Category`,
      data: category,
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    });

    useNuxtApp().$toast.success(
      isEdit.value == "edit"
        ? "Category updated successfully"
        : "Category added successfully"
    );
    setIsOpen(false);
    isEdit.value = "add";
    getAllCategory("", 10, 1);
  } catch (error) {
    useNuxtApp().$toast.error(error.response.data.message);
  }
});

const editCategory = (category) => {
  setIsOpen(true);
  categoryId.value = category.id;
  name.value = category.name;
  isEdit.value = "edit";
};

onMounted(() => {
  getAllCategory("", 10, 1);
});

definePageMeta({
  middleware: "auth",
  layout: "master-layout",
});
</script>

<template>
  <Header
    name="Categories"
    item="Item"
    desc="You can now add your items that any user can order it from the Application and you can edit or delete it"
  />
  <div class="w-full flex items-center justify-between">
    <div>
      <h5 class="text-md font-semibold">Categories Table Details</h5>
      <p class="text-sm text-[#323C47]">You can check all details</p>
    </div>

    <button
      class="bg-[#009247] text-white py-2 px-4 rounded-md"
      @click="() => setIsOpen(true)"
    >
      Add New Category
    </button>
  </div>

  <div class="my-2">
    <input
      type="text"
      id="first_name"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="name"
      @input="getName"
    />
  </div>

  <div class="relative overflow-x-auto">
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Index</th>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Date</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody v-if="!categoryList.loading && categoryList.categories.length > 0">
        <tr
          v-for="(category, index) in categoryList.categories"
          :key="category.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <th
            scope="row"
            class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
          >
            {{ index + 1 }}
          </th>
          <td class="px-6 py-4">{{ category.name }}</td>
          <td class="px-6 py-4">
            {{ new Date(category.creationDate).toLocaleDateString("US-en") }}
          </td>
          <td class="px-6 py-4 flex items-center gap-2">
            <svg
              class="w-6 h-6 text-red-600 dark:text-white cursor-pointer"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              @click="() => deleteCategory(category)"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
              />
            </svg>

            <svg
              class="w-6 h-6 text-yellow-400 dark:text-white cursor-pointer"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              @click="() => editCategory(category)"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
              />
            </svg>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="categoryList.categories.length < 0"
      class="w-full flex justify-center"
    >
      <img src="/assets/images/noData.svg" alt="" />
    </div>

    <div
      class="w-full flex items-center justify-center h-[200px]"
      v-if="categoryList.loading"
    >
      <PulseLoader />
    </div>
  </div>

  <div class="flex justify-center">
    <nav aria-label="Page navigation example mt-2">
      <ul class="flex flex-wrap gap-1 text-sm">
        <li>
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >Previous</a
          >
        </li>

        <li
          v-for="page in arrayOfPages"
          :key="page"
          @click="() => getAllCategory(searchByName, 10, page)"
        >
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >{{ page }}</a
          >
        </li>

        <li>
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >Next</a
          >
        </li>
      </ul>
    </nav>
  </div>

  <!-- Add Update Modal -->
  <Modal :isOpen="isOpen" :setIsOpen="setIsOpen">
    <form @submit.prevent="onSubmit">
      <div class="w-[100%] flex flex-col items-center gap-2 mb-3">
        <div class="max-w-full w-full my-8">
          <input
            type="text"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-[400px] p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Category Name"
            v-model="name"
          />
          <p v-if="errors.name" class="text-sm text-red-600 dark:text-red-500">
            {{ errors.name }}
          </p>
        </div>
      </div>
      <div class="text-right mt-4">
        <button
          type="submit"
          class="text-white bg-[#009247] focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          {{ isEdit == "edit" ? "Update" : "Add" }}
        </button>
      </div>
    </form>
  </Modal>

  <!-- Delete Modal -->
  <Modal :isOpen="isDelOpen" :setIsOpen="setIsDelOpen">
    <div class="w-full flex flex-col items-center gap-2 mb-3">
      <img
        src="@/assets/images/noData.svg"
        class="text-center w-[200px]"
        alt=""
      />

      <h4 class="font-bold text-lg text-[#494949]">Delete This Item ?</h4>
      <p class="text-[#49494999]">
        are you sure you want to delete this item ? if you are sure just click
        on delete it
      </p>
    </div>
    <div class="text-right mt-4">
      <button
        type="button"
        @click="handleDelete"
        :disabled="spinner"
        class="text-red-700 hover:text-white border border-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
      >
        {{ spinner ? "Delete this item..." : "Delete this item" }}
      </button>
    </div>
  </Modal>
</template>
