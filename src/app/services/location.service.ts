import {WebsocketClient} from '../websockets/websocket-client.service';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';

/**
 * Abstraction layer for auth. Nice to have when things get more complicated.
 */
@Injectable()
export class LocationService {

  constructor() {
  }

  public getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {

          resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
        },
        err => {
          reject(err);
        });
    });
  }
}
