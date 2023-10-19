<script setup lang="ts">
import { ref } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';


const testResult = await invoke('test_vban')
const errored = ref(!testResult);
console.log(testResult);
console.log(errored.value);
</script>
<template>
	<div class="blackout flex justify-center items-center"  v-if="errored">
		<div class="modal w-72 h-64 bg-white rounded-lg shadow-lg overflow-hidden
	">
			<div class="modal-content w-full h-full">
				<div class="modal-header flex justify-center">
					<h2>VBAN Test</h2>
				</div>
				<div class="modal-body flex justify-center">
					<div class="modal-message flex justify-center">
						<p class="text-center text-gray-700">
							VBAN is not installed, please install it and restart the application.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.blackout {
	position: fixed;
	z-index: 1;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
}
.modal {
	position: fixed;
	z-index: 1;
	bottom: 0;
	right: 0;
}

.modal-content {
	display: flex;
	flex-direction: column;
}

.modal-header {
	padding: 1rem;
}

.modal-body {
	padding: 1rem;
}

.modal-message {
	padding: 1rem;
}</style>