import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class GeoService {
  private readonly options = { enableHighAccuracy: false, timeout: 5000 };

  constructor(private readonly log: NGXLogger) {}

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
      tap(d => {
        this.log.debug('Got your location', d);
      }),
      // it will be invoked if our source observable emits an error.
      catchError(error => {
        this.log.error('Failed to get your location', error);
        return throwError(() => error);
      })
    );
  }
}
