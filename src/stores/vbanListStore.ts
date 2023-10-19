import { defineStore } from 'pinia'
export type VbanProcessType = "emitter" | "receiver";
export type VbanProcess = {
	id?: string;
	type: VbanProcessType;
	target: string;
	port: number;
	name: string;
};

export const useProcessStore = defineStore('process', {
	state: () => ({
		processes: new Map<string, VbanProcess>()
	}),
	getters: {
		getEmmiters: (state) => {
			const a = state.processes.values();
			const r = Array.from(a).filter(p => p.type === "emitter");
			return r;
		},
		getReceivers: (state) => {
			const a = state.processes.values();
			const r = Array.from(a).filter(p => p.type === "receiver");
			return r;
		},
		getProcessType: (state) => (id: string) => {
			const p = state.processes.get(id);
			if (p) {
				return p.type;
			}
			return null;
		},
		getProcess: (state) => (id: string) => {
			const p = state.processes.get(id);
			if (p) {
				return p;
			}
			return null;
		},
	},
	actions: {
		setProcess(process: VbanProcess) {
			if (process.id) {
				this.processes.set(process.id, process);
				return;
			}
			// Id is uuid
			const id = Math.random().toString(36).substring(7);
			this.processes.set(id, { ...process, id });
		},
		removeProcess(id: string) {
			this.processes.delete(id);
		}
	}
})