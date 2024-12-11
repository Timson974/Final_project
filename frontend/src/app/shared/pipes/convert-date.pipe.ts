import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertDate'
})
export class ConvertDatePipe implements PipeTransform {

  transform(value: string): string {
    const date = new Date(value);
    let hour: string | number = date.getHours();
    hour = hour < 10 ? "0" + hour : hour;
    let minutes: string | number = date.getMinutes();
    minutes = minutes < 10 ? "0" + minutes : minutes;
      let day: string | number = date.getDate();
      day = day < 10 ? "0" + day : day;
      let month: string | number = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      let year: string | number = date.getFullYear();

      return day + "." + month + "." + year + ' ' + hour + ':' + minutes;
  }

}
