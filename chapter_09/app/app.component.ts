import { Component } from 'angular2/core';
import { RouteConfig, ROUTER_DIRECTIVES, ROUTER_PROVIDERS, Router } from 'angular2/router';
import { HTTP_PROVIDERS } from 'angular2/http';
import { FORM_PROVIDERS } from 'angular2/common';
import { POMODORO_PROVIDERS, RouterOutletDirective, AuthenticationService } from './shared/shared';
import { TasksComponent, TaskEditorComponent } from './tasks/tasks';
import { TimerComponent } from './timer/timer';
import LoginComponent from './login/login';

@Component({
    selector: 'pomodoro-app',
    directives: [ROUTER_DIRECTIVES, RouterOutletDirective],
    providers: [ROUTER_PROVIDERS, HTTP_PROVIDERS, FORM_PROVIDERS, POMODORO_PROVIDERS],
    styles: [`
        .router-link-active {
            font-weight: bold;
            border-bottom: 2px #d9534f solid;
        }
    `],
    template: `
        <nav class="navbar navbar-default navbar-static-top">
            <div class="container">
                <div class="navbar-header">
                    <strong class="navbar-brand">My Pomodoro App</strong>
                </div>
                <ul class="nav navbar-nav navbar-right">
                    <li><a [routerLink]="['TasksComponent']">Tasks</a></li>
                    <li><a [routerLink]="['TimerComponent']">Timer</a></li>
                    <li *ngIf="!userIsLogged"><a [routerLink]="['LoginComponent']">Login</a></li>
                    <li *ngIf="userIsLogged"><a [routerLink]="['TaskEditorComponent']">Publish Task</a></li>
                    <li *ngIf="userIsLogged"><a href="#" (click)="logout($event)">Logout</a></li>
                </ul>
            </div>
        </nav>
        <pomodoro-router-outlet protectedPath="tasks/editor" loginUrl="login">
        </pomodoro-router-outlet>
    `
})
@RouteConfig([
    { path: '',             name: 'Home',                 redirectTo: ['TasksComponent'] },
    { path: 'tasks',        name: 'TasksComponent',       component: TasksComponent, useAsDefault: true },
    { path: 'tasks/editor', name: 'TaskEditorComponent',  component: TaskEditorComponent },
    { path: 'timer/...',    name: 'TimerComponent',       component: TimerComponent },
    { path: 'login',        name: 'LoginComponent',       component: LoginComponent }
])
export default class AppComponent {
    userIsLogged: boolean;

    constructor(
        private authenticationService: AuthenticationService,
        private router: Router) {
            authenticationService.userLoggedInStatus.subscribe(userIsloggedIn => {
                this.userIsLogged = userIsloggedIn;
            });
        }

    logout($event): void {
        $event.preventDefault();

        this.authenticationService.logout().then(success => {
            if(success) {
                this.router.navigateByUrl('/');
            }
        });
    }
}