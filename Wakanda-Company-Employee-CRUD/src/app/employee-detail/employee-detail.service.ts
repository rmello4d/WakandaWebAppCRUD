import { Injectable } from '@angular/core';

import { Wakanda } from './../wakanda.service';


@Injectable()
export class EmployeeDetailService {

  constructor(private wakanda: Wakanda) {

  }

  getEmployeeDetail(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.wakanda.getCatalog().then(ds => {
        ds['Employee'].find(id, {select: 'manager'}).then(res => {
          resolve(res);
        }).catch((error) => {
          reject(error.message);
        });
      });

    });
  }

}
