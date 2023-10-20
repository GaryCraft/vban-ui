<script setup lang="ts">
import { computed, ref } from 'vue';
import { VbanProcess, useProcessStore } from '../stores/vbanListStore';
import ProcessHandler from './ProcessHandler.vue';
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
	globalEnabled: Boolean,
});
const emit = defineEmits(['delete', 'save']);
// Stored Properties
const pStore = useProcessStore();
const type = pStore.getProcessType(props.id);
const process = computed(() => pStore.getProcess(props.id));
const targetPort = ref("");
const targetAddress = ref("");
const streamName = ref("");
// Local Properties
const isChanged = computed(() => {
	return (
		targetPort.value != `${process.value?.port}` ||
		targetAddress.value != process.value?.target ||
		streamName.value != process.value?.name
	);
});
const enabled = ref(false);
const error = ref('');
// Methods
const fetchStore = () => {
	targetPort.value = `${process.value?.port}`;
	targetAddress.value = `${process.value?.target}`;
	streamName.value = `${process.value?.name}`;
}
const saveMe = () => {
	// Check validity of port and address
	if (targetPort.value == "" || targetAddress.value == "") {
		error.value = "Port or address is empty";
		enabled.value = false;
		return;
	}
	const portRegx = /^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$/;
	const addrRegx = /^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$/;
	if (!portRegx.test(targetPort.value) || !addrRegx.test(targetAddress.value)) {
		error.value = "Invalid port or address";
		enabled.value = false;
		return;
	}
	error.value = "";
	emit('save', {
		id: props.id,
		enabled: enabled.value,
		port: parseInt(targetPort.value),
		target: targetAddress.value,
		name: streamName.value,
		type: type,
	} as VbanProcess);
	fetchStore();
}
const deleteMe = () => {
	emit('delete', props.id);
}
fetchStore();
</script>
<template>
	<div class="process-container flex justify-center m-2 flex-row border-opacity-75 
		border-2 border-gray-400
	">
		<div class="process text-xs flex flex-row items-center">
			<div class="process-type px-2">
				<mdicon name="export" v-if="type == 'emitter'" />
				<mdicon name="import" v-else />
			</div>
			<div class="target-address">
				<!-- Validate the address -->
				<input class="border border-gray-400 py-2 px-4" type="text" placeholder="Address" v-model="targetAddress"
					pattern="^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}$" />
			</div>
			<div class="target-port">
				<!-- Validate the port -->
				<input class="border border-gray-400 py-2 px-4" type="text" placeholder="Port" v-model="targetPort"
					pattern="^((6553[0-5])|(655[0-2][0-9])|(65[0-4][0-9]{2})|(6[0-4][0-9]{3})|([1-5][0-9]{4})|([0-5]{0,5})|([0-9]{1,4}))$" />
			</div>
			<div class="stream-name">
				<input class="border border-gray-400 py-2 px-4" type="text" placeholder="Stream name"
					v-model="streamName" />
			</div>
			<div class="process-enabled px-2">
				<button class="text-white font-bold py-2 px-4"
					:class="enabled && globalEnabled ? 'bg-green-500' : 'bg-red-500'" @click="enabled = !enabled">
					{{ enabled ? 'Enabled' : 'Disabled' }}
				</button>
			</div>
		</div>
		<div class="store-options">
			<mdicon name="content-save" @click="saveMe" :class="isChanged ? 'text-green-500' : 'text-gray-500'"
				class="cursor-pointer" />
			<mdicon name="delete" @click="deleteMe" class="cursor-pointer" />
			<div class="error" v-if="error !== ''">
				<mdicon name="error" />
				<div class="error-alert flex justify-center items-center">
					{{ error }}
				</div>
			</div>
		</div>
		<Suspense>
			<ProcessHandler v-if="enabled && globalEnabled" :id="props.id" />
		</Suspense>
	</div>
</template>
<style scoped>
.error-alert {
	float: right;
}
</style>