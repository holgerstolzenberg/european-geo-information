import { NgModule } from '@angular/core';
import { MapService } from './map.service';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

@NgModule({
  exports: [LeafletModule],
  providers: [MapService]
})
export class MapModule {}
