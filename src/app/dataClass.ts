export interface Data_outer {
  items: any;
  api_status: any;
}

export class Forecasts {
  public date: string;
  public relative_humidity: any[];
  public temperature: any[];

  public constructor(theDate?: string, theRH?: any[], theT?: any[]) {
    this.date = theDate;
    this.relative_humidity = theRH;
    this.temperature = theT;
  }
}

export interface Forecasts_detail {
  Date: string;
  Humidity_High: string;
  Humidity_Low: string;
  Temerature_High: string;
  Temerature_Low: string;
}
