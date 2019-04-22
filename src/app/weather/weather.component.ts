import {
    Component,
    OnInit,
    Input
} from '@angular/core';
import {
    GetweatherService
} from '../getweather.service';

import {
    FormControl,
    Validators
} from '@angular/forms'

import {
    Observable
} from 'rxjs';
import {
    debounceTime
} from 'rxjs/operators'


import {
    variable
} from '@angular/compiler/src/output/output_ast';


@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {

    constructor(private getweather: GetweatherService) {
        console.log(localStorage.length)
        let k = 0;
        for (var j in localStorage) {
            if (k >= localStorage.length) {
                break;
            }
            this.logMessage(localStorage[j], this.cityCard[parseInt(j)], parseInt(j))
            this.searchs[parseInt(j)].setValue(localStorage[j]);
            this.show[parseInt(j)] = !this.show[parseInt(j)];
            this.searchs[parseInt(j)].markAsTouched();
            k++;
        }
    }

    public modalname = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8', 'm9'];
    public nameDisplay = ['', '', '', '', '', '', '', '', ''];
    public show = [false, false, false, false, false, false, false, false, false];
    public active = [false, false, false, false, false, false, false, false, false];
    public cityCard = [new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map(), new Map()]
    public errorMsg = ['', '', '', '', '', '', '', '', ''];

    public searchs = [
        new FormControl('', [Validators.required, Validators.minLength(1)]),
        new FormControl('', [Validators.required, Validators.minLength(1)]),
        new FormControl('', [Validators.required, Validators.minLength(1)]),
        new FormControl('', [Validators.required, Validators.minLength(1)]),
        new FormControl('', [Validators.required, Validators.minLength(1)]),
        new FormControl('', [Validators.required, Validators.minLength(1)]),
        new FormControl('', [Validators.required, Validators.minLength(1)]),
        new FormControl('', [Validators.required, Validators.minLength(1)]),
        new FormControl('', [Validators.required, Validators.minLength(1)])
    ]


    addCity() {
        this.searchs.push(new FormControl('', [Validators.required, Validators.minLength(1)]));
        this.show.push(false);
        this.active.push(false);
        this.cityCard.push(new Map());
        this.errorMsg.push('');
        this.searchs.forEach((value, index) => {
            console.log(value);
            value.valueChanges.pipe(debounceTime(1000)).subscribe((searchValue: string) => {
                if (searchValue) {
                    this.logMessage(searchValue, this.cityCard[index], index)
                } else {
                    localStorage.removeItem(index.toString());
                    this.show[index] = false;
                    this.cityCard[index] = new Map();

                }
                console.log(searchValue);
            });
        })
    }

    logMessage(val, emp: Object, index) {
        this.nameDisplay = val
        console.log(this.nameDisplay)
        this.getweather.getEmployees(this.nameDisplay)
            .subscribe(data => {
                    emp = Object.keys(data).map(e => data[e]);
                    let cityData = new Map();
                    cityData.set("id", emp[1][0]["id"])
                    cityData.set("main", emp[1][0]["main"])
                    cityData.set("temp", emp[3]["temp"]);
                    cityData.set("pressure", emp[3]["pressure"]);
                    cityData.set("humidity", emp[3]["humidity"]);
                    cityData.set("speed", emp[5]["speed"]);
                    cityData.set("country", emp[8]["country"]);
                    cityData.set("city", emp[10]);
                    cityData.set("image", "http://openweathermap.org/img/w/" + emp[1][0]["icon"] + ".png");

                    (this.cityCard[index]) = cityData;
                    console.log(this.searchs)
                    if(index<9)
                        localStorage.setItem(index, emp[10]);
                    if (!cityData.get("country"))
                        this.errorMsg[index] = "please try again there is Somthing wrong";
                    else
                        this.errorMsg[index] = '';
                },

                error => this.errorMsg[index] = "Please Correct name"

            );
    }
    onSubmit(e) {
        if (this.searchs[e].value) {
            this.active[e] = true;
            this.show[e] = !this.show[e];
            this.nameDisplay[e] = this.searchs[e].value;
        }
    }
    // setData(data: Object, i: number) {
    //     let emp = Object.keys(data).map(e => data[e]);
    //     if (!!emp[8]["country"]) {
    //         let cityData = new Map();
    //         cityData.set("id", emp[1][0]["id"])
    //         cityData.set("main", emp[1][0]["main"])
    //         cityData.set("temp", emp[3]["temp"]);
    //         cityData.set("pressure", emp[3]["pressure"]);
    //         cityData.set("humidity", emp[3]["humidity"]);
    //         cityData.set("speed", emp[5]["speed"]);
    //         cityData.set("country", emp[8]["country"]);
    //         cityData.set("city", emp[10]);
    //         cityData.set("image", "http://openweathermap.org/img/w/" + emp[1][0]["icon"] + ".png");
    //         this.nameDisplay[i] = cityData.get("city");
    //         console.log(this.nameDisplay[i]);
    //         this.searchs[i].setValue(this.nameDisplay[i]);
    //         (this.cityCard[i]) = cityData;
    //         console.log(this.cityCard)
    //         this.show[i] = !this.show[i];
    //         this.searchs[i].markAsTouched();
    //         this.active[i] = true;
    //     }
    // }

    ngOnInit() {
        this.searchs.forEach((value, index) => {
            console.log(value);
            value.valueChanges.pipe(debounceTime(1000)).subscribe((searchValue: string) => {
                if (searchValue) {
                    this.logMessage(searchValue, this.cityCard[index], index)
                } else {
                    localStorage.removeItem(index.toString());
                    this.show[index] = false;
                    this.cityCard[index] = new Map();
                }
                console.log(searchValue);
            });
        })
    }

}