import { execSync } from "child_process";

try {
  // En Windows, encontrar y matar proceso en puerto 3000
  execSync(
    `for /f "tokens=5" %a in ('netstat -ano ^| findstr ":3000 "') do taskkill /F /PID %a 2>nul`,
    { stdio: "ignore", shell: "cmd.exe" }
  );
} catch {
  // No hay proceso en el puerto 3000, no pasa nada
}
