import { ProviderToken } from '@angular/core';
import { concatMap, Observable, switchMap, take } from 'rxjs';
import { WorkerManager } from './ngrx.manager';

export function map<T>(
  fn: (arg: any) => any,
  deps: Record<string, ProviderToken<T>>
) {
  return ($: Observable<any>) =>
    $.pipe(concatMap((args: any) => WorkerManager.runOnWorker(fn, deps)(args)));
}
