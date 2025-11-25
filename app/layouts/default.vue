<script setup>
// const user = useState('user', () => null)
</script>

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

    <div class="flex flex-1">
      <!-- Sidebar Navigation -->
      <aside class="w-[250px] bg-white p-5 border-r border-gray-200 flex flex-col">
        <nav class="flex flex-col gap-4 flex-1">
          <NuxtLink
            to="/dashboard"
            class="flex items-center gap-3 px-4 py-3 text-gray-500 no-underline rounded-lg transition-all duration-200 text-[15px] hover:bg-gray-100 hover:text-gray-700"
            active-class="!bg-primary !text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 15 15" class="shrink-0"><path fill="currentColor" d="M5.25 8c.228 0 .426 0 .6.042a1.5 1.5 0 0 1 1.11 1.107c.04.175.04.373.04.601v2.5c0 .228 0 .426-.041.6a1.5 1.5 0 0 1-1.109 1.11c-.174.04-.372.04-.6.04h-2.5c-.228 0-.426 0-.6-.041a1.5 1.5 0 0 1-1.108-1.108C1 12.676 1 12.478 1 12.25v-2.5c0-.228 0-.426.042-.6a1.5 1.5 0 0 1 1.107-1.108C2.324 8 2.522 8 2.75 8zm7 0c.228 0 .426 0 .6.042a1.5 1.5 0 0 1 1.109 1.107c.042.175.041.373.041.601v2.5c0 .228 0 .426-.041.6a1.5 1.5 0 0 1-1.108 1.109c-.175.042-.373.041-.601.041h-2.5c-.228 0-.426 0-.6-.041a1.5 1.5 0 0 1-1.108-1.108C8 12.676 8 12.478 8 12.25v-2.5c0-.228 0-.426.042-.6a1.5 1.5 0 0 1 1.107-1.108C9.324 8 9.522 8 9.75 8zM2.8 9c-.307 0-.373.003-.416.014a.5.5 0 0 0-.37.37c-.01.043-.014.11-.014.416v2.4c0 .308.003.374.014.417a.5.5 0 0 0 .37.37c.043.01.11.013.416.013h2.4c.308 0 .374-.003.417-.014a.5.5 0 0 0 .37-.369c.01-.043.013-.11.013-.417V9.8c0-.307-.003-.373-.014-.416a.5.5 0 0 0-.369-.37C5.574 9.004 5.507 9 5.2 9zm7 0c-.307 0-.373.003-.416.014a.5.5 0 0 0-.37.37c-.01.043-.014.11-.014.416v2.4c0 .308.003.374.014.417a.5.5 0 0 0 .37.37c.043.01.11.013.416.013h2.4c.308 0 .374-.003.417-.014a.5.5 0 0 0 .37-.369c.01-.043.013-.11.013-.417V9.8c0-.307-.004-.373-.014-.416a.5.5 0 0 0-.369-.37c-.043-.01-.11-.014-.417-.014zM5.25 1c.228 0 .426 0 .6.042a1.5 1.5 0 0 1 1.11 1.107c.04.175.04.373.04.601v2.5c0 .228 0 .426-.041.6A1.5 1.5 0 0 1 5.85 6.96c-.174.04-.372.04-.6.04h-2.5c-.228 0-.426 0-.6-.041A1.5 1.5 0 0 1 1.041 5.85C1 5.676 1 5.478 1 5.25v-2.5c0-.228 0-.426.042-.6a1.5 1.5 0 0 1 1.107-1.108C2.324 1 2.522 1 2.75 1zm7 0c.228 0 .426 0 .6.042a1.5 1.5 0 0 1 1.109 1.107c.042.175.041.373.041.601v2.5c0 .228 0 .426-.041.6a1.5 1.5 0 0 1-1.109 1.11c-.174.04-.372.04-.6.04h-2.5c-.228 0-.426 0-.6-.041A1.5 1.5 0 0 1 8.041 5.85C8 5.676 8 5.478 8 5.25v-2.5c0-.228 0-.426.042-.6a1.5 1.5 0 0 1 1.107-1.108C9.324 1 9.522 1 9.75 1zM2.8 2c-.307 0-.373.003-.416.014a.5.5 0 0 0-.37.37c-.01.043-.014.11-.014.416v2.4c0 .308.003.374.014.417a.5.5 0 0 0 .37.37c.043.01.11.013.416.013h2.4c.308 0 .374-.003.417-.014a.5.5 0 0 0 .37-.369c.01-.043.013-.11.013-.417V2.8c0-.307-.003-.373-.014-.416a.5.5 0 0 0-.369-.37C5.574 2.004 5.507 2 5.2 2zm7 0c-.307 0-.373.003-.416.014a.5.5 0 0 0-.37.37c-.01.043-.014.11-.014.416v2.4c0 .308.003.374.014.417a.5.5 0 0 0 .37.37c.043.01.11.013.416.013h2.4c.308 0 .374-.003.417-.014a.5.5 0 0 0 .37-.369c.01-.043.013-.11.013-.417V2.8c0-.307-.004-.373-.014-.416a.5.5 0 0 0-.369-.37c-.043-.01-.11-.014-.417-.014z" /></svg>
            <span>Dashboard</span>
          </NuxtLink>

          <NuxtLink
            to="/teams"
            class="flex items-center gap-3 px-4 py-3 text-gray-500 no-underline rounded-lg transition-all duration-200 text-[15px] hover:bg-gray-100 hover:text-gray-700"
            active-class="!bg-primary !text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16" class="shrink-0"><path fill="currentColor" d="M6.002 4a1.998 1.998 0 1 1 3.996 0a1.998 1.998 0 0 1-3.996 0M8 3.002a.998.998 0 1 0 0 1.996a.998.998 0 0 0 0-1.996M11 4.5a1.5 1.5 0 1 1 3 0a1.5 1.5 0 0 1-3 0m1.5-.5a.5.5 0 1 0 0 1a.5.5 0 0 0 0-1m-9-1a1.5 1.5 0 1 0 0 3a1.5 1.5 0 0 0 0-3M3 4.5a.5.5 0 1 1 1 0a.5.5 0 0 1-1 0M4.268 7A2 2 0 0 0 4 8H2v2.5a1.5 1.5 0 0 0 2.096 1.377c.074.331.19.647.34.942A2.5 2.5 0 0 1 1 10.5V8a1 1 0 0 1 1-1zm7.296 5.819A2.5 2.5 0 0 0 15 10.5V8a1 1 0 0 0-1-1h-2.268c.17.294.268.635.268 1h2v2.5a1.5 1.5 0 0 1-2.096 1.377q-.114.498-.34.942M6 6.999a1 1 0 0 0-1 1V11a3 3 0 0 0 6 0V8a1 1 0 0 0-1-1zm0 1h4V11a2 2 0 0 1-4 0z" /></svg>
            <span>Teams</span>
          </NuxtLink>

          <NuxtLink
            to="/projects"
            class="flex items-center gap-3 px-4 py-3 text-gray-500 no-underline rounded-lg transition-all duration-200 text-[15px] hover:bg-gray-100 hover:text-gray-700"
            active-class="!bg-primary !text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="shrink-0"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M12 12V6m-5 8V6m10 10V6M5.4 3h13.2A2.4 2.4 0 0 1 21 5.4v13.2a2.4 2.4 0 0 1-2.4 2.4H5.4A2.4 2.4 0 0 1 3 18.6V5.4A2.4 2.4 0 0 1 5.4 3" /></svg>
            <span>Projects</span>
          </NuxtLink>

          <NuxtLink
            to="/reports"
            class="flex items-center gap-3 px-4 py-3 text-gray-500 no-underline rounded-lg transition-all duration-200 text-[15px] hover:bg-gray-100 hover:text-gray-700"
            active-class="!bg-primary !text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 32 32" class="shrink-0"><path fill="currentColor" d="M15 20h2v4h-2zm5-2h2v6h-2zm-10-4h2v10h-2z" /><path fill="currentColor" d="M25 5h-3V4a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v1H7a2 2 0 0 0-2 2v21a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2M12 4h8v4h-8Zm13 24H7V7h3v3h12V7h3Z" /></svg>
            <span>Reports</span>
          </NuxtLink>
        </nav>
      </aside>

      <!-- Main Content -->
      <main class="flex-1 p-10 bg-gray-100">
        <slot />
      </main>
    </div>
  </div>
</template>
