import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ChatsComponent } from './chats/chats.component';
import { LayoutModule } from '../layout/layout.module';



@NgModule({
  declarations: [
    LoginComponent,
    ChatsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LayoutModule
  ],
  exports: [
    LoginComponent,
    ChatsComponent
  ]
})
export class PagesModule { }
