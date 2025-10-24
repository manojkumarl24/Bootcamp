// app.ts
import readline from "readline";
import { EmployeeAdmin } from "./services/employeeAdmin";
import { CLHandler } from "./services/clHandler";

export class App {
    private admin: EmployeeAdmin;
    private cli: CLHandler;

    constructor() {
        this.admin = new EmployeeAdmin();
        this.cli = new CLHandler(this.admin);
    }

    start(): void {
        console.log("=== Employee Management System ===");
        console.log("Use 'employee::add <id> <role> [dept] [reportsTo]'\nType 'exit' to quit.\n");

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: "> "
        });

        rl.prompt();

        rl.on("line", (input) => {
            if (input.trim().toLowerCase() === "exit") {
                rl.close();
                return;
            }

            try {
                this.cli.processCommand(input);
            } catch (err: any) {
                console.log(`ERR: ${err.message}`);
            }

            rl.prompt();
        });

        rl.on("close", () => {
            console.log("Exiting Employee Management System...");
            this.admin.printHierarchy();
            process.exit(0);
        });
    }
}
