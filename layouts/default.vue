<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="bg-white dark:bg-blue-800 shadow-md">
      <div class="container mx-auto px-4 py-4">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            <NuxtLink to="/" class="hover:opacity-80 transition-opacity"> Polish Football League </NuxtLink>
          </h1>
        </div>
      </div>
    </header>

    <main class="container mx-auto grow px-4 py-8">
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
