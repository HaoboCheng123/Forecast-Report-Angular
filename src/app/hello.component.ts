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
  selector: 'hello',
  template: `<h1 class = "h-100 d-flex align-items-center justify-content-center zoom-in-out-box">Welcome to {{name}}!</h1>`,
  styles: [
    `h1 { font-family: Lato; color: steelblue}
  .zoom-in-out-box {
    animation: zoom-in-zoom-out 2s ease;
  }

  @media only screen and (max-width: 600px) {
    h1 {
      font-size: large;
    }
  }
  
  @keyframes zoom-in-zoom-out {
    0% {
      transform: translateY(300px) scale(2,2);
    }
    30% {
      transform: translateY(300px) scale(2,2);
    }
    // 50% {
    //   transform: scale(1.5, 1.5);
    // }
    100% {
      transform: scale(1, 1);
    }
  }
  `,
  ],
  animations: [
    trigger('pageAnimations', [
      transition(':enter', [
        query('h1', [
          style({ opacity: 0, transform: 'translateY(-100px)' }),
          stagger(-30, [
            animate(
              '500ms cubic-bezier(0.35, 0, 0.25, 1)',
              style({ opacity: 1, transform: 'none' })
            ),
          ]),
        ]),
      ]),
    ]),
  ],
})

/*
Component Name:   HelloComponent
Utility:          Welcome animation
*/
export class HelloComponent {
  @HostBinding('@pageAnimations')
  name: string = 'Forcast Board';
}
