<script setup>
import axios from "axios";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

const router = useRouter();

const recipesData = reactive({
  recipes: [],
  loading: false,
});
const categoryList = reactive({
  categories: [],
});

const spinner = ref(false);
const arrayOfPages = ref([]);
const searchByName = ref("");
const searchByTag = ref("");
const searchByCategory = ref("");
const getRecipeId = ref("");
const getRecipeName = ref("");
const isOpen = ref(false);

function setIsOpen(value) {
  isOpen.value = value;
}

const { token } = userData();

// get all recipes
const getAllRecipes = async (name, tagId, categoryId, pageSize, pageNumber) => {
  recipesData.loading = true;
  try {
    const { data } = await axios.get(
      `https://upskilling-egypt.com:3006/api/v1/Recipe/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        params: {
          name,
          tagId,
          categoryId,
        },
      }
    );
    recipesData.recipes = data.data;
    arrayOfPages.value = Array(data.totalNumberOfPages)
      .fill()
      .map((_, i) => i + 1);
  } catch (error) {
    useNuxtApp().$toast.error(error.response.data.message);
  } finally {
    recipesData.loading = false;
  }
};

// get search name
const getName = ({ target }) => {
  const name = target.value;
  searchByName.value = name;
  getAllRecipes(name, searchByTag.value, searchByCategory.value, 10, 1);
};

// get search category
const getCategory = ({ target }) => {
  const category = target.value;
  searchByCategory.value = category;
  getAllRecipes(searchByName.value, searchByTag.value, category, 10, 1);
};
// get search tag
const getTagName = ({ target }) => {
  const tag = target.value;
  searchByTag.value = tag;
  getAllRecipes(searchByName.value, tag, searchByCategory.value, 10, 1);
};

// get tags from composable
const { getTag } = useTag();
const tags = await getTag();

// get category
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

// delete recipe
const deleteRecipe = (recipe) => {
  getRecipeId.value = recipe.id;
  getRecipeName.value = recipe.name;
  setIsOpen(true);
};

const handleDelete = async () => {
  spinner.value = true;
  try {
    await axios.delete(
      `
    https://upskilling-egypt.com:3006/api/v1/Recipe/${getRecipeId.value}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      }
    );
    getAllRecipes("", "", "", 10, 1);
    isOpen.value = false;
    useNuxtApp().$toast.success("Recipe deleted successfully");
  } catch (error) {
    useNuxtApp().$toast.error(error.response.data.message);
  } finally {
    spinner.value = false;
  }
};

const goToRecipeData = (recipe) => {
  router.push({ path: `/dashboard/recipedata`, query: { id: recipe.id, name: recipe.name, image: recipe.imagePath, price: recipe.price, description: recipe.description, tagId: recipe.tag.id, tagName: recipe.tag.name,  categoryname: recipe.category[0].name,catId: recipe.category[0].id, type: "edit" } });
};

onMounted(() => {
  getAllRecipes("", "", "", 10, 1);
  getAllCategory();
});
definePageMeta({
  middleware: "auth",
  layout: "master-layout",
});
</script>

<template>
  <Header
    name="Recipes"
    item="Item"
    desc="You can now add your items that any user can order it from the Application and you can edit or delete it"
  />

  <div
    class="w-full flex md:items-center items-start md:justify-between flex-col md:flex-row mb-2"
  >
    <div>
      <h4>Recipe Table Details</h4>
      <p class="text-sm text-[#323C47]">You can check all details</p>
    </div>
    <NuxtLink
      :to="{ path: '/dashboard/recipedata' }"
      class="bg-[#009247] text-white py-2 px-4 rounded-md"
    >
      Add New Recipe
    </NuxtLink>
  </div>

  <div class="flex items-center justify-between gap-2">
    <input
      type="text"
      id="first_name"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      @input="getName"
      placeholder="name"
    />
    <select
      @input="getCategory"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option selected value="">Choose category</option>
      <option
        v-for="category in categoryList.categories"
        :key="category.id"
        :value="category.id"
      >
        {{ category.name }}
      </option>
    </select>
    <select
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      @input="getTagName"
    >
      <option selected value="">Choose tag</option>
      <option v-for="tag in tags" :key="tag.id" :value="tag.id">
        {{ tag.name }}
      </option>
    </select>
  </div>

  <div class="relative overflow-x-auto">
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead
        class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
      >
        <tr>
          <th scope="col" class="px-6 py-3">Product name</th>
          <th scope="col" class="px-6 py-3">Image</th>
          <th scope="col" class="px-6 py-3">price</th>
          <th scope="col" class="px-6 py-3">description</th>
          <th scope="col" class="px-6 py-3">tag</th>
          <th scope="col" class="px-6 py-3">Category</th>
          <th scope="col" class="px-6 py-3">Action</th>
        </tr>
      </thead>
      <tbody v-if="!recipesData.loading && recipesData.recipes.length > 0">
        <tr
          v-for="recipe in recipesData.recipes"
          :key="recipe.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <th scope="row" class="px-6 py-4">
            {{ recipe.name }}
          </th>
          <td class="px-6 py-4">
            <img
              :src="
                recipe.imagePath
                  ? 'https://upskilling-egypt.com:3006/' + recipe.imagePath
                  : 'https://media.istockphoto.com/id/1396814518/vector/image-coming-soon-no-photo-no-thumbnail-image-available-vector-illustration.jpg?s=612x612&w=0&k=20&c=hnh2OZgQGhf0b46-J2z7aHbIWwq8HNlSDaNp2wn_iko='
              "
              class="w-12 h-12 rounded-md object-cover"
              alt=""
            />
          </td>
          <td class="px-6 py-4">{{ recipe.price }}</td>
          <td class="px-6 py-4">{{ recipe.description }}</td>
          <td class="px-6 py-4">{{ recipe.tag.name }}</td>
          <td class="px-6 py-4">{{ recipe.category[0].name }}</td>
          <td class="px-6 py-4 flex items-center gap-2">
            <svg
              class="w-6 h-6 text-red-600 dark:text-white cursor-pointer"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              @click="() => deleteRecipe(recipe)"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
              />
            </svg>

            <div
              @click="() => goToRecipeData(recipe)"
            >
              <svg
                class="w-6 h-6 text-yellow-400 dark:text-white cursor-pointer"
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
                  d="m14.304 4.844 2.852 2.852M7 7H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-4.5m2.409-9.91a2.017 2.017 0 0 1 0 2.853l-6.844 6.844L8 14l.713-3.565 6.844-6.844a2.015 2.015 0 0 1 2.852 0Z"
                />
              </svg>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <div
      v-if="recipesData.recipes.length < 0"
      class="w-full flex justify-center"
    >
      <img src="/assets/images/noData.svg" alt="" />
    </div>

    <div
      class="w-full flex items-center justify-center h-[200px]"
      v-if="recipesData.loading"
    >
      <PulseLoader />
    </div>
  </div>

  <div class="flex justify-center my-2">
    <nav aria-label="Page navigation example">
      <ul class="inline-flex -space-x-px text-sm">
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
          @click="() => getAllRecipes()"
        >
          <a
            href="#"
            class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >1</a
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

  <Modal :isOpen="isOpen" :setIsOpen="setIsOpen">
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
