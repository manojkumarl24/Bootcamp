import { Employee } from "../models/employee.js";
import { EmployeeBuilder } from "../builders/employee.js";

export class EmployeeAdmin {
    private employees: Map<string, Employee> = new Map();

    addEmployee(id: string, role: string, dept: string | null, reportsToId: string | null): void {
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

            if (!reportsToId) {
                if (this.isTopLevelRole(role)) {
                    this.employees.set(id, employee);
                } else {
                    console.log(`ERR: '${role}' must report to a valid superior.`);
                }
                return;
            }

            const superior = this.employees.get(reportsToId);
            if (!superior) {
                console.log(`ERR: No employee with ID '${reportsToId}' found.`);
                return;
            }

            employee.reportTo(superior);
            this.employees.set(id, employee);

            if (employee.getReportsTo() === superior) {
                console.log(`${role} '${id}' now reports to '${superior.getRole()}' (${superior.getId()}).`);
            }
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
        console.log("\n=== COMPANY HIERARCHY ===");
        for (const [id, emp] of this.employees.entries()) {
            const reportsTo = emp.getReportsTo();
            const reportsToId = reportsTo ? `${reportsTo.getId()} (${reportsTo.getRole()})` : "None";
            console.log(
                `${id} | ${emp.getRole()} | Dept: ${emp.getDept() || "N/A"} | Reports To: ${reportsToId} | Reportees: ${emp.getReporteeCount()}`
            );
        }
        console.log("==========================\n");
    }

   
    listByRole(role: string): void {
        console.log(`\n=== Listing all '${role}'s ===`);
        const matches = Array.from(this.employees.values()).filter((e) => e.getRole() === role);
        if (matches.length === 0) {
            console.log(`No employees found with role '${role}'.`);
        } else {
            matches.forEach((e) =>
                console.log(`${e.getId()} | Dept: ${e.getDept() || "N/A"} | Reports To: ${e.getReportsTo()?.getId() || "None"}`)
            );
        }
        console.log("==============================\n");
    }
}
