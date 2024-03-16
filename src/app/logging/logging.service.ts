import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class LoggingService {
  constructor(private readonly log: NGXLogger) {
  }

  trace(message?: string, ...additions: unknown[]) {
    this.log.trace(message, additions);
  }

  debug(message?: string, ...additions: unknown[]) {
    this.log.trace(message, additions);
  }
}