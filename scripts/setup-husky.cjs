const { execSync } = require("child_process");

if (process.env.CI) {
  process.stdout.write("CI detected; skipping husky install.\n");
  process.exit(0);
}

try {
  execSync("husky", { stdio: "inherit" });
} catch (error) {
  process.exitCode = typeof error?.status === "number" ? error.status : 1;
}
