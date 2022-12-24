import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WorldService {
  addWorld(message: string): string {
    return `${message} World`;
  }
}
