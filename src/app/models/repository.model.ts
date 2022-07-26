import { Injectable } from '@angular/core';
import { BehaviorSubject, interval } from 'rxjs';
import { DataService } from '../services/data.service';
import { Plot } from './plot';
import { exhaustMap } from 'rxjs/operators';

@Injectable()
export class Model {
    private plots: Plot[] = new Array<Plot>();
    private initPlots: Plot[] = new Array<Plot>();
    private selectedPlot: Plot | undefined = undefined;
    private plots$: BehaviorSubject<Plot[]> = new BehaviorSubject<Plot[]>(this.plots);
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
            this.choropleth$.next(data);
        });
    }

    getPlots(): BehaviorSubject<Plot[]> {
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
    updatePlots(mindate?: string, maxDate?: string, priceMin?: number, priceMax?: number) {
        this.dataService.GetPlots(mindate, maxDate, priceMin, priceMax).subscribe(data => {
            this.plots$.next(data);
            this.initPlots = data;
        });
    }

    toggleInactivePlots(showInactive: boolean) {
        var plots = this.initPlots;
        if (!showInactive) {
            plots = plots.filter(p => p.isActive === true);
        }
        this.plots$.next(plots);
    }
}
