/// <reference lib="webworker" />

import { ProviderToken } from '@angular/core';
import { Injector } from '@angular/core';
import { WorkRequest, WorkMessage, WORKER_EVENT_TYPES } from './models';
import { filter, fromEvent, map, ReplaySubject, takeUntil } from 'rxjs';

export abstract class NgRxWorker {
  protected readonly destroy$ = new ReplaySubject<void>(1);

  event$ = fromEvent<MessageEvent>(globalThis, 'message');
  message$ = this.event$.pipe(
    filter((event) => WORKER_EVENT_TYPES.includes(event?.data?.type)),
    map((message) => message.data as WorkMessage)
  );

  constructor(protected injector: Injector) {}

  protected map: Record<string, any> = {};

  get<T>(token: ProviderToken<T>): T {
    return (this.map[token.toString()] ??= this.injector.get(token));
  }

  ngOnDestroy() {
    this.destroy$.next();
  }

  async handleRequet(message: WorkRequest) {
    let $$: (service?: any) => any = () => {};
    eval(`$$ = ${message.fn}`);
    const args = message.args;
    Object.entries(message.deps).forEach(([key, token]) => {
      this[key] = this.injector.get(token);
    });
    const result = await (async () => $$.apply($$, [args]))();
    this.postMessage({ id: message.id, type: 'work-response', result });
  }

  postMessage(message: WorkMessage) {
    postMessage(message);
  }

  ngDoBootstrap() {
    this.message$.pipe(takeUntil(this.destroy$)).subscribe(async (message) => {
      console.debug('message:', message);
      switch (message?.type) {
        case 'work-request': {
          return this.handleRequet(message);
        }
      }
    });
  }
}
