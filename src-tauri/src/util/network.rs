pub fn get_network_adresses() -> Vec<String> {
	let mut adresses: Vec<String> = Vec::new();
	let interfaces = pnet::datalink::interfaces();
	for interface in interfaces {
		for ip in interface.ips {
			adresses.push(ip.to_string());
		}
	}
	adresses
}