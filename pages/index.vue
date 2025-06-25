<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500">
    <div class="bg-white p-8 rounded-2xl shadow-md max-w-md w-full text-center">
      <h1 class="text-2xl font-bold mb-2">Shopify Order File Generator</h1>
      <p class="text-gray-600 mb-6">
        This will generate a new order file from an existing order<br />and send it to live server.
      </p>
      <form @submit.prevent="handleGenerate">
        <label class="block text-left text-sm font-medium text-gray-700 mb-1" for="orderId">
          Shopify ordernr
        </label>
        <input
          v-model="orderId"
          id="orderId"
          type="text"
          placeholder="Skriv inn ordernummer..."
          class="w-full p-3 border border-gray-300 rounded-md mb-4"
        />
        <button
          type="submit"
          class="w-full py-3 text-white font-semibold rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 hover:opacity-90 transition"
        >
          Generate file
        </button>
      </form>
      <p v-if="status" class="mt-4 text-sm text-green-700">{{ status }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const orderId = ref('')
const status = ref('')

const handleGenerate = async () => {
  if (!orderId.value) return alert('Please enter an order number')
  try {
    const { data, error } = await useFetch('/api/generate-file', {
      method: 'POST',
      body: { orderId: orderId.value }
    })
    if (error.value) throw error.value
    status.value = data.value?.message || 'File generated successfully.'
  } catch (err) {
    status.value = 'Error generating file.'
    console.error(err)
  }
}
</script>
