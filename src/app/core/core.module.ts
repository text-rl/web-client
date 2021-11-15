import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {TokenInterceptor} from "./interceptors/token-interceptor";
import {RouterModule} from "@angular/router";
import {SharedModule} from "../shared/shared.module";
import { NavBarComponent } from './components/nav-bar/nav-bar.component';


@NgModule({
    declarations: [
        NavBarComponent
    ],
    imports: [
        HttpClientModule,
        CommonModule,
        RouterModule,
        SharedModule,
    ],
    exports: [
        NavBarComponent
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: TokenInterceptor,
            multi: true,
        }
    ]

})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded.');
    }
  }
}

