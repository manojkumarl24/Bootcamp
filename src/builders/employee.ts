import { Employee, Founder, CoFounder, Director, Manager, Supervisor, Worker } from "../models/employee";


export class EmployeeBuilder {
    static build(id: string, role: string, dept: string): Employee | undefined{
        var emp: Employee | undefined;
        switch(role){
            case "Founder":
                emp = new Founder(id);
                break;
            
            case "Co-Founder":
                emp = new CoFounder(id);
                break;
            
            case "Director":
                emp = new Director(id, dept);
                break;
            
            case "Manager":
                emp = new Manager(id, dept);
                break;

            case "Supervisor":
                emp = new Supervisor(id, dept);
                break;
            
            case "Worker":
                emp = new Worker(id, dept);
                break;
            
            default:
                emp = undefined;
        }

        return emp;
    }
}