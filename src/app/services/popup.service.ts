import { Injectable } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class PopUpService {
    constructor(private currency: CurrencyPipe) {}

    makeCapitalPopup(data: any): string {
        return (
            `` +
            `<div>URL: <a href = ${data.url}>${data.url}</a> </div>` +
            `<div>Price: ${this.currency.transform(
                data.price,
                'PLN',
                'symbol',
                '4.2-2',
                'pl'
            )}</div>` +
            `<div>Price m2: ${data.priceM2}</div>` +
            `<div>Area: ${data.areaM2}</div>` +
            `<div>Intensity: ${data.heatvalue}</div>`
        );
    }
}
