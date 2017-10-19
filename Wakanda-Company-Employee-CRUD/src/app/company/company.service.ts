import { Injectable } from '@angular/core';

import { Wakanda } from './../wakanda.service';


@Injectable()
export class CompanyService {
  companiesCollection: any;
  pageSize: number = 10;

  constructor(private wakanda: Wakanda) {

  }

  getCompanies(page, queryString): Promise<any> {
    return new Promise((resolve, reject) => {
      if(page > 1) {
        let start = ((page - 1) * this.pageSize) - this.pageSize; //get to the right start
        this.companiesCollection._first = start;

        this.companiesCollection.nextPage().then(() => {
          resolve(this.extractData(this.companiesCollection));
        });
      } else {
        let query = {pageSize: this.pageSize, select: 'employees'};
        if(queryString) {
          query['filter'] = 'name == :1 OR countryName == :1 OR managerName == :1';
          query['params'] = [`*${queryString}*`];
        }
        this.wakanda.getCatalog().then(ds => {
          ds['Company'].query(query).then(res => {
            this.companiesCollection = res;
            resolve(this.extractData(res));
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
      let company: any = {};
      company.ID = obj.ID;
      company.employees = obj.employees.entities.length;
      company.name = obj.name;
      company.countryName = obj.countryName;
      company.managerName = obj.managerName;
      return company;
    });
    return {
      total: collection._count,
      pageSize: collection._pageSize,
      items: items
    };
  }

}
