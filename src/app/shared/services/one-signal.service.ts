import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  constructor(
    private http: HttpClient
  ) { }

  init(){
    var OneSignal = window['OneSignal'] || [];

    OneSignal.push(() => {
      OneSignal.init(environment.oneSignal);

      OneSignal.on('subscriptionChange', (subscription) => {
        this.subscriptionUserId(subscription);
      });

    });
  }

  async subscriptionUserId(subscription: boolean){
    var OneSignal = window['OneSignal'] || [];

    const player_id = await OneSignal.getUserId();
    this.updatePlayerSignal({ player_id, subscription });
  }

  updatePlayerSignal(data: { player_id: string; subscription: boolean }){
    this.http.put("notifications/push", data).toPromise();
  }
}
