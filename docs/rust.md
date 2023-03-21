https://rustup.rs/

```
pnpm add -D @tauri-apps/cli
```

```
➜  intuition git:(master) ✗ ll $HOME/.cargo/bin
total 241280
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 cargo
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 cargo-clippy
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 cargo-fmt
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 cargo-miri
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 clippy-driver
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 rls
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 rust-gdb
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 rust-gdbgui
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 rust-lldb
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 rustc
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 rustdoc
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 rustfmt
-rwxr-xr-x  13 loco  staff   9.1M Mar 21 13:29 rustup
➜  intuition git:(master) ✗ which cargo
```

# extensions

-   crates
    -   Helps Rust developers managing dependencies with Cargo.toml. Only works with dependencies from crates.io.
-   better toml
    -   toml support

---

```
➜  intuition git:(master) ✗ pnpm tauri dev
     Running BeforeDevCommand (`pnpm dev`)
        Info Watching /Users/loco/dev/intuition/src-tauri for changes...
error: package `raw-window-handle v0.5.1` cannot be built because it requires rustc 1.64 or newer, while the currently active rustc version is 1.63.0
```

```sh
rustup show
cargo --version
rustc --version
```

```sh
cargo --version
cargo 1.63.0 (fd9c4297c 2022-07-01)

rustc --version
rustc 1.63.0

rustup show
Default host: aarch64-apple-darwin
rustup home:  /Users/loco/.rustup

stable-aarch64-apple-darwin (default)
rustc 1.68.0 (2c8cc3432 2023-03-06)
```

```sh
brew uninstall rust
```

## `cmd + option + i` to open devtools

vscode > `cmf shifp p` => `rust-analyzer: restart server` to fix errors
