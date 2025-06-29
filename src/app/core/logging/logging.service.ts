import { Injectable, inject } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class LoggingService {
  private readonly log = inject(NGXLogger);

  constructor() {
  }

  trace(message?: string, ...additions: unknown[]) {
    this.log.trace(message, additions);
  }

  debug(message?: string, ...additions: unknown[]) {
    this.log.trace(message, additions);
  }
}