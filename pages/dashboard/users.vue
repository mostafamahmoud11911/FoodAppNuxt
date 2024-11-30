<script setup>
import axios from "axios";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

const usersList = reactive({
  users: [],
  loading: false,
});
const spinner = ref(false);
const searchByName = ref("");
const searchByEmail = ref("");
const searchByCountry = ref("");
const searchByRole = ref("");
const arrayOfPages = ref([]);
const isOpen = ref(false);
const userId = ref("");
const userName = ref("");

function setIsOpen(value) {
  isOpen.value = value;
}

const { token } = userData();

const getAllUsers = async (
  userName,
  email,
  country,
  groups,
  pageSize,
  pageNumber
) => {
  usersList.loading = true;
  try {
    const { data } = await axios.get(
      `https://upskilling-egypt.com:3006/api/v1/Users/?pageSize=${pageSize}&pageNumber=${pageNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
        params: {
          userName,
          email,
          country,
          groups,
        },
      }
    );
    usersList.users = data.data;
    arrayOfPages.value = Array(data.totalNumberOfPages)
      .fill()
      .map((_, i) => i + 1);
    usersList.loading = false;
  } catch (error) {
    usersList.loading = false;
    useNuxtApp().$toast.error(error.response.data.message);
  }
};

const getUserName = (event) => {
  const name = event.target.value;
  searchByName.value = name;
  getAllUsers(
    name,
    searchByEmail.value,
    searchByCountry.value,
    searchByRole.value,
    10,
    1
  );
};

const getUserEmail = (event) => {
  const email = event.target.value;
  searchByEmail.value = email;
  getAllUsers(
    searchByName.value,
    email,
    searchByCountry.value,
    searchByRole.value,
    10,
    1
  );
};

const getUserCountry = (event) => {
  const country = event.target.value;
  searchByCountry.value = country;
  getAllUsers(
    searchByName.value,
    searchByEmail.value,
    country,
    searchByRole.value,
    10,
    1
  );
};

const getUserRole = (event) => {
  const role = event.target.value;
  searchByRole.value = role;
  getAllUsers(
    searchByName.value,
    searchByEmail.value,
    searchByCountry.value,
    role,
    10,
    1
  );
};

// Delete User

const deleteUser = (user) => {
  isOpen.value = !isOpen.value;
  userId.value = user.id;
  userName.value = user.userName;
};

const handleDelete = async () => {
  spinner.value = true;
  try {
    const {data} = await axios.delete(`https://upskilling-egypt.com:3006/api/v1/Users/${userId.value}`, {
      headers: {
        Authorization: `Bearer ${token.value}`,
      }
    });
    useNuxtApp().$toast.success(data.message);
    setIsOpen(false);
    getAllUsers("", "", "", "", 10, 1);
  } catch (error) {
    useNuxtApp().$toast.error(error.response.data.message);
  }finally{
    spinner.value = false;
  }
};

onMounted(() => {
  getAllUsers("", "", "", "", 10, 1);
});

definePageMeta({
  middleware: "auth",
  layout: "master-layout",
});
</script>

<template>
  <Header />
  <div>
    <h5 class="text-md font-semibold">Users Table Details</h5>
    <p class="text-sm text-[#323C47]">You can check all details</p>
  </div>
  <div class="my-2 flex gap-2">
    <input
      type="text"
      id="first_name"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="name"
      @input="getUserName"
    />
    <input
      type="text"
      id="first_name"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="email"
      @input="getUserEmail"
    />
    <input
      type="text"
      id="first_name"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      placeholder="country"
      @input="getUserCountry"
    />
    <select
      id="countries"
      @input="getUserRole"
      class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    >
      <option selected value="">Choose a role</option>
      <option value="1">Admin</option>
      <option value="2">User</option>
    </select>
  </div>

  <div class="relative overflow-x-auto">
    <table
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400"
    >
      <thead class="text-xs text-gray-700 uppercase bg-[#E2E5EB]">
        <tr>
          <th scope="col" class="px-6 py-3">Index</th>
          <th scope="col" class="px-6 py-3">Name</th>
          <th scope="col" class="px-6 py-3">Image</th>
          <th scope="col" class="px-6 py-3">E-mail</th>
          <th scope="col" class="px-6 py-3">Country</th>
          <th scope="col" class="px-6 py-3">Role</th>
          <th scope="col" class="px-6 py-3">Phone Number</th>
          <th scope="col" class="px-6 py-3">Actions</th>
        </tr>
      </thead>
      <tbody v-if="!usersList.loading && usersList.users.length > 0">
        <tr
          v-for="(user, i) in usersList.users"
          :key="user.id"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
        >
          <td
            scope="row"
            class="px-6 py-4 font-medium whitespace-nowrap dark:text-white"
          >
            {{ i + 1 }}
          </td>
          <td class="px-6 py-4">{{ user.userName }}</td>
          <td class="px-6 py-4">
            <img
              :src="
                user.imagePath
                  ? 'https://upskilling-egypt.com:3006/' + user.imagePath
                  : 'https://t3.ftcdn.net/jpg/05/70/71/06/360_F_570710660_Jana1ujcJyQTiT2rIzvfmyXzXamVcby8.jpg'
              "
              alt=""
              class="w-10 h-10 rounded-md object-cover"
            />
          </td>
          <td class="px-6 py-4">{{ user.email }}</td>
          <td class="px-6 py-4">{{ user.country }}</td>
          <td class="px-6 py-4">{{ user.group.name }}</td>
          <td class="px-6 py-4">{{ user.phoneNumber }}</td>
          <td class="px-6 py-4 flex items-center">
            <svg
              class="w-6 h-6 text-red-600 dark:text-white cursor-pointer"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              @click="() => deleteUser(user)"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"
              />
            </svg>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="usersList.users.length < 0" class="w-full flex justify-center">
      <img src="/assets/images/noData.svg" alt="" />
    </div>

    <div class="w-full flex items-center justify-center h-[200px]" v-if="usersList.loading">
      <PulseLoader />
    </div>
  </div>

  <!-- Modal -->
  <Modal :isOpen="isOpen" :setIsOpen="setIsOpen">
    <div class="w-full flex flex-col items-center gap-2 mb-3">
      <img
        src="@/assets/images/noData.svg"
        class="text-center w-[200px]"
        alt=""
      />

      <h4 class="font-bold text-lg text-[#494949]">Delete This User ?</h4>
      <p class="text-[#49494999]">
        are you sure you want to delete this item <span class="font-bold">{{ userName }}</span> ? if you are sure just click
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

  <!-- Pagination -->
  <nav class="mt-3 flex justify-center" aria-label="Page navigation example">
    <ul class="flex flex-wrap gap-1 text-sm">
      <li>
        <a
          href="#"
          class="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
          >Previous</a
        >
      </li>

      <li
        v-for="page of arrayOfPages"
        :key="page"
        @click="
          () =>
            getAllUsers(
              searchByName,
              searchByEmail,
              searchByCountry,
              searchByRole,
              10,
              page
            )
        "
      >
        <a
          href="#"
          aria-current="page"
          class="flex items-center justify-center px-3 h-8 leading-tight   bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
</template>
