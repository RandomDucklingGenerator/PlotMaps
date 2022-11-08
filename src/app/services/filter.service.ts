import { Injectable } from '@angular/core';
import { LatLngBounds } from 'leaflet';
import { Model } from '../models/repository.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  startDate? : Date;
  endDate? : Date;
  priceMin?: number;
  priceMax?: number;
  showInactive: boolean = false;
  bounds?: L.LatLngBounds;
  zoom?: number;

  constructor(private model: Model) { }

  updateAllPlots(){
    this.model.updatePlots(this.startDate, this.endDate, this.priceMin, this.priceMax, this.bounds, this.zoom, this.showInactive);
  }

  boundsChanged(bounds: LatLngBounds, zoom: number) {
    this.bounds = bounds;
    this.zoom = zoom;

    this.updateAllPlots();
}

  changeDates(startDate: Date | undefined, endDate: Date| undefined){
    this.startDate = startDate;
    this.endDate = endDate;

    this.updateAllPlots();
  }

  showInactiveChanged(showInactive: boolean) {
    this.showInactive = showInactive;

    this.updateAllPlots();

}

}
