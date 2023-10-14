<script setup lang="ts">
import { ref } from 'vue';

const enabled = ref(false);
</script>

<template>
	<div class="container">
		<div class="upper flex justify-center">
			<div class="enabled-button flex justify-center">
				<button class=" text-white font-bold py-2 px-4 rounded" :class="enabled ? 'bg-green-500' : 'bg-red-500'" @click="enabled = !enabled">
					{{ enabled ? 'Enabled' : 'Disabled' }}
				</button>
			</div>
		</div>
	</div>
</template>

<style scoped></style>
