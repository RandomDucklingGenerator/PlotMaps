import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule } from '@angular/common/http'
import { AppComponent } from './app.component';
import { MapComponent } from './components/map/map.component';
import { PopUpService } from './services/popup.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { FilterComponent } from './components/filter/filter.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from './services/api.service';
import { DataService } from './services/data.service';
import { Model } from './models/repository.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CurrencyPipe } from '@angular/common';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    FilterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    LeafletModule,
    FlexLayoutModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    LeafletMarkerClusterModule
  ],
  providers: [PopUpService, ApiService, DataService, Model, CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
