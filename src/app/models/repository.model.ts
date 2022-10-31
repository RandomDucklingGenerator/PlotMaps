import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { DataService } from '../services/data.service';
import { Plot } from './plot';
import { exhaustMap } from 'rxjs/operators';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { PlotData } from './plotdata';

@Injectable()
export class Model {
    private plots!: PlotData;
    private initPlots!: PlotData;
    private selectedPlot: Plot | undefined = undefined;
    private plots$: BehaviorSubject<PlotData> = new BehaviorSubject<PlotData>(this.plots);
    private selectedPlot$: BehaviorSubject<Plot | undefined> = new BehaviorSubject<
    Plot | undefined
    >(this.selectedPlot);
    private choropleth?: any;
    private choropleth$: BehaviorSubject<any> = new BehaviorSubject<any>(this.choropleth);

    constructor(private dataService: DataService) {
        this.getChoroplethData();
    }

    private getChoroplethData() {
        this.dataService.GetChoropleth().subscribe((data: any) => {
            if(data != undefined){
                this.choropleth$.next(data);
            }
        });
    }

    getPlots(): BehaviorSubject<PlotData> {
        return this.plots$;
    }
    getChoropleth(): BehaviorSubject<any> {
        return this.choropleth$;
    }
    getActivePlot(): BehaviorSubject<Plot | undefined> {
        return this.selectedPlot$;
    }
    ChangeActiveMarker(arg0: Plot) {
        this.selectedPlot$.next(arg0);
    }

    updatePlotsWithBounds(arg0: L.LatLngBounds, arg1: number){
        this.dataService.GetPlotsWithBounds(arg0, arg1).subscribe(data => {this.initPlots = data; this.plots$.next(data)});
    }

    updatePlots(
        mindate?: string,
        maxDate?: string,
        priceMin?: number,
        priceMax?: number,
        showNewest?: boolean
    ) {
        this.dataService.GetPlots(mindate, maxDate, priceMin, priceMax).subscribe(data => {
            if(data != undefined){
                this.initPlots = data;
                data.points.forEach(plot => {
                    if (plot.price == undefined || plot.price == null) {
                        plot.price = plot.areaM2 * plot.priceM2;
                    }
                    if (plot.priceM2 == undefined || plot.priceM2 == null) {
                        plot.priceM2 = plot.price / plot.areaM2;
                    }
                });
                this.plots$.next(data);
            }
           
        });
    }

}
