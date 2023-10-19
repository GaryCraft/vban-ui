// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// macro for async runtime
mod util;
#[tauri::command]
async fn test_vban() -> bool {
    // Run process "vban_sendtext" without arguments
    let output = match std::process::Command::new("vban_sendtext").output() {
        Ok(_) => true,
        Err(_) => false,
    };
    output
}
#[tauri::command]
async fn get_network_adresses() -> Vec<String> {
    util::network::get_network_adresses()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            test_vban,
            get_network_adresses,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
