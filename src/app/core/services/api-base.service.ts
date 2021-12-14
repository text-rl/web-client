import {ApiUrlService} from "./api-url.service";
import {UrlSegment} from "@angular/router";
import {HttpClient} from "@angular/common/http";

export abstract class ApiBaseService {
  protected url!: string;
  protected constructor(protected http: HttpClient, private readonly _apiUrlService: ApiUrlService, urlSegment: string) {
    this._apiUrlService.apiUrl$.subscribe(url => this.url = `${url}/${urlSegment}`)
  }
}
