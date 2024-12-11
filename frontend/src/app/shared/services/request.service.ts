import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DialogRequestType, TypeRequest} from "../../../types/dialog-request.type";
import {Observable} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {
  }

  request(name: string, phone: string, type: TypeRequest, service?: string): Observable<DefaultResponseType> {
    const body: DialogRequestType = {
      name, phone, type
    }
    if (type === TypeRequest.order && service) {
      body.service = service
    }
    return this.http.post<DefaultResponseType>(environment.api + 'requests', body);
  }
}
