import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable()
export class LoggingService {
  constructor(private readonly log: NGXLogger) {
  }
}