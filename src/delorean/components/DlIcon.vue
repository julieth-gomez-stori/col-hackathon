<script setup>
defineProps({
  name: {
    type: String,
    required: true,
    validator: (value) =>
      ['favorite', 'favorite-filled', 'close-bold', 'check', 'chevron'].includes(value),
  },
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      v-if="name === 'favorite'"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.487 3.557v.002l1.866 5.913h5.998c.498 0 .687.62.314.912l-4.85 3.75 1.808 6.006c.156.502-.425.834-.794.558l-.002-.002L12 17.006l-4.821 3.686c-.401.316-.944-.087-.803-.55l.001-.004 1.808-6.004-4.848-3.75h-.001c-.389-.304-.164-.912.314-.912h3.366v.984H5.038l4.284 3.314-1.581 5.252 4.258-3.255 4.259 3.255-1.582-5.252 4.286-3.314h-5.33L12 5.286l-1.632 5.17H8v-.984h1.647l1.866-5.913v-.002a.51.51 0 0 1 .974 0"
    />
    <path
      v-else-if="name === 'favorite-filled'"
      fill="currentColor"
      d="M11.513 3.559a.51.51 0 0 1 .974 0l1.866 5.913h5.998c.498 0 .687.62.314.912l-4.85 3.75 1.808 6.006c.156.502-.425.834-.794.558L12 17.006l-4.821 3.686c-.401.316-.944-.087-.803-.55l1.809-6.008-4.848-3.75c-.389-.304-.164-.912.314-.912h5.996z"
    />
    <path
      v-else-if="name === 'close-bold'"
      fill="currentColor"
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M12.0036 9.96144L18.9649 3.00005L21.0034 5.03852L14.042 11.9999L12.0036 9.96144ZM3.00244 5.03933L5.04092 3.00085L11.9921 9.95205L9.95364 11.9905L3.00244 5.03933ZM12.0022 14.0393L14.0407 12.0009L20.9919 18.9521L18.9534 20.9905L12.0022 14.0393ZM9.96383 12.0004L3.00244 18.9618L5.04092 21.0003L12.0023 14.0389L9.96383 12.0004Z"
    />
    <path
      v-else-if="name === 'check'"
      fill="none"
      stroke="currentColor"
      stroke-width="2.5"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M4 12.5 9.5 18 20 6.5"
    />
    <path
      v-else
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      d="m6 9 6 6 6-6"
    />
  </svg>
</template>
