const { exec } = require("node:child_process");

function checkPostgres() {
  let execCommand = "docker exec postgres-dev pg_isready --host localhost";
  if (process.platform === "linux") {
    execCommand = `sudo ${execCommand}`;
  }
  console.log(execCommand);
  exec(execCommand, handleReturn);

  function handleReturn(error, stdout) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }
    console.log("\n🟢 Postgres is ready and accepting connections!\n");
  }
}

process.stdout.write("\n\n🔴 Awaiting Postgres accept connections");

checkPostgres();
