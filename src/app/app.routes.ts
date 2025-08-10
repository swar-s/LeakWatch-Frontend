import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { ScanComponent } from './scan/scan.component';
import { MyScansComponent } from './my-scans';
import { ScanDetailComponent } from './scan-detail';


export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: 'scan', component: ScanComponent },
	{ path: 'my-scans', component: MyScansComponent },
	{ path: 'my-scans/:id', component: ScanDetailComponent },
	{ path: 'breach-summary', loadComponent: () => import('./breach-summary/breach-summary.component').then(m => m.BreachSummaryComponent) }
	// ...other routes
];
