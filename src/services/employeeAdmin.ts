import { Employee } from "../models/employee";
import { EmployeeBuilder } from "../builders/employee";

export class EmployeeAdmin {
    private employees: Map<string, Employee> = new Map();

    addEmployee(id: string, role: string, dept: string | null, reportsTo: string | null): void {
        if (this.employees.has(id)) {
            console.log(`ERR: Employee with ID '${id}' already exists.`);
            return;
        }

        try {
            const employee = EmployeeBuilder.build(id, role, dept ?? "");

            if (!employee) {
                console.log(`ERR: Invalid role '${role}'.`);
                return;
            }

            if (!reportsTo) {
                if (this.isTopLevelRole(role)) {
                    this.employees.set(id, employee);
                    console.log(`Employee '${id}' added successfully.`);
                } else {
                    console.log(`ERR: '${role}' must report to a valid superior.`);
                }
                return;
            }

            const manager = this.employees.get(reportsTo);
            if (!manager) {
                console.log(`ERR: Invalid entry. No Employee with the id '${reportsTo}' found.`);
                return;
            }

            if (!manager.canAddReporter(employee)) {
                console.log(`ERR: ${manager.getRole()} cannot have '${employee.getRole()}' as reporter.`);
                return;
            }

            manager.addReporter(employee);
            this.employees.set(id, employee);

            console.log(`✅ Employee '${id}' (${role}) added under '${reportsTo}'.`);
        } catch (err: any) {
            console.log(`ERR: ${err.message}`);
        }
    }

    private isTopLevelRole(role: string): boolean {
        return role === "Founder" || role === "Co-Founder";
    }

    getEmployee(id: string): Employee | undefined {
        return this.employees.get(id);
    }

    printHierarchy(): void {
        console.log("\n=== EMPLOYEE HIERARCHY ===");
        for (const [id, emp] of this.employees.entries()) {
            const reports = Array.from(emp.getReporters().keys());
            console.log(`${id} (${emp.getRole()} - ${emp.getDept() || "N/A"}) → [${reports.join(", ") || "None"}]`);
        }
        console.log("===========================\n");
    }
}
