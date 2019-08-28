import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxLoadingModule } from 'ngx-loading';
import { PaginationModule, BsDropdownModule, TabsModule, BsDatepickerModule, BsModalService,
ModalModule} from 'ngx-bootstrap';

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
import { PgpComponent } from './pgp/pgp.component';
import { CryptoService } from './_services/crypto.service';
import { UserEditResolver } from './_resolvers/user-edit.resolver';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MessagesComponent } from './messages/messages.component';
import { NavComponent } from './nav/nav.component';
import { NavbarService } from './_services/navbar.service';
import { AboutComponent } from './about/about.component';
import { SecurityComponent } from './security/security.component';
import { ChatComponent } from './livechat/chat/chat.component';
import { TestComponent } from './test/test.component';

import {
   MatAutocompleteModule,
   MatButtonModule,
   MatButtonToggleModule,
   MatCardModule,
   MatCheckboxModule,
   MatChipsModule,
   MatDatepickerModule,
   MatDialogModule,
   MatExpansionModule,
   MatGridListModule,
   MatIconModule,
   MatInputModule,
   MatListModule,
   MatMenuModule,
   MatNativeDateModule,
   MatPaginatorModule,
   MatProgressBarModule,
   MatProgressSpinnerModule,
   MatRadioModule,
   MatRippleModule,
   MatSelectModule,
   MatSidenavModule,
   MatSliderModule,
   MatSlideToggleModule,
   MatSnackBarModule,
   MatSortModule,
   MatTableModule,
   MatTabsModule,
   MatToolbarModule,
   MatTooltipModule,
   MatStepperModule
 } from '@angular/material';
import { ChatContainerComponent } from './livechat/chat-container/chat-container.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ModalContainerComponent } from 'ngx-bootstrap/modal/public_api';
import { FileUploadModule } from 'ng2-file-upload';




export function tokenGetter() {
   if (localStorage.getItem('token') === null) {
      return sessionStorage.getItem('token');
   } else {
    return localStorage.getItem('token');
 }
}

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      RegisterComponent,
      HomeComponent,
      PgpComponent,
      MessagesComponent,
      NavComponent,
      AboutComponent,
      SecurityComponent,
      ChatComponent,
      TestComponent,
      ChatContainerComponent,
      UserEditComponent
   ],
   imports: [
      BrowserModule,
      RecaptchaModule.forRoot(),
      FormsModule,
      RouterModule.forRoot(appRoutes),
      BrowserAnimationsModule,
      HttpClientModule,
      NgxLoadingModule.forRoot({}),
      PaginationModule.forRoot(),
      BsDatepickerModule.forRoot(),
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ['localhost:5000'],
            blacklistedRoutes: ['localhost:5000/api/auth']
         }
      }),
      MatTabsModule,
      MatCardModule,
      MatGridListModule,
      MatButtonModule,
      MatInputModule,
      MatListModule,
      MatIconModule,
      MatSidenavModule,
      MatProgressSpinnerModule,
      MatTooltipModule,
      MatDialogModule,
      ModalModule.forRoot(),
      FileUploadModule
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      CryptoService,
      MessagesResolver,
      UserEditResolver,
      NavbarService,
      BsModalService
   ],
   bootstrap: [
      AppComponent,
   ]
})
export class AppModule { }
