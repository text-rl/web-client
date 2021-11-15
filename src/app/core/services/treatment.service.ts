import {Injectable} from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {TextTreatmentRequest} from "../../shared/models/treatments/requests";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private apiUrl = `${environment.apiUrl}/texttreatment`;

  constructor(private http: HttpClient) {
  }

  create(req: TextTreatmentRequest): Observable<any> {
    return this.http.post(this.apiUrl, req);
  }
}
