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
        this.notificationService.showInfoLocalized(
          'map.got-geo-location',
          String('[' + coords.longitude + ', ' + coords.latitude + ']')
        );
      }),
      catchError(error => {
        this.notificationService.showErrorLocalized('map.error-on-geo-location', error.message);
        return throwError(() => error);
      })
    );
  }
}
