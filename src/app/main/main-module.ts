import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {HttpModule, JsonpModule} from '@angular/http';
import {FormsModule} from '@angular/forms';
import { MainApp } from './components/main-app';
import { ContextService } from './services/context-service';
import { DataService } from './http-services/data-service';
import { EmployeeComponent } from './components/employee.component';
import { DependentComponent } from './components/dependent.component';
import { PreviewComponent } from './components/preview.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        JsonpModule,
        FormsModule
    ],
    declarations: [MainApp, EmployeeComponent, DependentComponent, PreviewComponent],
    providers: [ContextService, DataService],
    bootstrap: [MainApp],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class MainModule {}