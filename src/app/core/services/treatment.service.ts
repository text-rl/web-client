import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TextTreatmentRequest} from "../../shared/models/treatments/requests";
import {Observable} from "rxjs";
import {ApiBaseService} from "./api-base.service";
import {ApiUrlService} from "./api-url.service";

@Injectable({
  providedIn: 'root'
})
export class TreatmentService extends ApiBaseService {

  constructor(http: HttpClient, apiUrlService: ApiUrlService) {
    super(http, apiUrlService, "texttreatment");
  }

  create(req: TextTreatmentRequest): Observable<any> {
    return this.http.post(this.url, req);
  }

}
