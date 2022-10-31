import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plot } from '../models/plot';
import { PlotData } from '../models/plotdata';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    constructor(private http: HttpClient) {}

    public getPlots(
        minDate?: string,
        maxDate?: string,
        priceMin?: number,
        priceMax?: number
    ): Observable<PlotData> {
        let queryString = '';
        if (minDate && maxDate) {
            // queryString=`minDate=${minDate}&maxDate=${maxDate}&priceMin=${priceMin}&priceMax=${priceMax}`
        }

        const path = `${environment.baseUrl}/plots?${queryString}`;
        return this.http.get<PlotData>(path);
    }

    getPlotsWithBounds(arg0: LatLngBounds, arg1: number): Observable<PlotData> {
        console.log(arg0);
        let queryString=`northEastLat=${arg0.getNorthEast().lat}&northEastLng=${arg0.getNorthEast().lng}&southWestLat=${arg0.getSouthWest().lat}&southWestLng=${arg0.getSouthWest().lng}&zoom=${arg1}`
        const path = `${environment.baseUrl}/plots?${queryString}`;
        return this.http.get<PlotData>(path);
    }

    public getChoropleth(): any {
        const path = `${environment.baseUrl}/choropleth`;
        return this.http.get<any>(path);
    }
}
