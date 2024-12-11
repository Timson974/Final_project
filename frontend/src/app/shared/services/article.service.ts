import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {AllArticleType, ArticleType} from "../../../types/article.type";
import {ActiveParamsType} from "../../../types/active-params.type";
import {ArticleTextType} from "../../../types/article-text.type";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {

  constructor(private http: HttpClient) { }

  getBestArticles(): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/top');
  }
  getArticles(params: ActiveParamsType): Observable<AllArticleType> {
    return this.http.get<AllArticleType>(environment.api + 'articles', {
      params: params
    });
  }
  getArticle(url: string): Observable<ArticleTextType> {
    return this.http.get<ArticleTextType>(environment.api + 'articles/' + url);
  }
  getRelatedArticles(url: string): Observable<ArticleType[]> {
    return this.http.get<ArticleType[]>(environment.api + 'articles/related/' + url);
  }
}
