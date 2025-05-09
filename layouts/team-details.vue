<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <header class="bg-gradient-to-r from-blue-600 to-blue-800 shadow-md">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-white">Team Details</h1>
        </div>
      </div>
    </header>

    <main class="container mx-auto grow px-4 py-2">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-100 dark:bg-blue-800 py-6 mt-12">
      <div class="container mx-auto px-4">
        <div class="text-center text-gray-600 dark:text-gray-400">
          <p>© {{ new Date().getFullYear() }} Polish Football League. All rights reserved.</p>
          <p class="mt-2 text-sm">Data is for demonstration purposes only.</p>
        </div>
      </div>
    </footer>
  </div>
</template>
