import { NgModule } from '@angular/core';
import { MapService } from './map.service';
import { GeoService } from './geo.service';

@NgModule({
  providers: [GeoService, MapService]
})
export class MapModule {}
