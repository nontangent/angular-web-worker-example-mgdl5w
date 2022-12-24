import { ProviderToken } from '@angular/core';
import {
  filter,
  fromEvent,
  map as _map,
  Observable,
  ReplaySubject,
  take,
} from 'rxjs';
import { makeClassToken } from './utils';

export class WorkerManager {
  private static _instance: WorkerManager;
  static get instance(): WorkerManager {
    return (this._instance ??= new WorkerManager());
  }

  private latestTaskId: number = 0;
  private worker: Worker;
  public message$ = new ReplaySubject();

  constructor() {
    console.debug('manager initialized!');
    this.worker = new Worker(new URL('../app.worker', import.meta.url));

    fromEvent<MessageEvent>(this.worker, 'message').subscribe((ev) =>
      this.message$.next(ev.data)
    );
    fromEvent<ErrorEvent>(this.worker, 'error').subscribe((ev) =>
      this.message$.error(ev.error)
    );
  }

  static runOnWorker<T, K>(
    fn: (arg: T) => K,
    deps: Record<string, ProviderToken<T>>
  ): (args: any) => Observable<any> {
    return this.instance.runOnWorker(fn, deps);
  }

  runOnWorker<T, K>(
    fn: (arg: T) => K,
    deps: Record<string, ProviderToken<T>>
  ): (args: any) => Observable<any> {
    return (args: any) => {
      const id = this.latestTaskId++;
      this.worker.postMessage({
        type: 'work-request',
        id,
        deps: Object.entries(deps).reduce(
          (acc, [key, token]) => ({
            ...acc,
            [key]: makeClassToken(token),
          }),
          {}
        ),
        fn: `${fn}`,
        args,
      });
      return this.message$.pipe(
        filter((data) => (data as any).id === id),
        _map((data) => (data as any).result),
        take(1)
      );
    };
  }
}
