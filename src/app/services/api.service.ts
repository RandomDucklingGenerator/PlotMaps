import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Plot } from '../models/plot';

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
    ): Observable<Plot[]> {
        let queryString = '';
        if (minDate && maxDate) {
            // queryString=`minDate=${minDate}&maxDate=${maxDate}&priceMin=${priceMin}&priceMax=${priceMax}`
        }

        const path = `${environment.baseUrl}/plots?${queryString}`;
        return this.http.get<Plot[]>(path);
    }

    public getChoropleth(): any {
        const path = `${environment.baseUrl}/choropleth`;
        return this.http.get<any>(path);
    }
}
