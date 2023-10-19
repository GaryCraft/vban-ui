<template>
	<div class="hidden">

	</div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { VbanProcess, useProcessStore } from '../stores/vbanListStore';
import { Command } from '@tauri-apps/api/shell';

const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});
const pStore = useProcessStore();
const p = computed(() => pStore.getProcess(props.id));
const buildCommand = (data: VbanProcess): string => {
	const cmd: string[] = [];
	if (data.type == 'emitter') {
		cmd.push('vban_emitter');
	} else {
		cmd.push('vban_receptor');
	}
	`${data.port}` !== '' && cmd.push(`-p ${data.port}`);
	`${data.target}` !== '' && cmd.push(`-t ${data.target}`);
	`${data.name}` !== '' && cmd.push(`-s ${data.name}`);
	console.info("Executing command: " + cmd.join(' '));
	return cmd.join(' ');
}
console.log("Initializing process handler for " + p.value?.name);
// Start process
if (!p.value) {
	console.error('Process not found');
}
else {
	const cmd = new Command(buildCommand(p.value));
	cmd.execute();
}

</script>