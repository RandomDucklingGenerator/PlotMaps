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

@Component({
    selector: 'app-filter',
    templateUrl: './filter.component.html',
    styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit, AfterViewInit {
    newestPlots!: boolean;

    @ViewChild('f') form!: NgForm;
    showInactive: boolean;
    range: any;
    dateStart: any;
    dateEnd: any;
    constructor(private model: Model) {
        this.showInactive = true;
    }
    priceMax: number = Number.MAX_SAFE_INTEGER;
    priceMin: number = 0;

    ngAfterViewInit(): void {
        this.range.value.start = new Date(localStorage.getItem('mindate')!);
        this.range.value.end = new Date(localStorage.getItem('maxdate')!);
        this.priceMax = Number(localStorage.getItem('priceMax')!);
        this.dateStart = this.range.value.start;
        this.dateEnd = this.range.value.end;
        this.applyFilters();
    }

    ngOnInit(): void {
        this.range = new FormGroup({
            start: new FormControl(),
            end: new FormControl()
        });
    }

    applyFilters() {
        const mindate = new Date(this.range.value.start);
        const maxdate = new Date(this.range.value.end);
        this.model.updatePlots(
            mindate.toISOString(),
            maxdate.toISOString(),
            this.priceMin,
            this.priceMax,
            this.newestPlots
        );

        localStorage.setItem('mindate', mindate.toISOString());
        localStorage.setItem('maxdate', maxdate.toISOString());
        localStorage.setItem('priceMax', this.priceMax.toString());
    }

}
