import { Component, Output, EventEmitter, Input } from '@angular/core';
import { DataService } from './data.service';
import { Forecasts_detail } from './dataClass';
import * as Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsSolidGauge from 'highcharts/modules/solid-gauge';

HighchartsMore(Highcharts);
HighchartsSolidGauge(Highcharts);

import { GridApi, GridReadyEvent } from 'ag-grid-community';

@Component({
  selector: 'data-tabular-display',
  templateUrl: './data-tabular-display.html',
  styleUrls: ['./app.component.css'],
})

/*
Component Name:    ChartTabularDisplayComponent
Utility:           Convert user input date to start date, and print the humidity and 
                   temperature result in the chart and table form.
Used module:       Ag-grid, Highcharts
Functions:         onGridReady(); getData_display_charts(); clearChart(); refreshChart(); 
                   sortDates(); updateTable(); updateChart(); getDatesInRange();
*/
export class ChartTabularDisplayComponent {
  // Receive date that passed from parent (app.component.html)
  @Input() date: string;

  // Tell parent (app.component.html) the date has been updated
  @Output() button_status = new EventEmitter<boolean>();

  // Check for highchart update
  public updateFlag = false;

  // Ag-grid table api
  private gridApi!: GridApi;

  // Chart initialize
  Highcharts: typeof Highcharts = Highcharts;

  // rowDate to store the data that subscribed from the http object
  public rowData?: Array<Forecasts_detail> = [];
  constructor(private _dataService: DataService) {}

