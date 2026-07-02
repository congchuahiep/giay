use std::path::Path;

fn main() {
    println!("cargo:rerun-if-changed=../.env");

    let env_path = Path::new("../.env");

    dotenvy::from_path_iter(env_path)
        .into_iter()
        .flatten()
        .flatten()
        .for_each(|(key, val)| println!("cargo:rustc-env={key}={val}"));

    tauri_build::build()
}
