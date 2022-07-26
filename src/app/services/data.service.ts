import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Plot } from '../models/plot';
import { ApiService } from './api.service';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    constructor(private apiService: ApiService) {}

    public GetPlots(
        mindate?: string,
        maxDate?: string,
        priceMin?: number,
        priceMax?: number
    ): Observable<Plot[]> {
        return this.apiService.getPlots(mindate, maxDate, priceMin, priceMax);
    }

    public GetChoropleth(): any {
        return this.apiService.getChoropleth();
    }
}
