import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NGXLogger } from 'ngx-logger';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { I18nService } from '../i18n/i18n.service';

export const options = {
  timeOut: 5000,
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
  ) {}

  showError(message: string, error: HttpErrorResponse | GeolocationPositionError) {
    this.log.error(message, error);
    firstValueFrom(this.i18nService.translate('notifications.error-title')).then(title =>
      this.toastrService.error(error.message, title, options)
    );
  }

  showWarn(message: string) {
    this.log.warn(message);
    firstValueFrom(this.i18nService.translate('notifications.warn-title')).then(title =>
      this.toastrService.warning(message, title, options)
    );
  }
}
