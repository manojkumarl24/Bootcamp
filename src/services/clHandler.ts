import { EmployeeAdmin } from "./employeeAdmin";

export class CLHandler {
    private admin: EmployeeAdmin;

    constructor(admin: EmployeeAdmin) {
        this.admin = admin;
    }

    processCommand(command: string): void {
        const trimmed = command.trim();
        if (!trimmed.startsWith("employee::add")) {
            console.log("ERR: Unsupported command.");
            return;
        }

        const parts = trimmed.split(" ").filter(Boolean);
        if (parts.length < 3) {
            console.log("ERR: Invalid command format");
            return;
        }

        const [, , id, role, deptOrReports, reportsToMaybe] = parts;

        let dept: string | null = null;
        let reportsTo: string | null = null;

        if (!deptOrReports) {
            dept = null;
            reportsTo = null;
        } else if (!reportsToMaybe && !deptOrReports.startsWith("E")) {
            dept = deptOrReports;
        } else if (deptOrReports && deptOrReports.startsWith("E")) {
            reportsTo = deptOrReports;
        } else {
            dept = deptOrReports;
            reportsTo = reportsToMaybe ?? null;
        }

        this.admin.addEmployee(id, role, dept, reportsTo);
    }
}
