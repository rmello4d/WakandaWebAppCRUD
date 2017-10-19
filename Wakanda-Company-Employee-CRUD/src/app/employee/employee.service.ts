import { Injectable } from '@angular/core';

import { Wakanda } from './../wakanda.service';


@Injectable()
export class EmployeeService {
  employeesCollection: any;
  pageSize: number = 7;

  constructor(private wakanda: Wakanda) {

  }

  getEmployees(page, companyID, queryString): Promise<any> {
    return new Promise((resolve, reject) => {

      if(this.employeesCollection && page > 1) { // just navigate to new page
        let start = ((page - 1) * this.pageSize) - this.pageSize; //get to the right start
        this.employeesCollection._first = start;

        this.employeesCollection.nextPage().then(() => {
          resolve(this.extractData(this.employeesCollection));
        });
      } else { // it's a new query
        let query = {pageSize: this.pageSize, select: 'manager'};
        if(queryString) {
          query['filter'] = 'firstName == :1 OR lastName == :1 OR companyName == :1 OR country == :1 OR title == :1 OR gender == :1 OR salary == :1 OR manager.firstName == :1 OR manager.lastName == :1';
          query['params'] = [`*${queryString}*`];
        }
        if(companyID) {
          query['filter'] = query['filter']? `${query['filter']} AND company.ID == "${companyID}"`: `company.ID == "${companyID}"`;
        }
        this.wakanda.getCatalog().then(ds => {
          ds['Employee'].query(query).then(res => {
            this.employeesCollection = res;
            if(page === 1) {
              resolve(this.extractData(this.employeesCollection));
            } else {
              let start = ((page - 1) * this.pageSize) - this.pageSize; //get to the right start
              this.employeesCollection._first = start;

              this.employeesCollection.nextPage().then(() => {
                resolve(this.extractData(this.employeesCollection));
              });
            }
          }).catch((error) => {
            reject(error.message);
          });
        });
      }
    });
  }

  private extractData(collection) {
    let entities = collection['entities'];
    let items = entities.map((obj) => {
      let employee: any = {};
      employee.ID = obj.ID;
      employee.title = obj.title;
      employee.fullName = obj.fullName;
      employee.companyName = obj.companyName;
      employee.managerName = (obj.manager)? obj.manager.fullName: "";
      employee.photoURI = obj.photo.uri;
      return employee;
    });
    return {
      total: collection._count,
      pageSize: collection._pageSize,
      items: items
    };
  }

}
