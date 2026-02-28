<template>
  <div class="flex flex-col min-h-screen bg-white">
    <!-- Header -->
    <header class="h-16 border-b border-gray-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
      <!-- Left: Logo -->
      <div class="flex items-center gap-2">
        <div class="bg-primary w-8 h-8 flex items-center justify-center rounded-md text-white font-bold text-lg">
          T
        </div>
        <span class="text-lg font-semibold text-primary">TaskFlow</span>
      </div>

      <!-- Right: User Info -->
      <div class="flex items-center gap-4">
        <!-- Notification Icon -->
        <button class="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="text-gray-600"><path fill="currentColor" d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 0 0 2 2m6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1z" /></svg>
          <!-- Notification Badge -->
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        <!-- Dark/Light Mode Toggle -->
        <button class="p-2 rounded-lg hover:bg-gray-100 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="text-gray-600"><path fill="currentColor" d="M12 21q-3.775 0-6.387-2.613T3 12q0-3.45 2.25-5.988T11 3.05q.325-.05.575.088t.4.362q.15.225.163.525t-.188.575q-.425.65-.638 1.375T11.1 7.5q0 2.25 1.575 3.825T16.5 12.9q.775 0 1.538-.225t1.362-.625q.275-.175.563-.162t.512.137q.25.125.388.375t.087.6q-.35 3.45-2.937 5.725T12 21" /></svg>
        </button>

        <!-- User Info with Dropdown -->
        <div class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors">
          <span class="text-sm font-medium text-gray-700">{{ user?.name || 'User' }}</span>
          <img
            :src="user?.avatar || 'https://i.pravatar.cc/100?img=10'"
            alt="User avatar"
            class="w-9 h-9 rounded-full object-cover border-2 border-gray-200"
          >
          <!-- Dropdown Arrow -->
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" class="text-gray-600"><path fill="currentColor" d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6l-6-6z" /></svg>
        </div>
      </div>
    </header>
    <slot />
  </div>
</template>
