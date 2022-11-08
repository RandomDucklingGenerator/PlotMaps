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
import { PlotData } from '../models/plotdata';
import { FilterService } from './filter.service';

const iconRetinaUrl = 'assets/cluster.png';
const iconUrl = 'assets/cluster.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconCluster = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [0, 0]
});

@Injectable({
    providedIn: 'root'
})


export class MarkerService {


    
    geojson: any | undefined;
    markers: Plot[] = [];
    max: number = 0;
    min: number = 99999;
    map: L.Map | undefined;
    plots$: BehaviorSubject<PlotData>;
    cluster: L.MarkerClusterGroup | undefined;
    powiaty: L.LayerGroup<any> | undefined;
    layer: L.LayerGroup<any> | undefined;
    choroplethData: any;
    markerList: any;

    constructor(
        private model: Model,
        private filterService: FilterService
    ) {
        this.plots$ = model.getPlots();
        this.plots$.subscribe(plots => this.insertPlotMarkersToMap(plots));
        this.choroplethData = model.getChoropleth();
    }

    public openPopup(plot: Plot) {
        this.map?.flyTo([plot.latitude, plot.longitude], 18, {
            animate: true,
            duration: 1
        });
    }

    boundsChanged(arg0: L.LatLngBounds, arg1: number) {
        this.filterService.boundsChanged(arg0, arg1);
    }

    addMapToUpdate(
        layer: L.LayerGroup,
        //cluster: L.MarkerClusterGroup,
        powiaty: L.LayerGroup,
        map: L.Map
    ) {
        this.map = map;
        this.layer = layer;
        //this.cluster = cluster;
        this.powiaty = powiaty;
    }

    insertPlotMarkersToMap(plots: PlotData) {
        if(plots != undefined){
            this.layer?.clearLayers();
            this.cluster?.clearLayers();
            this.powiaty?.clearLayers();
    
            this.markerList = [[1, 1, 1]];

            for (let i = 0; i < plots.clusters.length; i++) {
                const lon = plots.clusters[i].longitude;
                const lat = plots.clusters[i].latitude;

                if (lat != null && lon != null) {
                    const marker = L.marker([lat, lon]);
                    marker.on('click', event => {
                        //this.model.ChangeActiveMarker(plots.clusters[i]);
                    });
                    //marker.bindPopup(this.popupService.makeCapitalPopup(plots[i]));
    
                        let icon = new L.DivIcon({
                            className: 'my-div-icon',
                            html: `<div style="position: relative; text-align: center" >` +
                                '<img class="my-div-image" src="assets/cluster.png"/>'+
                                  '<span class="my-div-span" style="position: absolute; top: 50%; left: 50%; transform: translate(-0%, -50%)">' +  plots.clusters[i].displayNumber +'</span>' +
                                  `</div>`
                        })
                        marker.setIcon(icon);
                    

                    if(plots !== undefined && plots.points.length > 0 && plots.points[i] !== undefined){
                        marker.addTo(this.layer!);
                        //this.cluster?.addLayer(marker);
                        this.markerList.push([
                            marker.getLatLng().lat,
                            marker.getLatLng().lng,
                            plots.points[i].id
                        ]);
                    }

                    
                }
            }


    
            for (let i = 0; i < plots.points.length; i++) {
                const lon = plots.points[i].longitude;
                const lat = plots.points[i].latitude;
    
                if (lat != null && lon != null) {
                    const marker = L.marker([lat, lon]);
                    marker.on('click', event => {
                        this.model.ChangeActiveMarker(plots.points[i]);
                    });
                    //marker.bindPopup(this.popupService.makeCapitalPopup(plots[i]));

                    let weekdate = new Date();
                    weekdate.setDate(weekdate.getDate() - 7);

    
                    if(new Date(plots.points[i].scrappedDate).getTime() >= weekdate.getTime()){

                        let iconRetinaUrl = 'assets/marker-48.png';
                        let iconUrl = 'assets/marker-48.png';
                        let shadowUrl = 'assets/marker-shadow.png';

                        let icon = L.icon({
                            iconRetinaUrl,
                            iconUrl,
                            shadowUrl,
                            iconSize: [25, 41],
                            iconAnchor: [12, 41],
                            popupAnchor: [1, -34],
                            tooltipAnchor: [16, -28],
                            shadowSize: [41, 41]
                        });
                        marker.setIcon(icon);
                    }
                    marker.addTo(this.layer!);
                    //this.cluster?.addLayer(marker);
                    this.markerList.push([
                        marker.getLatLng().lat,
                        marker.getLatLng().lng,
                        plots.points[i].density,
                        plots.points[i].id
                    ]);
                }
            }
            this.layer?.addTo(this.map!);
    
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
}
