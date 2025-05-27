<template>
  <div
    class="min-h-screen flex items-center justify-center bg-[#0d0d0d] text-white relative overflow-hidden"
  >
    <!-- Background Glows -->
    <div
      class="absolute -top-40 -left-40 w-96 h-96 bg-[#FD6407]/30 rounded-full filter blur-3xl opacity-70 z-0 animate-pulse"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-80 h-80 bg-[#F10B36]/30 rounded-full filter blur-3xl opacity-60 z-0 animate-ping"
    ></div>

    <!-- Back to Home -->
    <a
      href="http://obodetek.com/"
      class="absolute top-6 left-6 flex items-center text-white text-sm font-medium hover:text-[#FD6407] transition-all duration-300"
    >
      <span class="text-2xl mr-2">←</span> Back to Home
    </a>

    <!-- Login Card -->
    <div
      class="relative z-10 w-full max-w-sm p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_30px_#FD6407] neon-border animate-fade-in"
    >
      <!-- Logo & Title -->
      <div class="flex flex-col items-center mb-6">
        <img
          src="/mainfavicon.png"
          alt="Logo"
          class="h-14 w-14 mb-2 animate-pop"
        />
        <h1
          class="text-3xl font-bold tracking-widest text-white uppercase drop-shadow-[0_0_5px_#FD6407]"
        >
          Obodetek
        </h1>
      </div>

      <h2 class="text-xl font-semibold text-center mb-4 text-gray-200">
        Login to your dashboard
      </h2>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#FD6407]"
          required
        />
        <input
          v-model="password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 rounded-xl bg-white/10 text-white placeholder-gray-300 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#FD6407]"
          required
        />
        <button
          class="w-full bg-gradient-to-r from-[#FD6407] to-[#F10B36] hover:from-[#F10B36] hover:to-[#FD6407] transition-all duration-300 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-[0_0_15px_#FD6407]"
        >
          Login
        </button>
        <p class="text-sm text-center text-gray-400 mt-2">
          Use <strong>admin@example.com</strong> / <strong>password</strong>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("admin@example.com");
const password = ref("password");
const router = useRouter();

function handleLogin() {
  if (email.value === "admin@example.com" && password.value === "password") {
    localStorage.setItem("auth", "true");
    router.push("/");
  } else {
    alert("Invalid credentials");
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pop {
  0% {
    transform: scale(0.85);
    opacity: 0.3;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out;
}

.animate-pop {
  animation: pop 0.6s ease-out;
}

.neon-border {
  box-shadow: 0 0 8px #fd6407, 0 0 16px #fd6407, 0 0 24px #f10b36,
    0 0 40px #f10b36;
  transition: box-shadow 0.5s ease-in-out;
}
</style>

in this code add a arrow with " Back to Home"
