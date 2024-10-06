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
import { ToastrModule } from 'ngx-toastr';
import { CommentComponent } from './Pages/comment/comment.component';
import { CommentFormComponent } from './Pages/comment-form/comment-form.component';
import { CommentListComponent } from './Pages/comment-list/comment-list.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { QuillModule } from 'ngx-quill'

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    AuthComponent,
    HeaderComponent,
    RegisterPageComponent,
    CommentComponent,
    CommentFormComponent,
    CommentListComponent,
  ],
  imports: [ 
    QuillModule.forRoot({
      customOptions: [{
        import: 'formats/font',
        whitelist: ['mirza', 'roboto', 'aref', 'serif', 'sansserif', 'monospace']
      }]
  }),
    RecaptchaModule,
    RecaptchaFormsModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([ChatEffects]),
    AppRoutingModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
  ],
  providers: [
    provideClientHydration(),
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
