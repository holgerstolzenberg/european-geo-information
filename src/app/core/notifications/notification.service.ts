import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { I18nService } from '../i18n/i18n.service';

export const options = {
  timeOut: 3000,
  progressBar: true,
  positionClass: 'toast-bottom-right',
  newestOnTop: true
};

@Injectable()
export class NotificationService {
  constructor(
    private readonly toastrService: ToastrService,
    private readonly i18nService: I18nService,
    private readonly log: NGXLogger
  ) {
  }

  showError(message: string, error: HttpErrorResponse | GeolocationPositionError) {
    this.log.error(message, error);
    firstValueFrom(this.i18nService.translate('notifications.error-title')).then(title =>
      this.toastrService.error(error.message, title, options)
    );
  }

  showErrorLocalized(messageKey: string, ...additional: unknown[]) {
    firstValueFrom(this.i18nService.translateMultiple(['notifications.error-title', messageKey])).then(values => {
        this.log.error(values[1], additional);
        this.toastrService.error(values[1] + ' ' + additional, values[0], options);
      }
    );
  }

  showInfoLocalized(messageKey: string, ...additional: unknown[]) {
    firstValueFrom(this.i18nService.translateMultiple(['notifications.info-title', messageKey])).then(values => {
        this.log.info(values[1], additional);
        this.toastrService.info(values[1] + ' ' + additional, values[0], options);
      }
    );
  }
}
