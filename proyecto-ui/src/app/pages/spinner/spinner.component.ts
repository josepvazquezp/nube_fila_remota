import { Component } from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss']
})
export class SpinnerComponent {
  spinner = 400;

  constructor() {
    let width = window.innerWidth;
    if(width > 1500) {
      this.spinner = 500;
    }
    else if(width > 1200) {
      this.spinner = 400;
    }
    else if(width > 800) {
      this.spinner = 300;
    }
    else {
      this.spinner = 200;
    }
  }
}
