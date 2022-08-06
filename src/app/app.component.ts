import { Component, HostBinding } from '@angular/core';
import {
  trigger,
  transition,
  animate,
  style,
  query,
  stagger,
} from '@angular/animations';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('#chart_table_display, #date-picker, hr', [
          style({ opacity: 0, transform: 'translateY(-100px)' }),
          stagger(-40, [
            animate(
              '700ms 1.5s cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' })
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})

/*
Component Name:    AppComponent
Utility:           Served as parent for table-chart-display component and date-picker component. Build bridge for children
                   to share data and status.
Functions:         receiveMessage(); addItem()
*/
export class AppComponent {
  @HostBinding('@pageAnimations')
  button_status: boolean = false;
  date: string;

  /*
  Function Name:   receiveMessage();
  Utility:         Receive user input date from date-picker component, and pass to data-tabular-display component.
  Parameters:      $event
  */
  receiveMessage($event) {
    this.date = $event;
    this.button_status = true;
  }

  /*
  Function Name:   addItem();
  Utility:         Receive update flag from data-tabular-display component, check if update is successful or not. If
                   successful, then disable the (check the weather! ) button.
  Parameters:      $event
  */
  CheckButtonStatus($event) {
    if ($event == true) {
      this.button_status = false;
    }
  }
}
