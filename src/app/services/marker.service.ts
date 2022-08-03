import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as L from 'leaflet';
import { PopUpService } from './popup.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Plot } from '../models/plot';
import { Model } from '../models/repository.model';
import { ComponentFactoryResolver } from '@angular/core';
import { Injector } from '@angular/core';
import { GeoJSONOptions } from 'leaflet';

@Injectable({
    providedIn: 'root'
})
export class MarkerService {
    geojson: any | undefined;
    markers: Plot[] = [];
    max: number = 0;
    min: number = 99999;
    map: L.Map | undefined;
    plots$: BehaviorSubject<Plot[]>;
    cluster: L.MarkerClusterGroup | undefined;
    powiaty: L.LayerGroup<any> | undefined;
    layer: L.LayerGroup<any> | undefined;
    choroplethData: any;

    constructor(
        private http: HttpClient,
        private model: Model,
        private popupService: PopUpService,
        private resolver: ComponentFactoryResolver,
        private injector: Injector
    ) {
        this.plots$ = model.getPlots();
        this.plots$.subscribe(plots => this.insertPlotMarkersToMap(plots));
        this.choroplethData = model.getChoropleth();
    }

    addMapToUpdate(
        layer: L.LayerGroup,
        cluster: L.MarkerClusterGroup,
        powiaty: L.LayerGroup,
        map: L.Map
    ) {
        this.map = map;
        this.layer = layer;
        this.cluster = cluster;
        this.powiaty = powiaty;
    }

    insertPlotMarkersToMap(plots: Plot[]) {
        this.layer?.clearLayers();
        this.cluster?.clearLayers();
        this.powiaty?.clearLayers();

        var markerList:any = [[1, 1, 1]];

        for (let i = 0; i < plots.length; i++) {
            const lon = plots[i].longitude;
            const lat = plots[i].latitude;

            if (lat != null && lon != null) {
                const marker = L.marker([lat, lon]);
                marker.on('click', event => {
                    this.model.ChangeActiveMarker(plots[i]);
                });
                marker.bindPopup(this.popupService.makeCapitalPopup(plots[i]));

                //marker.addTo(map);
                this.cluster?.addLayer(marker);
                markerList.push([marker.getLatLng().lat, marker.getLatLng().lng, plots[i].density]);
            }
        }
        this.cluster?.addTo(this.map!);

        this.model.getChoropleth().subscribe((GeoJsonObject: any) => {
            const stateLayer = L.geoJSON(GeoJsonObject, {
                style: geometries => ({
                    weight: 1,
                    opacity: 0.5,
                    fillOpacity: 0.6,
                    fillColor: getColor(parseFloat(geometries?.properties.density))
                })
            });

            stateLayer.addTo(this.powiaty!);
            var info = new L.Control();
        });

        function getColor(d: number) {
            if (d === undefined || d === null || isNaN(d)) {
                return ' ';
            }
            return d > 1000
                ? '#800026'
                : d > 800
                ? '#BD0026'
                : d > 500
                ? '#E31A1C'
                : d > 300
                ? '#FC4E2A'
                : d > 150
                ? '#FD8D3C'
                : d > 60
                ? '#FEB24C'
                : d > 20
                ? '#FED976'
                : '#FFEDA0';
        }
    }
}
