/// <reference lib="webworker" />

import { Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import 'zone.js';
import { WorldService } from './services/world.service';
import { makeClassProvider, NgRxWorker } from './ngrx-worker';

@NgModule({
  imports: [BrowserModule],
  providers: [makeClassProvider(WorldService)],
})
export class AppWorker extends NgRxWorker {
  constructor(injector: Injector) {
    super(injector);
  }
}

platformBrowserDynamic()
  .bootstrapModule(AppWorker)
  .catch((err) => console.error(err));
