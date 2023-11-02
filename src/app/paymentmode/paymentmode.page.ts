import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { NavController, LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PaymentModeService } from './paymentmode.service';
import { ToastService } from '../_services/toast.service';
import { NavigationHandler } from '../_services/navigation-handler.service';

@Component({
  selector: 'app-paymentmode',
  templateUrl: './paymentmode.page.html',
  styleUrls: ['./paymentmode.page.scss'],
  providers: [Keyboard]
})
export class PaymentmodePage implements OnInit {
  payments = 'paylater';
  paramSubscription: Subscription;
  data: any;
  amount: any = 0;

  paymentHandler: any = null;
  stripe_key = "pk_test_51O65HtSEUi0HHyNj1XFtt1vHmlE4tXTRKmSZlW5vERICYhFnQSGNxYJsLxuvzvUZ9Ul1SkzXYky4YUHIGUrQfJWL003SUwBPxN";
  paymentStatus: boolean = false;
  merchantServiceData: any;
  constructor(
    private location: Location,
    public keyboard: Keyboard,
    public navCtrl: NavController,
    public route: ActivatedRoute,
    public router: Router,
    public httpService: PaymentModeService,
    private toast: ToastService,
    private loadingCtrl: LoadingController,
    private nav: NavigationHandler) { }

  ngOnInit() {
    const param = this.router.getCurrentNavigation().extras.state;
    this.data = param.data;


    if (param.data) {
      this.data = param.data;
    }
    if (param.merchantService) {
      this.merchantServiceData = param.merchantService;

    }
    debugger
    console.log('paramsdata', param);
    this.invokeStripe();
  }
  previous() {
    this.location.back();
  }

  onContinue() {
    console.log('radio', this.payments);
    if (this.payments == 'paylater') {
      this.createAppointment();
    } else {
      // this.navCtrl.navigateRoot('/stripe-payment');
      this.makePayment();

    }

  }
  createAppointment() {
    const loading = this.loadingCtrl.create();
    loading.then(l => l.present());
    this.httpService.createAppointment(this.data).subscribe(
      (response) => {
        loading.then(l => l.dismiss());
        if (response && response.status === 'SUCCESS') {
          if (!response.data.bookedFlag) {
            this.navCtrl.navigateRoot(`/paylater/${response.data.appointmentId}`);
          }
          else {
            this.toast.showToast('Selected slot is already booked. Please select different slot');
          }
        }
        else {
          this.toast.showToast('Something went wrong. Please try again');
        }
      }
    );
  }
  invokeStripe() {
    this.amount = this.merchantServiceData.price;

    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: this.stripe_key,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
            alert('Payment has been successfull!');

          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
  makePayment() {
    // this.loader = true;
    var vm = this;
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: this.stripe_key,
      locale: 'auto',
      currency: 'INR',
      image: 'https://bocxy.com/assets/img/logo.jfif',
      theme: {
        color: '#0074E4', // Set your preferred color
      },
      token: function (stripeToken: any) {
        console.log(stripeToken);
        localStorage.setItem('paymentStatus', '1');
        vm.checkStatus(stripeToken);

      },
    });
    paymentHandler.open({
      name: 'Bocxy Technologies',
      description: 'Test Payment',
      // amount: this.amount,
      amount: this.amount * 100,

    });
  }
  checkStatus(token: any) {
    // this.loader = false;
    // alert('Stripe token generated!');
    if (token) {
      this.createAppointment();
      // this.paymentStatus = true;
      // console.log('paymentStatus', this.paymentStatus);
      // this.loader = false;
      // this.route.navigateByUrl('/home/tabs/tab1');
    }

  }

  goBack(url: string) {
    this.nav.GoBackTo(`/bookappointment/${url}`);
  }
}
