import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { MainApp } from './components/main-app';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        FormsModule
    ],
    declarations: [MainApp],
    providers: [],
    bootstrap: [MainApp],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MainModule {}