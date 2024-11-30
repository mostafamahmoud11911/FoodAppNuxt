<script setup>
const isOpen = ref(false);

const isActive = (path) => {
  return useRoute().path === path; // Use `useRoute` to get the current route and compare paths
};

const { logout } = useAuth();

function setIsOpen(value) {
  isOpen.value = value;
}

console.log(isOpen.value);
</script>

<template>
  <div class="side-container">
    <div class="img-container">
      <img src="../assets/images/3.png" alt="" />
    </div>
    <div class="wrapper">
      <ul>
        <li
          :class="{
            'bg-[#00924d1a] border-l-[3px] border-[#009247]':
              isActive('/dashboard'), // Apply these styles if the route is active
          }"
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
              d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5"
            />
          </svg>

          <NuxtLink to="/dashboard">Home</NuxtLink>
        </li>
        <li
          :class="{
            'bg-[#00924d1a] border-l-[3px] border-[#009247]':
              isActive('/dashboard/users'), // Apply these styles if the route is active
          }"
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
              stroke-width="2"
              d="M16 19h4a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-2m-2.236-4a3 3 0 1 0 0-4M3 18v-1a3 3 0 0 1 3-3h4a3 3 0 0 1 3 3v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1Zm8-10a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            />
          </svg>

          <NuxtLink to="/dashboard/users">Users</NuxtLink>
        </li>
        <li
          :class="{
            'bg-[#00924d1a] border-l-[3px] border-[#009247]':
              isActive('/dashboard/recipes'), // Apply these styles if the route is active
          }"
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
              d="M9 5v14m8-7h-2m0 0h-2m2 0v2m0-2v-2M3 11h6m-6 4h6m11 4H4c-.55228 0-1-.4477-1-1V6c0-.55228.44772-1 1-1h16c.5523 0 1 .44772 1 1v12c0 .5523-.4477 1-1 1Z"
            />
          </svg>

          <NuxtLink to="/dashboard/recipes">Recipes</NuxtLink>
        </li>
        <li
          :class="{
            'bg-[#00924d1a] border-l-[3px] border-[#009247]': isActive(
              '/dashboard/category'
            ), // Apply these styles if the route is active
          }"
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
              d="M3 11h18M3 15h18M8 10.792V19m4-8.208V19m4-8.208V19M4 19h16a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1Z"
            />
          </svg>

          <NuxtLink to="/dashboard/category">Category</NuxtLink>
        </li>
        <li
          :class="{
            'bg-[#00924d1a] border-l-[3px] border-[#009247]':
              isActive('/changepass'), // Apply these styles if the route is active
          }"
          @click="setIsOpen(true)"
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

          Change Password
        </li>
        <li
          @click="logout"
          :class="{
            'bg-[#00924d1a] border-l-[3px] border-[#009247]':
              isActive('/logout'), // Apply these styles if the route is active
          }"
        >
          Log out
        </li>
      </ul>
    </div>
  </div>

  <div class="fixed top-0 right-0">
    <Modal :isOpen="isOpen" :setIsOpen="setIsOpen">
      <ChangePass />
    </Modal>
  </div>

</template>

<style scoped>
/* Optional: Add transition effects to make opening/closing the sidebar smoother */
.side-container {
  height: 100vh;
  background-color: #1f263e;
  color: white;
  border-top-right-radius: 2.5rem;
  width: 230px;
}

.img-container {
  padding: 1rem;
}

li {
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
}
svg {
  color: white;
}

li:hover {
  background: #00924d1a;
  border-left: 3px solid #009247;
  transition: 0.02s;
}
</style>
