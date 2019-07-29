import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RecaptchaModule } from 'ng-recaptcha';
import { appRoutes } from './routes';
import { HomeComponent } from './home/home.component';
import { AuthService } from './_services/auth.service';
import { ErrorInterceptorProvider } from './_services/error.interceptor';
import { AlertifyService } from './_services/alertify.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      RegisterComponent,
      HomeComponent
   ],
   imports: [
      BrowserModule,
      RecaptchaModule.forRoot(),
      FormsModule,
      RouterModule.forRoot(appRoutes),
      BrowserAnimationsModule,
      HttpClientModule
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
