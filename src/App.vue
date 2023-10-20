<script setup lang="ts">
import { Ref, ref, Suspense } from 'vue';
import { invoke } from '@tauri-apps/api/tauri';
import TestVBAN from './components/TestVBAN.vue';
import VbanProcessC from './components/VbanProcess.vue';
import { useProcessStore, VbanProcess } from './stores/vbanListStore';
const store = useProcessStore();
const enabled = ref(false);
const port = ref(6980);
const addressList: Ref<string[]> = ref([]);
const eProcessList = ref(store.getEmmiters);
const rProcessList = ref(store.getReceivers);


// V-Models
const name = ref('');
const isEmitter = ref(false);
invoke('get_network_adresses').then((addresses: any) => {
	addressList.value = addresses;
	// Filter out ipv6 addresses
	addressList.value = addressList.value.filter((address) => !address.includes(':'));
	// Remove CIDR bits from addresses
	addressList.value = addressList.value.map((address) => address.split('/')[0]);
});
const addProcess = () => {
	store.setProcess({
		type: isEmitter.value ? 'emitter' : 'receiver',
		name: name.value,
		port: 6980,
		target: '127.0.0.1',
	});
	eProcessList.value = store.getEmmiters;
	rProcessList.value = store.getReceivers;
};
const processSave = (data: VbanProcess) => {
	store.setProcess(data);
	eProcessList.value = store.getEmmiters;
	rProcessList.value = store.getReceivers;
};
const processDelete = (id: string) => {
	store.removeProcess(id);
	eProcessList.value = store.getEmmiters;
	rProcessList.value = store.getReceivers;
};
</script>

<template>
	<div class="container pt-4">
		<div class="upper flex justify-center text-xs w-screen">
			<div class="enabled-value flex justify-center flex-col">
				<span>
					Enabled:
				</span>
				<button class=" text-white font-bold py-2 px-4 rounded" :class="enabled ? 'bg-green-500' : 'bg-red-500'"
					@click="enabled = !enabled">
					{{ enabled ? 'Enabled' : 'Disabled' }}
				</button>
			</div>
			<div class="port-value flex justify-center flex-col">
				<span>
					Port:
				</span>
				<input class="border border-gray-400 rounded py-2 px-4" type="text" placeholder="Port" v-model="port" />
			</div>
			<div class="network-addresses flex justify-center flex-col">
				<span>
					Network addresses:
				</span>
				<div class="net-address p-1 border" v-for="address in addressList">
					<p>{{ address }}</p>
				</div>
			</div>
		</div>
		<div class="process-list flex items-center flex-col p-4 text-xs">
			<div class="add-process">
				<input class="border border-gray-400 rounded py-2 px-4" type="text" placeholder="Process name"
					v-model="name" />
				<select class="border border-gray-400 rounded py-2 px-4" v-model="isEmitter">
					<option :value="false">Receiver</option>
					<option :value="true">Emitter</option>
				</select>
				<button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" @click="addProcess">
					Add
				</button>
			</div>
			<div class="processes">
				<VbanProcessC :global-enabled="enabled" v-for="process in eProcessList" :id="process.id!" :key="process.id" @save="processSave" @delete="processDelete"/>
				<VbanProcessC :global-enabled="enabled" v-for="process in rProcessList" :id="process.id!" :key="process.id" @save="processSave" @delete="processDelete"/>
			</div>
		</div>
		<Suspense>
			<template #default>
				<TestVBAN />
			</template>
			<template #fallback>
				<div class="wait-test">
					<p>Waiting for VBAN test...</p>
				</div>
			</template>
		</Suspense>
	</div>
</template>
<style scoped></style>
