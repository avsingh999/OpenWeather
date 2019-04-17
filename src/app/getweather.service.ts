import { Injectable } from '@angular/core';
import {HttpClient,HttpErrorResponse }  from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GetweatherService {
apikey ="3987c2e7993e730caff3f06a7a6003da" ;

 country = "India";
//  private _url:string="/assets/datav.json";
  constructor(private http:HttpClient) { }

  getEmployees(city){
  //  link=;   console.log(city)
    return this.http.get("https://api.openweathermap.org/data/2.5/weather?q="+city+","+this.country+"&appid="+this.apikey)
               .catch(this.errorHandler);
  }
  errorHandler(error:HttpErrorResponse){
    return Observable.throw(error.message || "server Error");

  }
}

 
