import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './Pages/chat/chat.component';
import { RegisterPageComponent } from './Pages/register-page/register-page.component';

const routes: Routes = [
  {path:'', redirectTo: '', pathMatch: 'full'},
  {path:'', component: ChatComponent},
  {path: 'register', component: RegisterPageComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
