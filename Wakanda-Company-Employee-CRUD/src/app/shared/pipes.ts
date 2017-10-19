import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'FilterPipe',
})
/**
* we can use this as client side filter
*/
export class FilterPipe implements PipeTransform {
  transform(array: any, qInput: any) {
    if (qInput) {
      return array.filter((el: any) => {
        for(var k in el) {
          if(typeof el[k] === "string" && el[k].toLowerCase().indexOf(qInput.toString().toLowerCase()) > -1) {
            return el;
          } else if(typeof el[k] === "number" && el[k].toString() === qInput) {
            return el;
          }
        }
      });
    }
    return array;
  }
}
