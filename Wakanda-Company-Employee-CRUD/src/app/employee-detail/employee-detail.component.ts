import { Component, OnInit, Inject } from '@angular/core';import { EmployeeDetailService } from './employee-detail.service';import { ActivatedRoute, Router } from '@angular/router';import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';@Component({  selector: 'app-employee-detail',  templateUrl: './employee-detail.component.html',  styleUrls: ['./employee-detail.component.css'],  providers: [EmployeeDetailService]})export class EmployeeDetailComponent implements OnInit {  private employee : any = {};  private companyName : string;  private errorMsg: any;  private sub: any;  private loading: boolean;  constructor(private employeeDetailService: EmployeeDetailService,    private route: ActivatedRoute,    private router: Router,    private dialog: MatDialog) { }  ngOnInit() {    this.sub = this.route.params.subscribe(params => {      this.getEmployeeDetail(+params['id']);    });  }  getEmployeeDetail(id) {    this.loading = true;    this.employeeDetailService.getEmployeeDetail(id).then((employee) => {      this.employee = employee;      this.companyName = employee.companyName;      this.loading = false;    }).catch((errorMessage) =>{      this.errorMsg = errorMessage;    });  }  openDeleteDialog(employee): void {    let dialogRef = this.dialog.open(DialogDelete, {      width: '250px',      data: {employee: this.employee}    });    dialogRef.afterClosed().subscribe(employeeToDelete => {      if(employeeToDelete) {        this.deleteEmployee(employeeToDelete);      }    });  }  deleteEmployee(employee) {    this.loading = true;    employee.delete().then(() => {      this.router.navigate(['/employeesCompany', this.companyName]);      this.loading = false;    });  }  editEmployee(employee) {    this.loading = true;      employee.save().then(() => {      this.router.navigate(['/employeesCompany', this.companyName]);      this.loading = false;    });  }}/*** Dialog to confirm delete employee*/@Component({  selector: 'dialog-delete',  templateUrl: 'dialog-delete.html',})export class DialogDelete {  private employeeToDelete : any = {};  constructor(    public dialogRef: MatDialogRef<DialogDelete>,    @Inject(MAT_DIALOG_DATA) public data: any) {    this.employeeToDelete = data.employee;  }  onNoClick(): void {    this.dialogRef.close();  }}