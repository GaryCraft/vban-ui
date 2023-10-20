<script setup lang="ts">
import { Ref, computed, ref } from 'vue';
import { VbanProcess, useProcessStore } from '../stores/vbanListStore';
import { Command } from '@tauri-apps/api/shell';
type Status = "healty" | "stopped";
const props = defineProps({
	id: {
		type: String,
		required: true,
	},
});
const pStore = useProcessStore();
const p = computed(() => pStore.getProcess(props.id));
const status: Ref<Status> = ref("stopped")
const setStatus = (s: Status) => {
	status.value = s;
}
const consoleVisible = ref(false);
const lines = ref<string[]>([]);
const output = computed(() => lines.value.join('\n'));
const buildCommand = (data: VbanProcess) => {
	let cmd: string = data.type == 'emitter' ? 'vban_emitter' : 'vban_receptor';
	const args: string[] = [];
	`${data.port}` !== '' && args.push(`-p ${data.port}`);
	`${data.target}` !== '' && args.push(`-t ${data.target}`);
	`${data.name}` !== '' && args.push(`-s ${data.name}`);
	console.info("Executing command: " + args.join(' '));
	return { cmd: cmd, args: args.join(' ') }
}
console.log("Initializing process handler for " + p.value?.name);
// Start process
if (!p.value) {
	console.error('Process not found');
}
else {
	try {
		const c = buildCommand(p.value);
		const cmd = new Command(c.cmd, c.args);
		setStatus("healty");
		cmd.addListener('close', () => {
			console.log("Process closed");
			setStatus("stopped");
		});
		cmd.stdout.on('data', (data) => {
			console.log(data);
			lines.value.push(data);
			setStatus("healty");
		});
		cmd.stderr.on('data', (data) => {
			console.error(data);
			lines.value.push(data);
			setStatus("stopped");
		});
		cmd.on('error', (err) => {
			console.error(err);
			setStatus("stopped");
		});
		console.log("Starting process");
		const out = await cmd.execute();
		console.log(out);
	} catch (e) {
		lines.value.push(e as string);
		console.error(e);
		setStatus("stopped");
	}
}

</script>
<template>
	<div class="process">
		<!-- Small Green or red bar depending on status -->
		<div class="status cursor-pointer" :class="status" @click="consoleVisible = !consoleVisible">
		</div>
		<div class="console" v-if="consoleVisible">
			<!-- Console output -->
			<pre>{{ output }}</pre>
		</div>
	</div>
</template>
<style scoped>
.process {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
}

.status {
	width: 10px;
	height: 90%;
	border-radius: 10%;
	margin-right: 10px;
}

.console {
	z-index: 100;
	display: flex;
	position: absolute;
	/* Centered on the screen */
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	/* Styling */
	width: 40%;
	height: 30%;
	background-color: rgb(0, 0, 0);
	color: rgb(255, 255, 255);
	overflow: scroll;
}

.healty {
	background-color: green;
}

.stopped {
	background-color: red;
}
</style>