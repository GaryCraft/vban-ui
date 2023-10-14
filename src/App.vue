<script setup lang="ts">
import { ref } from 'vue';

const enabled = ref(false);
const port = ref(6980);
</script>

<template>
	<div class="container">
		<div class="upper flex justify-center">
			<div class="enabled-value flex justify-center">
				<button class=" text-white font-bold py-2 px-4 rounded" :class="enabled ? 'bg-green-500' : 'bg-red-500'" @click="enabled = !enabled">
					{{ enabled ? 'Enabled' : 'Disabled' }}
				</button>
			</div>
			<div class="port-value flex justify-center">
				<input class="border border-gray-400 rounded py-2 px-4" type="text" placeholder="Port" v-model="port" />
			</div>
		</div>
	</div>
</template>

<style scoped></style>
