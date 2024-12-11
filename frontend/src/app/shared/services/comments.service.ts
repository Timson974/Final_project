import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CommentsResponseType} from "../../../types/comments-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {ReactionEnum} from "../../../types/reaction.enum";
import {ReactionsType} from "../../../types/reactions.type";


@Injectable({
  providedIn: 'root'
})
export class CommentsService {

  constructor(private http: HttpClient) { }

  getComments(offset: number, articleId: string): Observable<CommentsResponseType | DefaultResponseType> {
    return this.http.get<CommentsResponseType | DefaultResponseType>(environment.api + 'comments', {
      params: {
        offset,
        article: articleId
      }
    });
  }

  sendNewComment(text: string, article:string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType> (environment.api + 'comments', {
      text,
      article
    })
  }
  sendReaction(reaction: ReactionEnum, commentId:string): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType> (environment.api + 'comments/' + commentId +'/apply-action', {
      action: reaction
    })
  }

  getReactionForComment(commentId: string): Observable<ReactionsType[] | DefaultResponseType> {
    return this.http.get<ReactionsType[] | DefaultResponseType>(environment.api + 'comments/' + commentId + '/actions');
  }
  getArticleCommentsReactions(articleId: string): Observable<ReactionsType[] | DefaultResponseType> {
    return this.http.get<ReactionsType[] | DefaultResponseType>(environment.api + 'comments/article-comment-actions', {
      params: {
        articleId
      }
    });
  }

}
