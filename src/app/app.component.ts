import { Component } from '@angular/core';
import { FlightService } from './service/flight.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'denemeApp';
 constructor(private flightService:FlightService){

 }

 ngOnInit(){

 }

  
}
