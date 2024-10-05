import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { ChatComponent } from './Pages/chat/chat.component';
import { EffectsModule } from '@ngrx/effects';
import { ChatEffects } from './Pages/chat/store/chat.effects';
import * as fromApp from './store/app.reducer';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './Pages/auth/auth.component';
import { HeaderComponent } from './Pages/header/header.component';
import { RegisterPageComponent } from './Pages/register-page/register-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AuthComponent,
    HeaderComponent,
    RegisterPageComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([ChatEffects]),
    AppRoutingModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
