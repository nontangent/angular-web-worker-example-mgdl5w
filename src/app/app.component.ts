import { Component } from '@angular/core';
import { map, of } from 'rxjs';
import { map as _map } from './ngrx-worker/operators';
import { WorldService } from './services/world.service';

@Component({
  selector: 'app-root',
  template: `{{ message1$ | async }},  {{ message2$ | async}}, {{ message3$ | async }}`,
  styles: [],
})
export class AppComponent {
  constructor(private world: WorldService) {}

  // 通常のmap
  message1$ = of('Hello').pipe(map((message) => this.world.addWorld(message)));
  // WebWorkerに投げるmap
  message2$ = of('Worker').pipe(
    _map((message) => this.world.addWorld(message), { world: WorldService })
  );
  // WebWorkerに投げるmap(thisからInjectableなclassを抽出する)
  message3$ = of('Short').pipe(
    _map((message) => this.world.addWorld(message), getDeps(this))
  );

  ngOnInit() {}
}

function getDeps(obj: any = this) {
  const isInjectable = (obj: any) => !!obj?.__proto__?.constructor['ɵfac'];
  return Object.entries(obj)
    .filter(([k, v]: [string, any]) => isInjectable(v))
    .reduce(
      (acc, [k, v]: [string, any]) => ({
        ...acc,
        [k]: v.__proto__.constructor,
      }),
      {}
    );
}
