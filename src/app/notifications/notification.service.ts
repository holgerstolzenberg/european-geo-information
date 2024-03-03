import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslocoService } from '@ngneat/transloco';
import { NGXLogger } from 'ngx-logger';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export const options = {
  timeOut: 5000,
  progressBar: true,
  positionClass: 'toast-bottom-right',
  newestOnTop: true
};

@Injectable()
export class NotificationService {
  constructor(
    private toastr: ToastrService,
    private i18nService: TranslocoService,
    private log: NGXLogger
  ) {}

  async showError(message: string, error: HttpErrorResponse) {
    this.log.error(message, error);
    firstValueFrom(this.i18nService.selectTranslate('notifications.error-title')).then(title =>
      this.toastr.error(error.message, title, options)
    );
  }
}
