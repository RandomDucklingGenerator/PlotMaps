import { Component } from '@angular/core';
import { latLng, tileLayer } from 'leaflet';
import { BehaviorSubject, interval } from 'rxjs';
import { Plot } from './models/plot';
import { Model } from './models/repository.model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Plot map';

  constructor(private model: Model) {}
}
