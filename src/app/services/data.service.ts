import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plot } from '../models/plot';
import { PlotData } from '../models/plotdata';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private apiService: ApiService) {}

    public GetPlots(
        mindate?: Date,
        maxDate?: Date,
        priceMin?: number,
        priceMax?: number,
        arg0?: L.LatLngBounds, arg1?: number, showInactive?: boolean
    ): Observable<PlotData> {
        return this.apiService.getPlots(mindate?.toISOString(), maxDate?.toISOString(), priceMin, priceMax, arg0, arg1, showInactive);
    }

    public GetChoropleth(): any {
        return this.apiService.getChoropleth();
    }
}
