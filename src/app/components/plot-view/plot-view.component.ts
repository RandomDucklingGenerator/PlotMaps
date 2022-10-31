import { Component, NgZone, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Plot } from 'src/app/models/plot';
import { PlotData } from 'src/app/models/plotdata';
import { Model } from 'src/app/models/repository.model';

@Component({
    selector: 'app-plot-view',
    templateUrl: './plot-view.component.html',
    styleUrls: ['./plot-view.component.css']
})
export class PlotViewComponent implements OnInit {
    FILTER_PAG_REGEX = /[^0-9]/g;
    plots$: BehaviorSubject<PlotData>;
    plots!: PlotData;
    page: number = 1;
    pageSize: number = 5;
    eventsSubject: Subject<Plot> = new Subject<Plot>();
    selectedMarker$: BehaviorSubject<Plot | undefined>;
    selectedPage: number = 0;

    constructor(private model: Model, private ngZone: NgZone) {
        this.plots$ = model.getPlots();
        this.plots$.subscribe(plots => this.applyPlots(plots));
        this.selectedMarker$ = model.getActivePlot();
        this.selectedMarker$.subscribe(plot => {
            if(plot !== undefined){
                let selectedPlot = this.plots.points.find(p => p.id === plot!.id);
                let index = this.plots.points.indexOf(selectedPlot!);
                let selectedPage = index / this.pageSize;
                let rounded = selectedPage + 1;
                if (selectedPage % 1 != 0) {
                    rounded = Math.ceil(selectedPage);
                }
    
                this.ngZone.run(() => {
                    this.page = rounded;
                });
                this.ngZone.run(() => {
                    this.eventsSubject.next(plot);
                });
            }
            
        });
    }

    ngOnInit(): void {}

    applyPlots(plots: PlotData): void {
        if(plots != undefined){
            this.plots = plots;

        }
    }
    selectPage(page: string) {
        this.page = parseInt(page, 10) || 1;
    }
    formatInput(input: HTMLInputElement) {
        input.value = input.value.replace(this.FILTER_PAG_REGEX, '');
    }
    clickChanged($event: any) {
        this.eventsSubject.next();
    }
}
function round(arg0: any) {
    throw new Error('Function not implemented.');
}
