import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Plot } from 'src/app/models/plot';
import { MarkerService } from 'src/app/services/marker.service';

@Component({
    selector: 'app-card',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
    @Input() plot!: Plot;
    @Input() resetEvents!: Observable<Plot>;
    @Output() clickEvent = new EventEmitter<boolean>();
    selected: boolean = false;
    private eventsSubscription!: Subscription;
    constructor(private markerService: MarkerService) {}

    ngOnInit(): void {
        this.eventsSubscription = this.resetEvents.subscribe(plot => {
            this.selected = false;
            if (plot != undefined && plot.id === this.plot.id) {
                this.selected = true;
            }
        });
    }

    openPopup() {
        this.clickEvent.next(this.selected);
        this.selected = true;
        this.markerService.openPopup(this.plot);
    }
    ngOnDestroy() {
        this.eventsSubscription.unsubscribe();
    }
}
