<template>
  <div class="flex">
    <!-- Sidebar -->
    <Sidebar />

    <!-- Page Content -->
    <main class="flex-1 bg-gray-100 p-4 overflow-auto h-screen">
      <Navbar />
      <slot />
    </main>
  </div>
</template>

<script setup></script>
