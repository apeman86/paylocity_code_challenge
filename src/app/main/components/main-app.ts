import { Component } from '@angular/core';
import { ContextService } from '../services/context-service';

@Component({
    selector: 'main-app',
    moduleId: module.id,
    templateUrl: '../templates/main-app.html'
})
export class MainApp {

    constructor(private contextService: ContextService) {

    }

    clear(): void {
        this.contextService.clear();
    }

}