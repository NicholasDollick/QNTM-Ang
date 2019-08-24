import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { PgpComponent } from './pgp/pgp.component';
import { MessagesComponent } from './messages/messages.component';
import { MessagesResolver } from './_resolvers/messages.resolver.ts';
import { AboutComponent } from './about/about.component';
import { SecurityComponent } from './security/security.component';
import { ChatComponent } from './livechat/chat/chat.component';
import { TestComponent } from './test/test.component';
import { AuthGuard } from './_guards/auth.guard';
import { ChatContainerComponent } from './livechat/chat-container/chat-container.component';


export const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children: [
            {path: 'messages', component: MessagesComponent, resolve: {messages: MessagesResolver}},
            {path: 'pgp', component: PgpComponent},
            // {path: 'chat', component: ChatContainerComponent},
            {path: 'test', component: TestComponent}
        ]
    },
    {path: 'chat', component: ChatContainerComponent},
    {path: 'login', component: LoginComponent, data: { animation: 'isLeft'}},
    {path: 'register', component: RegisterComponent, data: { animation: 'isRight'}},
    {path: 'home', component: HomeComponent},
    {path: 'about', component: AboutComponent},
    {path: 'security', component: SecurityComponent},
    {path: '**', redirectTo: '', pathMatch: 'full'}
];