  // Highcharts option object to set the display form of the chart
  chartOptions: Highcharts.Options = {
    accessibility: {
      enabled: false,
    },
    chart: {
      style: {
        fontWeight: '500',
        color: '#f00',
      },
      borderColor: 'white',
      backgroundColor: {
        stops: [
          [0, 'rgb(255, 255, 255)'],
          [1, 'rgb(200, 200, 255)'],
        ],
      },
      type: 'line',
    },
    title: {
      style: {
        color: 'white',
        font: 'bold 16px',
      },
      text: 'Humidity and Temperature Trend Chart',
    },
    credits: {
      enabled: false,
    },
    legend: {
      itemStyle: {
        fontSize: '14px',
        color: 'white',
        fontWeight: '500',
      },
      backgroundColor: 'steelblue',
      padding: 10,
      borderRadius: 5,
      enabled: true,
    },
    xAxis: {
      title: {
        style: {
          fontSize: '14px',
          fontFamily: "'Roboto', sans-serif",
          color: '#6C777E',
          fontWeight: '500',
        },
      },
      allowDecimals: false,
      labels: {
        style: {
          color: '#6C777E',
          fontSize: '14px',
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 'normal',
        },
      },
      lineColor: '#D9DFE6',
      tickLength: 0,
      type: 'category',
    },
    yAxis: [
      {
        gridLineDashStyle: 'LongDash',
        labels: {
          format: '{text}°C',
        },
        title: {
          style: {
            fontSize: '14px',
            fontFamily: "'Roboto', sans-serif",
            color: 'white',
            fontWeight: '500',
          },
          text: 'Temperaure (°C)',
        },
      },
      {
        gridLineDashStyle: 'LongDash',
        labels: {
          format: '{text}%',
        },
        title: {
          style: {
            fontSize: '14px',
            fontFamily: "'Roboto', sans-serif",
            color: 'white',
            fontWeight: '500',
          },
          text: 'Humidity (%)',
        },
        opposite: true,
      },
    ],

    series: [
      {
        marker: {
          enabled: false,
        },
        name: 'Humidity (High & Low)',
        type: 'area',

        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, '#1f517a'],
            [1, '#4682b400'],
          ],
        },
        data: [],
        yAxis: 1,
        tooltip: {
          headerFormat: `{point.key} - `,
          pointFormat: `Daily Highest Humidity: {point.y}</div>`,
          valueSuffix: `%`,
        },
      },
      {
        marker: {
          enabled: false,
        },
        name: 'Humidity (High & Low)',
        linkedTo: ':previous',
        color: {
          linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
          stops: [
            [0, 'steelblue'],
            [1, '#4682b400'],
          ],
        },
        type: 'area',
        data: [],
        yAxis: 1,
        tooltip: {
          headerFormat: `{point.key} - `,
          pointFormat: `Daily Lowest Humidity: {point.y}</div>`,
          valueSuffix: `%`,
        },
      },
      {
        marker: {
          enabled: false,
        },
        name: 'Temperature (High & Low)',
        type: 'scatter',
        lineWidth: 2,
        data: [],
        color: 'white',
        yAxis: 0,
        tooltip: {
          headerFormat: `{point.key} - `,
          pointFormat: `Daily Highest Temperature: {point.y}</div>`,
          valueSuffix: `°C`,
        },
      },
      {
        marker: {
          enabled: false,
        },
        name: 'Temperature (High & Low)',
        linkedTo: ':previous',
        type: 'scatter',
        lineWidth: 1.5,
        data: [],
        color: '#d9d9d9b8',
        yAxis: 0,
        tooltip: {
          headerFormat: `{point.key} - `,
          pointFormat: `Daily Lowest Temperature: {point.y}</div>`,
          valueSuffix: `°C`,
        },
      },
    ],
  };

  public columnDefs = [
    { field: 'Date' },
    {
      field: 'Humidity_High',
      headerName: 'Daily Highest Humidity',
      valueGetter: 'data.Humidity_High',
      valueFormatter: `value+'%'`,
    },
    {
      field: 'Humidity_Low',
      headerName: 'Daily Lowest Humidity',
      valueGetter: 'data.Humidity_Low',
      valueFormatter: `value+'%'`,
    },
    {
      field: 'Temerature_High',
      headerName: 'Daily Highest Temerature',
      valueGetter: 'data.Temerature_High',
      valueFormatter: `value+'°C'`,
    },
    {
      field: 'Temerature_Low',
      headerName: 'Daily Lowest Temerature',
      valueGetter: 'data.Temerature_Low',
      valueFormatter: `value+'°C'`,
    },
  ];

  /*
  Function Name:    onGridReady()
  parameters:       None
  Utility:          Will be called once the table is created. In default, the table will display
                    the last 30 days' temperature and humidity.
  Called function:  getData_display_charts();
  */
  onGridReady(params: GridReadyEvent<Forecasts_detail>) {
    this.gridApi = params.api;
    const currentDate = new Date();
    const d2 = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    const d1 = new Date(d2.getTime() - 30 * 24 * 60 * 60 * 1000);
    this.getData_display_charts(d1, d2);
  }

  /*
  Function Name:    getData_dislpay_charts()
  parameters:       date1 and date2
  Utility:          Calculate the date difference between date1 and date2, then generate a
                    url list for dataService (getData()) to acquire data from desired http by
                    subscribing with observable object. Then wait utill finished reading and storing all the http request, then sort the data and display them in order.
  Called function:  sortDates(); getDatesInRange()
  */
  getData_display_charts(d1, d2) {
    this.rowData = [];
    this.gridApi.hideOverlay();
    let date_list: Date[] = [];

    let diffTime = Math.abs(d2 - d1);
    let dateBuffer = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    for (let date of this.getDatesInRange(d1, d2)) {
      date_list.push(date);
    }

    date_list = date_list.filter((element) => {
      return element !== null;
    });

    let date_step = 0;
    for (let date of date_list) {
      let _url =
        'https://api.data.gov.sg/v1/environment/4-day-weather-forecast?date=' +
        date.toISOString().split('T')[0];
      this._dataService.getData(_url).subscribe((detail) => {
        if (detail['items'] != '') {
          let last_index = detail['items'].length - 1;
          let temp_date: string =
            detail['items'][last_index]['forecasts'][0]['date'];
          let temp_rh_h: string =
            detail['items'][last_index]['forecasts'][0]['relative_humidity'][
              'high'
            ];
          let temp_rh_l: string =
            detail['items'][last_index]['forecasts'][0]['relative_humidity'][
              'low'
            ];
          let temp_T_h: string =
            detail['items'][last_index]['forecasts'][0]['temperature']['high'];
          let temp_T_l: string =
            detail['items'][last_index]['forecasts'][0]['temperature']['low'];
          let temp_detail: Forecasts_detail = {
            Date: temp_date,
            Humidity_High: temp_rh_h,
            Humidity_Low: temp_rh_l,
            Temerature_High: temp_T_h,
            Temerature_Low: temp_T_l,
          };
          this.rowData.push(temp_detail);
        }
        date_step++;
        if (date_step == dateBuffer) {
          this.sortDates(this.rowData);
        }
      });
    }
  }

  /*
  Function Name:    clearChart()
  parameters:       None
  Utility:          Clear the content of 4 series in the chart
  Called function:  sortDates(); getDatesInRange()
  */
  clearChart() {
    this.chartOptions.series[0]['data'] = [];
    this.chartOptions.series[1]['data'] = [];
    this.chartOptions.series[2]['data'] = [];
    this.chartOptions.series[3]['data'] = [];
  }

  /*
  Function Name:    refreshChart()
  parameters:       None
  Utility:          Will be called once there is user input date passed from the parent component
                    (app.component.ts). Will set the user input date as start date, and display 
                    the daily forcast info from the start date to current date. 
  Called function:  getData_display_charts(); clearChart()
  */
  refreshChart() {
    this.clearChart();
    const d1 = new Date(this.date);
    const currentDate = new Date();
    const d2 = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
    this.getData_display_charts(d1, d2);
  }

  /*
  Function Name:    sortDates()
  parameters:       data (stores the data from http request)
  Utility:          sort the data by the date and update the table and chart with the information 
                    of each date. After update, tell parent update is done by sending a true boolean.
  Called function:  updateTable(); updateChart(); emit();
  */
  sortDates(data) {
    data.sort((o1, o2) => {
      return new Date(o1.Date).getTime() - new Date(o2.Date).getTime();
    });
    this.updateTable(data);
    this.updateChart(data);
    this.button_status.emit(this.updateFlag);
  }

  /*
  Function Name:    updateTable()
  parameters:       data (stores the sorted data)
  Utility:          Update the table with the processed data
  Called function:  setRowData();
  */
  updateTable(data) {
    this.gridApi.setRowData(data);
  }

  /*
  Function Name:    updateChart()
  parameters:       data (stores the sorted data)
  Utility:          Update the content of 4 series of the chart with the processed data, and emit
                    the completed updated flag to parent.
  Called function:  push()
  */
  updateChart(data) {
    this.updateFlag = true;
    for (let i of data) {
      this.chartOptions.series[0]['data'].push({
        name: i['Date'],
        y: i['Humidity_High'],
      });
      this.chartOptions.series[1]['data'].push({
        name: i['Date'],
        y: i['Humidity_Low'],
      });
      this.chartOptions.series[2]['data'].push({
        name: i['Date'],
        y: i['Temerature_High'],
      });
      this.chartOptions.series[3]['data'].push({
        name: i['Date'],
        y: i['Temerature_Low'],
      });
    }
  }

  /*
  Function Name:    getDatesInRange()
  parameters:       startDate, endDate
  Utility:          calculate the date range between two given days and return as a list.
  Called function:  emit();
  */
  getDatesInRange(startDate, endDate) {
    const date = new Date(startDate.getTime());

    const dates = [];

    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return dates;
  }
}
