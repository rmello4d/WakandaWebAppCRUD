import { Component, OnInit } from '@angular/core';
import { CompanyService } from './company.service';
import { FilterPipe } from '../shared/pipes';

@Component({
  selector: 'app-company',
  providers: [CompanyService],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {
  companies: any;
  errorMsg: any;
  loading: boolean;

  // pagination
  total: number;
  p: any;
  pageSize: number;

  constructor(private companyService: CompanyService) { }

  ngOnInit() {
    this.getCompaniesPage(1);
  }

  getCompaniesPage(page: number) {
    this.loading = true;
    this.companyService.getCompanies(page).then((companies) => {
      this.loading = false;
      this.companies = companies.items;
      this.total = companies.total;
      this.pageSize = companies.pageSize;
      this.p = page;
    }).catch((errorMessage) => {
      this.loading = false;
      this.errorMsg = errorMessage;
    });
  }

}
