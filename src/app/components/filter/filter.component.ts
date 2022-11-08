import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { FormGroup, FormControl, NgForm } from '@angular/forms';
import { Model } from 'src/app/models/repository.model';
import { FilterService } from 'src/app/services/filter.service';

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
    weekcheck: boolean = false;
    showInactive: boolean = false;
    constructor(private filterService: FilterService) {
    }
    priceMax: number = Number.MAX_SAFE_INTEGER;
    priceMin: number = 0;

    ngOnInit(): void {
        this.filterService.updateAllPlots();
    }


    lastSevenDays(){
        this.weekcheck = !this.weekcheck;
        if(this.weekcheck){
            let weekdate = new Date();
            weekdate.setDate(weekdate.getDate() - 7);

            this.filterService.changeDates(weekdate, new Date());
        }
        else{
            this.filterService.changeDates(undefined, undefined);

        }       
    }

    showInactiveFunc(){
        this.showInactive = !this.showInactive;
        this.filterService.showInactiveChanged(this.showInactive);    
    }


}
