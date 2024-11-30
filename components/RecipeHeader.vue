<template>
  <div class="bg-[#F0FFEF] flex items-center justify-between p-5 mt-2">
    <div>
      <h5 class="text-xl">
        Fill the <span class="text-[#009247]">Recipe</span> !
      </h5>
      <p class="text-sm mt-2">
        you can now fill the meals easily using the table and form , <br />
        click here and sill it with the table !
      </p>
    </div>

    <NuxtLink to="/dashboard/recipes" class="flex gap-7 px-5 py-2 rounded text-white bg-[#009247]">
      Fill Recipes
      <svg
        class="w-6 h-6 text-white dark:text-white"
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
          d="M19 12H5m14 0-4 4m4-4-4-4"
        />
      </svg>
    </NuxtLink>
  </div>
</template>
