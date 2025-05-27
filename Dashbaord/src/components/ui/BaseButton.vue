<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value: string) => {
      return ['primary', 'secondary', 'danger', 'success', 'warning', 'info', 'gradient'].includes(value);
    }
  },
  size: {
    type: String,
    default: 'md',
    validator: (value: string) => {
      return ['sm', 'md', 'lg'].includes(value);
    }
  },
  icon: {
    type: String,
    default: ''
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  glass: {
    type: Boolean,
    default: false
  }
});

const buttonClasses = computed(() => {
  const classes = [
    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none',
    props.disabled || props.loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg',
  ];

  // Size
  switch (props.size) {
    case 'sm':
      classes.push('text-xs px-3 py-1.5');
      break;
    case 'lg':
      classes.push('text-base px-6 py-3');
      break;
    default:
      classes.push('text-sm px-4 py-2');
      break;
  }

  // Full width
  if (props.fullWidth) {
    classes.push('w-full');
  }

  // Styling based on variant
  if (props.glass) {
    classes.push('backdrop-blur-md border border-opacity-30');
    
    switch (props.variant) {
      case 'primary':
        classes.push('bg-obodetek-purple/10 border-obodetek-purple/30 text-obodetek-purple hover:bg-obodetek-purple/20');
        break;
      case 'secondary':
        classes.push('bg-white/10 border-white/20 text-white hover:bg-white/20');
        break;
      case 'danger':
        classes.push('bg-red-500/10 border-red-500/30 text-red-400 hover:bg-red-500/20');
        break;
      case 'success':
        classes.push('bg-green-500/10 border-green-500/30 text-green-400 hover:bg-green-500/20');
        break;
      case 'warning':
        classes.push('bg-yellow-500/10 border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/20');
        break;
      case 'info':
        classes.push('bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20');
        break;
      case 'gradient':
        classes.push('gradient-btn');
        break;
    }
  } else {
    switch (props.variant) {
      case 'primary':
        classes.push('bg-obodetek-purple text-white hover:bg-opacity-90');
        break;
      case 'secondary':
        classes.push('bg-gray-700 text-white hover:bg-gray-600');
        break;
      case 'danger':
        classes.push('bg-red-500 text-white hover:bg-red-600');
        break;
      case 'success':
        classes.push('bg-green-500 text-white hover:bg-green-600');
        break;
      case 'warning':
        classes.push('bg-yellow-500 text-black hover:bg-yellow-600');
        break;
      case 'info':
        classes.push('bg-blue-500 text-white hover:bg-blue-600');
        break;
      case 'gradient':
        classes.push('gradient-btn');
        break;
    }
  }

  return classes.join(' ');
});
</script>

<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <span v-if="icon" class="mr-2" v-html="icon"></span>
    <slot></slot>
  </button>
</template>