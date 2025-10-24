export abstract class Employee {
    protected id: string;
    protected role: string;
    protected dept: string;
    protected reportsTo: Employee | null;
    protected reporteeCount: number;

    constructor(id: string, role: string, dept: string = "") {
        this.id = id;
        this.role = role;
        this.dept = dept;
        this.reportsTo = null;
        this.reporteeCount = 0;
    }

    getId(): string {
        return this.id;
    }

    getRole(): string {
        return this.role;
    }

    getDept(): string {
        return this.dept;
    }

    getReportsTo(): Employee | null {
        return this.reportsTo;
    }

    getReporteeCount(): number {
        return this.reporteeCount;
    }

    incrementReporteeCount(): void {
        this.reporteeCount++;
    }

    decrementReporteeCount(): void {
        if (this.reporteeCount > 0) this.reporteeCount--;
    }

    abstract canReportTo(emp: Employee): boolean;
    abstract canAcceptReportee(emp: Employee): boolean;

    
    reportTo(superior: Employee): void {
        if (this.reportsTo) {
            console.log(`${this.role} (${this.id}) already reports to ${this.reportsTo.getId()}`);
            return;
        }

        if (!this.canReportTo(superior)) {
            console.log(`${this.role} cannot report to ${superior.getRole()}`);
            return;
        }

        if (!superior.canAcceptReportee(this)) {
            console.log(`${superior.getId()} cannot accept anymore reportees`);
            return;
        }

        this.reportsTo = superior;
        superior.incrementReporteeCount();
    }
}



export class Founder extends Employee {
    private static instanceCount = 0;

    constructor(id: string) {
        if (Founder.instanceCount >= 1)
            throw new Error("Only one Founder can be created.");

        super(id, "Founder");
        Founder.instanceCount++;
    }

    canReportTo(): boolean {
        return false; 
    }

    canAcceptReportee(emp: Employee): boolean {
        return ["Co-Founder", "Director"].includes(emp.getRole());
    }
}


export class CoFounder extends Employee {
    private static instanceCount = 0;

    constructor(id: string) {
        if (CoFounder.instanceCount >= 2)
            throw new Error("Only up to two Co-Founders can be created.");

        super(id, "Co-Founder");
        CoFounder.instanceCount++;
    }

    canReportTo(): boolean {
        return false;
    }

    canAcceptReportee(emp: Employee): boolean {
        return emp.getRole() === "Director";
    }
}


export class Director extends Employee {
    constructor(id: string, dept: string) {
        super(id, "Director", dept);
    }

    canReportTo(emp: Employee): boolean {
        return (
            emp.getRole() === "Founder" ||
            emp.getRole() === "Co-Founder"
        );
    }

    canAcceptReportee(emp: Employee): boolean {
        return emp.getRole() === "Manager" && emp.getDept() === this.dept;
    }
}


export class Manager extends Employee {
    constructor(id: string, dept: string) {
        super(id, "Manager", dept);
    }

    canReportTo(emp: Employee): boolean {
        return emp.getRole() === "Director" && emp.getDept() === this.dept;
    }

    canAcceptReportee(emp: Employee): boolean {
        return (
            ["Supervisor", "Worker"].includes(emp.getRole()) &&
            emp.getDept() === this.dept
        );
    }
}


export class Supervisor extends Employee {
    private static readonly MAX_REPORTEES = 4;

    constructor(id: string, dept: string) {
        super(id, "Supervisor", dept);
    }

    canReportTo(emp: Employee): boolean {
        return emp.getRole() === "Manager" && emp.getDept() === this.dept;
    }

    canAcceptReportee(emp: Employee): boolean {
        const canAccept =
            emp.getRole() === "Worker" &&
            emp.getDept() === this.dept &&
            this.reporteeCount < Supervisor.MAX_REPORTEES;

        return canAccept;
    }
}


export class Worker extends Employee {
    constructor(id: string, dept: string) {
        super(id, "Worker", dept);
    }

    canReportTo(emp: Employee): boolean {
        return (
            ["Supervisor", "Manager"].includes(emp.getRole()) &&
            emp.getDept() === this.dept
        );
    }

    canAcceptReportee(): boolean {
        return false; 
    }
}
