const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

async function main() {
  const repoUrl = 'https://github.com/UjjwalTiwari25/DevFlow-CI-CD-Pipeline';
  const commitSha = 'main'; // Use main branch for simplicity

  const workDir = path.join(os.tmpdir(), `pipeline-test-123`);
  fs.mkdirSync(workDir, { recursive: true });
  console.log('Work dir:', workDir);

  const cdCmd = `if [ -f "./package.json" ]; then true; else PKG=$(find . -name "package.json" -not -path "*/node_modules/*" | head -n 1); [ -n "$PKG" ] && cd "$(dirname "$PKG")"; fi`;
  const prismaGenCmd = `if [ -f "apps/sample-api/prisma/schema.prisma" ]; then npx prisma generate --schema=apps/sample-api/prisma/schema.prisma; elif [ -f "prisma/schema.prisma" ]; then npx prisma generate; fi`;

  const stages = [
    { name: 'Checkout', cmd: `git clone "${repoUrl}.git" . && git checkout "${commitSha}"` },
    { name: 'Install', cmd: `${cdCmd}; npm install` },
    { name: 'Lint', cmd: `${cdCmd}; npm run lint --if-present` },
    { name: 'Test', cmd: `${cdCmd}; ${prismaGenCmd}; npm run test --if-present` },
    { name: 'Build', cmd: `${cdCmd}; npm run build --if-present` },
  ];

  let buildPassed = true;
  for (const stage of stages) {
    if (!buildPassed) break;
    console.log(`\n--- Running stage: ${stage.name} ---`);
    console.log(`Cmd: ${stage.cmd}`);
    
    let stepLogs = '';
    let exitCode = 0;
    
    try {
      exitCode = await new Promise((resolve) => {
        const child = spawn('sh', ['-c', stage.cmd], { cwd: workDir });
        child.stdout.on('data', data => { 
          process.stdout.write(data.toString());
          stepLogs += data.toString(); 
        });
        child.stderr.on('data', data => { 
          process.stderr.write(data.toString());
          stepLogs += data.toString(); 
        });
        child.on('close', code => resolve(code));
      });
    } catch (e) {
      console.error(e);
      exitCode = 1;
    }
    
    console.log(`Stage ${stage.name} exited with code ${exitCode}`);
    if (exitCode !== 0) {
      buildPassed = false;
    }
  }

  // Cleanup
  fs.rmSync(workDir, { recursive: true, force: true });
}

main().catch(console.error);
