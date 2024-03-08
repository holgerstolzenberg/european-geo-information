import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { NotificationService } from '../notifications/notification.service';

@Injectable()
export class GeoService {
  private readonly options = { enableHighAccuracy: false, timeout: 5000 };

  constructor(private readonly notificationService: NotificationService) {}

  myCurrentLocation() {
    return new Observable<GeolocationCoordinates>(observer => {
      window.navigator.geolocation.getCurrentPosition(
        position => {
          observer.next(position.coords);
          observer.complete();
        },
        err => observer.error(err),
        this.options
      );
    }).pipe(
      tap(coords => {
        const longitude = this.degreesMinutes(coords.longitude);
        const latitude = this.degreesMinutes(coords.latitude);

        this.notificationService.showInfoLocalized(
          'map.got-geo-location',
          String(this.formatDegreesMinutes(longitude) + ', ' + this.formatDegreesMinutes(latitude))
        );
      }),
      catchError(error => {
        this.notificationService.showErrorLocalized('map.error-on-geo-location', error.message);
        return throwError(() => error);
      })
    );
  }

  // TODO calculation: make sure this algo is valid
  degreesMinutes(value: number) {
    let sec = Math.round(value * 3600);
    const deg = sec / 3600;
    sec = Math.abs(sec % 3600);
    const min = sec / 60;
    sec %= 60;

    return new DegreeMinute(Math.round(deg), Math.round(min), Math.round(sec));
  }

  formatDegreesMinutes(value: DegreeMinute) {
    return value.degrees + '°' + value.minutes + '"' + value.seconds + "'";
  }
}

class DegreeMinute {
  constructor(readonly degrees: number,readonly minutes: number,readonly seconds: number) {
  }
}
