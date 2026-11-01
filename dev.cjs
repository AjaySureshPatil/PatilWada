const { spawn } = require("child_process");
const path = require("path");

// NEW: Start both the Parcel frontend and the local API proxy with one command.
const api = spawn(process.execPath, ["server.cjs"], {
  stdio: "inherit",
});

// OLD CODE: launch "npx.cmd" on Windows.
// Node 24 can throw EINVAL for .cmd files in child_process.spawn.
// const frontend = spawn(process.platform === "win32" ? "npx.cmd" : "npx", ["parcel", "index.html"], { stdio: "inherit" });

// NEW CODE: Run Parcel directly through its JavaScript entry file.
// process.execPath is the current Node executable, so no Windows .cmd launcher is needed.
const parcelBin = path.resolve(__dirname, "node_modules", "parcel", "lib", "bin.js");
const frontend = spawn(process.execPath, [parcelBin, "index.html"], {
  stdio: "inherit",
});

function stopProcesses() {
  api.kill();
  frontend.kill();
  process.exit();
}

process.on("SIGINT", stopProcesses);
process.on("SIGTERM", stopProcesses);
