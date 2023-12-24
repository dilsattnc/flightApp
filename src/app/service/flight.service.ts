import { Injectable } from '@angular/core';
import{HttpClient} from '@angular/common/http'
import { Observable, catchError, throwError } from 'rxjs';
import { Flight } from '../model/flight';


@Injectable({
  providedIn: 'root'
})
export class FlightService {

  public flightApi = "http://localhost:3000/flights";
  constructor(private http:HttpClient) { }

  ngOnInit(){

  }

  getFlightsInfo(): Observable<any[]> {
    return this.http.get<any[]>(this.flightApi).pipe(
      catchError((error) => {
        console.error('Error fetching flight data:', error);
        // You can handle the error here, for example, by returning an empty array
        return throwError([]);
      })
    );
  }
}
