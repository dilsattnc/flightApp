import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, elementAt, map, startWith } from 'rxjs';
import { Flight } from 'src/app/model/flight';
import { FlightService } from 'src/app/service/flight.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit{
  @ViewChild(MatSort) sort!: MatSort;

  infos:any
   airlineInfo:any;
   flightForm:any;
   airlineCode:any
   filteredDepartureOptions:any
   filteredArrivalOptions:any
   checkDeparture:any;
   checkDepartureTime:any;
   getDepartTime:any
   getReturnTime:any
   checkReturn:any
   checkReturnTime:any

   filteredFlights:any

   selectedDirect: any;
   displayedColumns: any
   minDate: any;
   minDateForReturnTime:any;
  isShow:boolean=false;
  isLoading: boolean = false;



  dataSource: MatTableDataSource<Flight> = new MatTableDataSource<Flight>();
  dateFormatter = { day: '2-digit', month: '2-digit', year: 'numeric' } as Intl.DateTimeFormatOptions;
  events: string[] = [];

  constructor(private flightService: FlightService,public fb:FormBuilder) {
    this.minDate =  new Date();
    this.minDateForReturnTime = new Date()
  }

  ngOnInit(): void {
   this.getAllData()
   this.inForm()
  

  }

  
  onSelectionChange() {
    console.log('Selected Option:', this.selectedDirect);
  }


  addEvent(event:any) {
    this.getDepartTime = event.value.toLocaleDateString('tr-TR', this.dateFormatter)
   console.log(this.getDepartTime)
  }
  addEvent1(event:any){
    this.getReturnTime = event.value.toLocaleDateString('tr-TR', this.dateFormatter)
    console.log(this.getReturnTime)
  }

  airportValidator(form: FormGroup) {
    const kalkisHavaalani = form.get('kalkisHavaalani')?.value;
    const varisHavaalani = form.get('varisHavaalani')?.value;
  
    if(kalkisHavaalani && varisHavaalani){

      if (kalkisHavaalani === varisHavaalani) {
        form.get('varisHavaalani')?.setErrors({ sameAirport: true });
      } else {
        form.get('varisHavaalani')?.setErrors(null);
      }
    }
  }

  dateValidator(form: FormGroup) {
    const kalkisTarihi = form.get('kalkisTarihi')?.value;
    const donusTarihi = form.get('donusTarihi')?.value;
  
    if (donusTarihi && kalkisTarihi && donusTarihi < kalkisTarihi) {
      form.get('donusTarihi')?.setErrors({ wrongDate: true });
    } else {
      form.get('donusTarihi')?.setErrors(null);
    }
  }
  

  inForm(){
    this.flightForm = this.fb.group({
      'kalkisHavaalani': ['', Validators.required], 
      'varisHavaalani': ['', Validators.required],   
      'kalkisTarihi': ['', Validators.required],
      'donusTarihi': ['', Validators.required],
      'selectedDirect': ['gidis']
    }, { validator: [this.airportValidator , this.dateValidator]});

   

   this.flightForm.get('kalkisHavaalani').valueChanges.subscribe((x:any) =>{
    console.log(x)
    this.filterDepartureData(x)
   })
   
   this.flightForm.get('varisHavaalani').valueChanges.subscribe((x:any) =>{
    console.log(x)
    this.filterArrivalData(x)
   })
  }

  

  isDonusTarihiVisible(): boolean {
  console.log(this.flightForm.get('selectedDirect').value === 'gidisDonus')
    return this.flightForm.get('selectedDirect').value === 'gidisDonus';
  }

  isDataSourceEmpty(): boolean {
    return !this.dataSource || this.dataSource.data.length === 0;
  }

  getItemValue(item: any): string {
    if (typeof item === 'string') {
      return item;
    } else if (typeof item.kalkisHavaalani === 'string') {
      return item.kalkisHavaalani;
    }
    return '';
  }
  
  
  filterDepartureData(filteredData: any) {
    console.log('Check Departure:', this.checkDeparture);
  
    this.filteredDepartureOptions = this.infos
      .filter((item: any) => {
        if (typeof item === 'string') {
          return item.toLowerCase().includes(filteredData.toLowerCase());
        } else if (typeof item.kalkisHavaalani === 'string') {
          return item.kalkisHavaalani.toLowerCase().includes(filteredData.toLowerCase());
        }
        return false;
      });
  
    this.filteredDepartureOptions = this.filterDuplicates(this.filteredDepartureOptions, 'kalkisHavaalani');
  }
  
  filterDuplicates(array: any[], key: string) {
    return array.filter((item, index, self) => {
      return self.findIndex((t) => t[key] === item[key]) === index;
    });
  }
  
  filterArrivalData(filteredData1:any){

    this.filteredArrivalOptions = this.infos.filter((item:any) => {
       if (typeof item === 'string') {
         return item.toLowerCase().includes(filteredData1.toLowerCase());
       } else if (item && typeof item.varisHavaalani === 'string') {
         return item.varisHavaalani.toLowerCase().includes(filteredData1.toLowerCase());
       }
       return false;
    }) 

    this.filteredArrivalOptions = this.filterDuplicates(this.filteredArrivalOptions, 'varisHavaalani');
 
   }

   search(){
    this.isShow =true
    
    console.log(this.checkDeparture)
    console.log(this.getDepartTime)

    this.flightForm.value.kalkisTarihi =this.getDepartTime
    this.flightForm.value.donusTarihi =this.getReturnTime 
    
    console.log(this.flightForm.value.kalkisTarihi) 
    console.log(this.flightForm.value.donusTarihi) 
    

     let booleanValue = this.isDonusTarihiVisible()
   

     if(booleanValue == true){


       if(this.flightForm.value.kalkisHavaalani&& this.flightForm.value.kalkisTarihi&&this.flightForm.value.varisHavaalani&&this.flightForm.value.donusTarihi){
        this.displayedColumns = ['havayolu','kalkisHavaalani','varisHavaalani', 'kalkisSaati','kalkisSehir','donusSaati','donusSehir','ucusUzunlugu', 'fiyat'];
         this.checkDeparture = this.checkDeparture.filter((item:any) => item === this.flightForm.value.kalkisHavaalani);
         this.checkDepartureTime = this.checkDepartureTime.filter((item:any) => item === this.flightForm.value.kalkisTarihi);
         this.checkReturn = this.checkReturn.filter((item:any) => item === this.flightForm.value.varisHavaalani);
         this.checkReturnTime= this.checkReturnTime.filter((item:any) => item === this.flightForm.value.donusTarihi);
         console.log(this.checkDeparture)
         // this.dataSource = this.checkDeparture.map((x:any) => ({ ...this.flightForm.value, name: x }));  
         //     console.log(this.dataSource)
         //     this.dataSource = this.checkDepartureTime.map((item:any) => ({ position: item }));  
         //     console.log(this.dataSource)
         //     this.dataSource = this.checkReturn.map((item:any) => ({ position: item }));  
         //     console.log(this.dataSource)
         //     this.dataSource = this.checkReturnTime.map((item:any) => ({ position: item }));  
         //     console.log(this.dataSource)
   
         
         
                 this.filteredFlights = this.infos.filter((flight:any) => {
                 return (
                   flight.kalkisHavaalani === this.flightForm.value.kalkisHavaalani &&
                   flight.kalkisTarihi === this.flightForm.value.kalkisTarihi &&
                   flight.varisHavaalani === this.flightForm.value.varisHavaalani &&
                   flight.donusTarihi === this.flightForm.value.donusTarihi
                 );
               });
             
               // Update the table data source
               this.dataSource.data = this.filteredFlights;
               this.dataSource.sort = this.sort;
   
               console.log( this.dataSource.data)
          
               
   
               
          }
     }

     else if(booleanValue == false){
      this.displayedColumns = ['havayolu','kalkisHavaalani','varisHavaalani', 'kalkisSaati','kalkisSehir','ucusUzunlugu', 'fiyat'];
      if(this.flightForm.value.kalkisHavaalani&& this.flightForm.value.kalkisTarihi&&this.flightForm.value.varisHavaalani){
        this.checkDeparture = this.checkDeparture.filter((item:any) => item === this.flightForm.value.kalkisHavaalani);
        this.checkDepartureTime = this.checkDepartureTime.filter((item:any) => item === this.flightForm.value.kalkisTarihi);
        this.checkReturn = this.checkReturn.filter((item:any) => item === this.flightForm.value.varisHavaalani);
        //this.checkReturnTime= this.checkReturnTime.filter((item:any) => item === this.flightForm.value.donusTarihi);
        console.log(this.checkDeparture)
        // this.dataSource = this.checkDeparture.map((x:any) => ({ ...this.flightForm.value, name: x }));  
        //     console.log(this.dataSource)
        //     this.dataSource = this.checkDepartureTime.map((item:any) => ({ position: item }));  
        //     console.log(this.dataSource)
        //     this.dataSource = this.checkReturn.map((item:any) => ({ position: item }));  
        //     console.log(this.dataSource)
        //     this.dataSource = this.checkReturnTime.map((item:any) => ({ position: item }));  
        //     console.log(this.dataSource)
  
        
        
                this.filteredFlights = this.infos.filter((flight:any) => {
                return (
                  flight.kalkisHavaalani === this.flightForm.value.kalkisHavaalani &&
                  flight.kalkisTarihi === this.flightForm.value.kalkisTarihi &&
                  flight.varisHavaalani === this.flightForm.value.varisHavaalani 
                
                );
              });
            
              // Update the table data source
              this.dataSource.data = this.filteredFlights;
              this.dataSource.sort = this.sort;
  
              console.log( this.dataSource.data)
         
              
  
              
         }
     }
     console.log( this.dataSource.data)

     if(this.dataSource.data.length===0){
      console.log("yok")
     }

    }
     

   


 
    onSort() {
      console.log('Column Header Clicked!');
    }
    getAllData() {
      this.isLoading = true;

      this.flightService.getFlightsInfo().subscribe((data) => {
        this.isLoading = false;

        const flights = data as any[]; // Adjust the type based on your actual data structure
        if (flights && flights.length > 0){
          this.infos = flights;
          this.filteredDepartureOptions = flights;
          this.filteredArrivalOptions = flights;
          this.airlineInfo = flights.map((flight) => flight.havayolu);
          this.airlineCode = flights.map((flight) => flight.code);
          this.checkDeparture = flights.map((flight) => flight.kalkisHavaalani);
          this.checkDepartureTime = flights.map((flight) => flight.kalkisTarihi);
          this.checkReturn = flights.map((flight) => flight.varisHavaalani);
          this.checkReturnTime = flights.map((flight) => flight.donusTarihi);
    
          this.filteredDepartureOptions = this.filterDuplicates(this.filteredDepartureOptions, 'kalkisHavaalani');
          this.filteredArrivalOptions = this.filterDuplicates(this.filteredArrivalOptions, 'varisHavaalani');


          console.log(this.checkDeparture, this.checkReturn)
        } else {
          // Handle the case when no data is returned
          console.log('No data available');
          // You can set a flag or display a message to the user
        }
      },
      (error) => {
        console.error('Error fetching data', error);
        this.isLoading = false;
      });
    }

  
}
