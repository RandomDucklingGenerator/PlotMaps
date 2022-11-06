import { Component, AfterViewInit, OnInit, ComponentFactoryResolver, NgZone } from '@angular/core';
import * as L from 'leaflet';
import { MarkerService } from '../../services/marker.service';
import { icon, latLng, marker, tileLayer } from 'leaflet';
import 'leaflet.markercluster';
import 'proj4leaflet';
import { FilterService } from 'src/app/services/filter.service';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;




@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements AfterViewInit, OnInit {
    addressPoint: [[number, number, number]] = [[1, 1, 1]];
    LAYER_OSM = {
        id: 'openstreetmap',
        name: 'Open Street Map',
        enabled: false,
        layer: tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Open Street Map'
        })
    };
    crsPL = new L.Proj.CRS(
        'EPSG:2180',
        '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +units=m +no_defs '
    );

    tracts = new L.TileLayer.WMS(
        'https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaEwidencjiGruntow',
        {
            layers: 'dzialki,numery_dzialek,budynki',
            transparent: true,
            crs: L.CRS.EPSG3857,
            format: 'image/png',
            tileSize: 1200
        }
    );

    electricity = new L.TileLayer.WMS(
        'https://integracja.gugik.gov.pl/cgi-bin/KrajowaIntegracjaUzbrojeniaTerenu',
        {
            layers: 'przewod_wodociagowy,przewod_kanalizacyjny,przewod_gazowy,przewod_elektroenergetyczny',
            transparent: true,
            crs: L.CRS.EPSG3857,
            format: 'image/png',
            tileSize: 1200
        }
    );

    hydromapa = new L.TileLayer.WMS('https://wody.isok.gov.pl/wss/INSPIRE/INSPIRE_NZ_HY_WORP_WMS', {
        layers: 'NZ.HazardArea',
        transparent: true,
        crs: L.CRS.EPSG3857,
        format: 'image/png',
        tileSize: 1200
    });

    marker = new L.LayerGroup();
    Subareas = new L.LayerGroup();
    testWMS = new L.LayerGroup();
    layers: L.Layer[];
    layersControl = {
        baseLayers: {
            'Open Street Map': this.LAYER_OSM.layer
        },
        overlays: {
            Marker: this.marker,
            Gminy: this.Subareas,
            Działki: this.tracts,
            Media: this.electricity,
            Hydromapa: this.hydromapa
        }
    };

    markerClusterGroup: L.MarkerClusterGroup = L.markerClusterGroup({
        removeOutsideVisibleBounds: true
    });
    markerClusterData = [];

    options = {
        zoom: 10,
        center: latLng(52.36237, 21.28629)
    };
    markers: L.Marker[] = [];
    constructor(private markerService: MarkerService, private ngZone: NgZone, private filterService: FilterService) {
        this.layers = [this.LAYER_OSM.layer, this.marker];
    }
    ngOnInit(): void {}

    ngAfterViewInit(): void {}

    onMapReady(map: L.Map) {
        // this.markerService.addMapToUpdate(this.marker, this.markerClusterGroup, this.Subareas, map);
        this.markerService.addMapToUpdate(this.marker, this.Subareas, map);
        map.on('moveend', e => this.onMapClick(e, map));
    }

    onMapClick(e: L.LeafletEvent, map: L.Map): void {
        this.ngZone.run(() => {
            this.filterService.boundsChanged(map.getBounds(), map.getZoom());
        });
    }

    markerClusterReady(markerCluster: L.MarkerClusterGroup) {}

    
}
