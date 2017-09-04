import { Injectable } from '@angular/core';
import { Http, Response , Headers , RequestOptions } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Joiners,Vote } from './articles-detail-header';

import { BaseApi } from '../../../config/app.api';

@Injectable()
export class ArticlesDetailHeaderService {
  private voteUrl = 'interact/joins/';

  constructor( private http: Http,private baseUrl: BaseApi) { }

  createAuthorizationHeader(headers: Headers) {

    if(window['WebAppInterface']) {
      headers.append('Authorization', window['WebAppInterface'].getAccessToken() != '' ?
      'Bearer ' + window['WebAppInterface'].getAccessToken(): '');
    }

  }

  getJoiner(interactId:number,joinerId:string): Promise<Joiners> {

    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    this.createAuthorizationHeader(headers);

    let options = new RequestOptions({headers:headers});

    const url = `${this.baseUrl.url}${this.voteUrl}?interact_id=${interactId}&joiner_id=${joinerId}`;

    return this.http.get(url, options)
      .toPromise()
      .then(response => response.json() as Joiners)
      .catch(this.handleError);
  }

  joins(interact: number): Promise<Vote> {
    if(window['WebAppInterface']) {
      if(window['WebAppInterface'].getAccessToken() == '') {
        window['WebAppInterface'].toLogin();
      }
    }

    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    this.createAuthorizationHeader(headers);

    let options = new RequestOptions({headers:headers});

    const url = `${this.baseUrl.url}${this.voteUrl}`;

    return this.http.post(url, {interact: interact}, options)
      .toPromise()
      .then(response => response.json() as Vote)
      .catch(this.handleError);
  }

  vote(id:number,vote:any): Promise<Vote> {
    if(window['WebAppInterface']) {
      if(window['WebAppInterface'].getAccessToken() == '') {
        window['WebAppInterface'].toLogin();
      }
    }

    let headers = new Headers({
      'Content-Type': 'application/json'
    });
    this.createAuthorizationHeader(headers);

    let options = new RequestOptions({headers:headers});

    const url = `${this.baseUrl.url}${this.voteUrl}${id}/`;

    alert(url);

    alert(vote);
    return this.http.post(url, {id:id, vote:vote}, options)
      .toPromise()
      .then(response => response.json() as Vote)
      .catch(this.handleError);
  }

  private handleError (error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.msg ? error.msg : error.toString();
    }
    return Promise.reject(errMsg);
  }

}
