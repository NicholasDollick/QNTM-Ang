import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';


export const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'login', component: LoginComponent, data: { animation: 'isLeft'}},
    {path: 'register', component: RegisterComponent, data: { animation: 'isRight'}},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
