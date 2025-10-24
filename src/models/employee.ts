export abstract class Employee {
    protected id: string;
    protected role: string;
    protected dept: string;
    protected reporters: Map<string, Employee>;

    constructor(id: string, role: string, dept: string = "") {
        this.id = id;
        this.role = role;
        this.dept = dept;
        this.reporters = new Map<string, Employee>();
    }

    getId() {
        return this.id;
    }

    getRole() {
        return this.role;
    }

    getDept() {
        return this.dept;
    }

    getReporters() {
        return this.reporters;
    }

    hasReporter(empId: string): boolean {
        return this.reporters.has(empId);
    }

    reporterCount(): number {
        return this.reporters.size;
    }


    canAddReporter(emp: Employee): boolean {
        return true;
    };
    abstract addReporter(emp: Employee): void;
}

export class Founder extends Employee {
    private static instancesCreated = 0;
    constructor(id: string) {
        if (Founder.instancesCreated == 1) {
            throw new Error("Only one Founder instance can be created.");
        }
        super(id, "Founder");
        Founder.instancesCreated++;
    }

    canAddReporter(emp: Employee): boolean {
        return false;
    }

    addReporter(emp: Employee): void {
        if (!this.canAddReporter(emp)) {
            console.log(`${emp.getRole()} directy reporting to Founder`);
            return;
        }
        if (this.hasReporter(emp.getId())) {
            console.log("Employee already reporting to him");
            return;
        }
        this.reporters.set(emp.getId(), emp);
    }
}

export class CoFounder extends Employee {
    private static instancesCreated = 0;
    constructor(id: string) {
        if (CoFounder.instancesCreated == 2) {
            throw new Error("Only two Co-Founder instance can be created.");
        }
        super(id, "Co-Founder");
        CoFounder.instancesCreated++;
    }
    
    canAddReporter(emp: Employee): boolean {
        return emp.getRole() === "Director";
    }

    addReporter(emp: Employee): void {
        if (!this.canAddReporter(emp)) {
            console.log(`${emp.getRole()} directy reporting to Co-Founder`);
            return;
        }
        if (this.hasReporter(emp.getId())) {
            console.log("Employee already reporting to him");
            return;
        }
        this.reporters.set(emp.getId(), emp);
    }
}

export class Director extends Employee {
    constructor(id: string, dept: string) {
        super(id, "Director", dept);
    }

    canAddReporter(emp: Employee): boolean {
        return emp.getRole() === "Manager" && emp.getDept() === this.dept;
    }

    addReporter(emp: Employee): void {
        if (!this.canAddReporter(emp)) {
            console.log("Director can only add Managers from the same department.");
            return;
        }
        this.reporters.set(emp.getId(), emp);
    }
}


export class Manager extends Employee {
    constructor(id: string, dept: string) {
        super(id, "Manager", dept);
    }

    canAddReporter(emp: Employee): boolean {
        return (
            (emp.getRole() === "Supervisor" || emp.getRole() === "Worker") &&
            emp.getDept() === this.dept
        );
    }

    addReporter(emp: Employee): void {
        if (!this.canAddReporter(emp)) {
            console.log("Manager can only add Supervisors or Workers from the same department.");
            return;
        }
        this.reporters.set(emp.getId(), emp);
    }
}

export class Supervisor extends Employee {
    private static MAX_REPORTERS = 4;

    constructor(id: string, dept: string) {
        super(id, "Supervisor", dept);
    }

    canAddReporter(emp: Employee): boolean {
        const validRole = emp.getRole() === "Worker";
        const sameDept = emp.getDept() === this.dept;
        const withinLimit = this.reporterCount() < Supervisor.MAX_REPORTERS;
        return validRole && sameDept && withinLimit;
    }

    addReporter(emp: Employee): void {
        if (!this.canAddReporter(emp)) {
            if (this.reporterCount() >= Supervisor.MAX_REPORTERS) {
                console.log("Supervisor cannot have more than 4 reporters.");
            } else {
                console.log("Supervisor can only add Workers from the same department.");
            }
            return;
        }
        this.reporters.set(emp.getId(), emp);
    }
}

export class Worker extends Employee {
    constructor(id: string, dept: string) {
        super(id, "Worker", dept);
    }

    canAddReporter(): boolean {
        return false;
    }

    addReporter(emp: Employee): void {
        console.log("Workers cannot have any reporters.");
    }
}