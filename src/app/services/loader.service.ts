import { Injectable } from '@angular/core';

import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  public isLoading;

  constructor(private loadingController: LoadingController) {}

  public async present() {
    this.isLoading = true;
    return await this.loadingController.create({
      message: 'Wyszukiwanie wydarzeń w pobliżu...',
    }).then(a => {
      a.present().then(() => {
        if (!this.isLoading) {
          a.dismiss().then();
        }
      });
    });
  }

  public async dismiss() {
    this.isLoading = false;
    return await this.loadingController.dismiss().then();
  }
}







