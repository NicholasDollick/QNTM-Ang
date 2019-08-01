import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PgpComponent } from './pgp/pgp.component';
import { MessagesComponent } from './messages/messages.component';
import { MessagesResolver } from './_resolvers/messages.resolver.ts';


export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'login', component: LoginComponent, data: { animation: 'isLeft'}},
    {path: 'register', component: RegisterComponent, data: { animation: 'isRight'}},
    {path: 'messages', component: MessagesComponent, resolve: {messages: MessagesResolver}},
    {path: 'pgp', component: PgpComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
