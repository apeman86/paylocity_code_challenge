import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { MainApp } from './components/main-app';
import { ContextService } from './services/context-service';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        FormsModule
    ],
    declarations: [MainApp],
    providers: [ContextService],
    bootstrap: [MainApp],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MainModule {}