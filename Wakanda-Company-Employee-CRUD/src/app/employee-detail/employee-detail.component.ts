import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { EmployeeDetailService } from './employee-detail.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-employee-detail',
  templateUrl: './employee-detail.component.html',
  styleUrls: ['./employee-detail.component.css'],
  providers: [EmployeeDetailService]
})
export class EmployeeDetailComponent implements OnInit, OnDestroy {
  private employee : any = {};
  private errorMsg: any;
  private sub: any;
  private loading: boolean;

  constructor(private employeeDetailService: EmployeeDetailService,
    private route: ActivatedRoute,
    private location: Location,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.getEmployeeDetail(+params['id']);
    });
  }

  getEmployeeDetail(id) {
    this.loading = true;
    this.employeeDetailService.getEmployeeDetail(id).then((employee) => {
      this.employee = employee;
      this.loading = false;
    }).catch((errorMessage) =>{
      this.errorMsg = errorMessage;
    });
  }

  openDeleteDialog(employee): void {
    let dialogRef = this.dialog.open(DialogDelete, {
      width: '250px',
      data: {employee: this.employee}
    });

    dialogRef.afterClosed().subscribe(employeeToDelete => {
      if(employeeToDelete) {
        this.deleteEmployee(employeeToDelete);
      }
    });
  }

  deleteEmployee(employee) {
    this.loading = true;
    employee.delete().then(() => {
      this.location.back();
      this.loading = false;
    });
  }

  editEmployee(employee) {
    this.loading = true;
    employee.save().then(() => {
      this.location.back();
      this.loading = false;
    });
  }

  // uploadImage(fileInput: any) {
  //   let files = fileInput.target.files;
  //   if(files && files[0]) {
  //     this.employee.photo.upload(files[0]).then(() => {
  //       //done
  //     });
  //   }
  // }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

/**
* Dialog to confirm delete employee
*/
@Component({
  selector: 'dialog-delete',
  templateUrl: 'dialog-delete.html',
})
export class DialogDelete {
  private employeeToDelete : any = {};
  constructor(
    public dialogRef: MatDialogRef<DialogDelete>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.employeeToDelete = data.employee;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
