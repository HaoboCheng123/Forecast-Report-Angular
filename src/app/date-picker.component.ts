import { Component } from '@angular/core';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'datepicker',
  templateUrl: 'datepicker-value.html',
})

/*
Component Name:    DatepickerValueComponent
Utility:           Collect user input date and pass to the parent page (app.component.html/component)
Functions:         get_send_date()
*/
export class DatepickerValueComponent {
  @Output() event = new EventEmitter<string>();
  startDate: string;

  /*
  Function Name:    get_send_date()
  parameters:       None
  Utility:          Collect the user input date and convert to correct format and send to parent component (app.component)
  Called function:  emit();
  */
  get_send_date() {
    let user_input_date = new Date(
      (<HTMLInputElement>document.getElementById('userInput')).value
    );
    let user_date = new Date(user_input_date);
    user_date.setDate(user_date.getDate() - 1);

    this.event.emit(user_date.toISOString().split('T')[0]);
  }
}
