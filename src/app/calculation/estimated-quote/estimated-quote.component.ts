import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { B2CService } from 'src/app/auth/shared/services/b2c.service';
import { CalculateService } from '../shared/services/calculation.service';
import jwt_decode from 'jwt-decode';
import { filter, pairwise } from 'rxjs/operators';

@Component({
  selector: 'app-estimated-quote',
  templateUrl: './estimated-quote.component.html',
  styleUrls: ['./estimated-quote.component.scss']
})
export class EstimatedQuoteComponent implements OnInit {
  date: any;
  property: any = {};
  isLoggedIn: boolean = false;

  loadingSpinner: string = 'loading';
  submitSpinner: string = 'submit';

  showRequired: boolean = false;

  roomTypes: any = {
    livingroom: 1,
    bedroom: 2,
    bathroom: 3,
    kitchen: 4
  };

  calculatedData: any;

  // DISABLE DATE
  projectLength: number;
  model: NgbDateStruct;
  disabledDates: NgbDateStruct[] = [];

  isDisabled=(date:NgbDateStruct,current: {month: number,year:number} | undefined)=> {
    return this.disabledDates.find(x=>new NgbDate(x.year,x.month,x.day).equals(date))?false:true;
  }

  startDate: any;
  endDate: any;

  constructor(
    private calculateService: CalculateService,
    private authService: MsalService,
    private router: Router,
    private route: ActivatedRoute,
    private b2cService: B2CService,
    private calendar: NgbCalendar,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('JwtToken');
    if (token) {
      const tokenInfo = this.getDecodedAccessToken(token);
      let role = tokenInfo.extension_Role;
      if(role == 'leader' || role == 'worker') {
        this.router.navigate(['/home']);
      }
    }

    const estimatedProperty = localStorage.getItem("estimated-property");
    const propertyOptions = localStorage.getItem("property-options");
    if(estimatedProperty && propertyOptions) {
      this.spinner.show('submit');
      const newProperty = JSON.parse(estimatedProperty);
      const newOptions = JSON.parse(propertyOptions);
      this.calculateService.property(newProperty)
        .subscribe(id => {
          this.calculateService.createProject(id.newId, newOptions.projectLength, newOptions.startDate, newOptions.endDate, newOptions.cityId, newOptions.quote, newOptions.address, newOptions.needsFurniture)
            .subscribe(response => {
              localStorage.removeItem("estimated-property");
              localStorage.removeItem("property-options");
              this.router.navigate(['profile', 'scope-of-work', response.newId]);
              this.spinner.hide('submit');
            });
        });
    } else {
      this.spinner.show('loading');
      this.calculateService.calcRoom
        .subscribe(rooms => {
          this.property = rooms;
          this.calculateService.quoteCalculate(rooms)
            .subscribe(data => {
              Object.values(data.startDates).forEach((date: any) => {
                let yyyy = +date.slice(0, 4);
                let mm = +date.slice(5, 7).replace(/^0+/, '');
                let dd = +date.slice(8, 10).replace(/^0+/, '');
                this.disabledDates.push({ year: yyyy, month: mm, day: dd });
              });
              this.calculatedData = data;
              this.projectLength = data.projectLength;
              this.spinner.hide('loading');
              if(data.tax == 0 && data.totalAndTax == 0 && data.totalPrice == 0) {

              } else {
                Object.values(data.startDates).forEach((date: any) => {
                  let yyyy = +date.slice(0, 4);
                  let mm = +date.slice(5, 7).replace(/^0+/, '');
                  let dd = +date.slice(8, 10).replace(/^0+/, '');
                  this.disabledDates.push({  year: yyyy, month: mm, day: dd });
                });
                this.calculatedData = data;
                this.projectLength = data.projectLength;
                this.spinner.hide('loading');
              }
            });
        });
    }

    const activeAccount = this.authService.instance.getActiveAccount();
    if(activeAccount) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  getDecodedAccessToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  dateChange(date: any) {
    this.showRequired = false;
    let selectedDate = new Date(date.year + '-' + date.month + '-' + date.day).toISOString();

    Object.values(this.calculatedData.startDates).forEach((start: any) => {
      if(start.slice(0, 10) == selectedDate.slice(0, 10)) {
        var futureDate = new Date(start);
        futureDate.setDate(futureDate.getDate() + this.projectLength);
        this.startDate = start;
        this.endDate = futureDate.toISOString();
      }
    });
  }

  login() {
    if(!this.model) {
      this.showRequired = true;
      return;
    }
    const rooms: any = [];
    const roomConditions = this.property.roomTypesAndConditions;
    for (let type of Object.keys(roomConditions)) {
      rooms.push({propertyId: 0, roomTypeId: type, conditionId: roomConditions[type]});
    }
    delete this.property.roomTypesAndConditions;
    let property = {...this.property, rooms};
    const prop: {} = { property };
    localStorage.setItem("estimated-property", JSON.stringify(prop));
    let storedProperty = localStorage.getItem("estimated-property");
    if (storedProperty != null) {
      let newProperty = JSON.parse(storedProperty);
    }
    this.b2cService.login();
  }

  onSubmit() {
    if(!this.model) {
      this.showRequired = true;
      return;
    }
    this.spinner.show('submit');
    var floorPlanUrl: any;
    this.calculateService.fp
      .subscribe(res =>{
        floorPlanUrl = res;
      });
    const rooms: any = [];
    const roomConditions = this.property.roomTypesAndConditions;
    for (let type of roomConditions) {
      rooms.push({propertyId: 0, roomTypeId: type.roomTypeId, conditionId: type.conditionId});
    }
    delete this.property.roomTypesAndConditions;
    let property = { ...this.property, rooms, floorPlanUrl };
    const prop: {} = { property }

    let totalPrice = this.calculatedData.totalPrice;
    let totalAndTaxPrice = this.calculatedData.totalAndTax;
    let totalHours = this.calculatedData.totalHours;
    let totalMaterialPrice = this.calculatedData.totalMaterialPrice;
    let projectLength = this.calculatedData.projectLength;
    let quoteRows: any = [];
    Object.values(this.calculatedData.categoryPrices).forEach((price: any) => {
      quoteRows.push({ categoryId: price.categoryId, categoryName: price.categoryName, price: price.price, quoteId: 0 });
    });
    let quote = { projectId: 0, totalPrice, totalAndTaxPrice, totalHours, totalMaterialPrice, quoteRows };
    if(!this.isLoggedIn) {
      localStorage.setItem("estimated-property", JSON.stringify(prop));
      const options = {
        projectLength: projectLength,
        startDate: this.startDate,
        endDate: this.endDate,
        cityId: this.property.cityId,
        quote: quote,
        address: this.property.address,
        needsFurniture: this.property.needsFurniture
      }
      localStorage.setItem("property-options", JSON.stringify(options));
    }
    if(!this.isLoggedIn) {
      this.b2cService.login();
      return;
    }
    this.calculateService.property(prop)
      .subscribe(id => {
        this.calculateService.createProject(id.newId, projectLength, this.startDate, this.endDate, this.property.cityId, quote, this.property.address, this.property.needsFurniture)
          .subscribe(response => {
            this.router.navigate(['profile', 'scope-of-work', response.newId]);
            this.spinner.hide('submit');
          });
      });
  }
}
