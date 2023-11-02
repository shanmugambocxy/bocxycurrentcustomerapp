import { Component, OnInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { GlobalsearchPage } from '../globalsearch/globalsearch.page';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
})
export class TabsPage implements OnInit {
  skipLogin: boolean;
  lang: any;
  options : InAppBrowserOptions = {
    location : 'no',//Or 'yes' 
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'yes',//Android only ,shows browser zoom controls 
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only 
    closebuttoncaption : 'Back', //iOS only
    disallowoverscroll : 'no', //iOS only 
    toolbar : 'yes', //iOS only 
    enableViewportScale : 'yes', //iOS only 
    allowInlineMediaPlayback : 'no',//iOS only 
    // presentationstyle : 'pagesheet',//iOS only 
    fullscreen : 'yes',//Windows only    ,
    footercolor:'#FFFFFF',
    footer:'yes',
    closebuttoncolor:'#e82264'
};
  constructor(private storage: Storage, private modalController: ModalController, public translate: TranslateService,
    public TranslateModule: TranslateModule,
    public navCtrl: NavController,
    private inAppBrowser: InAppBrowser
  ) {
    this.lang = 'en';
    this.translate.setDefaultLang('en');
    this.translate.use('en');
  }

  ngOnInit() {
    this.storage.get('skipLogin').then(x => {
      if (x == 'Y') {
        this.skipLogin = true;
      }
    });
  }
  async openServiceSearch() {
    const modal = await this.modalController.create({
      component: GlobalsearchPage,
      cssClass: 'find-store-modal',
    });
    return await modal.present();
  }
  gotoLogin(e) {
    if (this.skipLogin) {
      e.preventDefault();
      e.stopPropagation();
      this.navCtrl.navigateRoot('/login');
      return false;
    }
  }

  openLink(){
    let target = "_blank";
    // let url="https://65199fb7b441056d5f1b344c--amazing-chimera-8c1dc5.netlify.app/jewel/home"
    let url=environment.productUrl;
    this.inAppBrowser.create(url,target,this.options);
  }
}
