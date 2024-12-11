import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleTextType} from "../../../../types/article-text.type";
import {ArticleService} from "../../../shared/services/article.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ArticleType} from "../../../../types/article.type";
import {environment} from "../../../../environments/environment";
import {CommentsResponseType, CommentType} from "../../../../types/comments-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {NgForm} from "@angular/forms";
import {CommentsService} from "../../../shared/services/comments.service";
import {SnackBarService} from "../../../shared/services/snack-bar.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {ReactionEnum} from "../../../../types/reaction.enum";
import {ReactionsType} from "../../../../types/reactions.type";
import {Subscription} from "rxjs";


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit, OnDestroy {
  article!: ArticleTextType;
  commentsOnPage: CommentType[] = [];
  articleCommentsReactions: ReactionsType[] = []
  relatedArticle: ArticleType[] = [];
  serverStaticPath: string = environment.serverStaticPath;
  userIsLoggedIn: boolean = false;
  isLoading: boolean = false;
  userInfo: UserInfoType | null = null;
  commentForm = {
    text: '',
  };
  commentCountOnPage: number = 0;
  private subscription: Subscription = new Subscription();

  constructor(private articleService: ArticleService, private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private commentsService: CommentsService, private snackBar: SnackBarService,
  ) {
    this.userIsLoggedIn = this.authService.getIsLoggedIn();
    if (this.authService.getIsLoggedIn()) {
      this.userInfo = this.authService.getUserInfo();
    }
  }

  ngOnInit(): void {
    this.subscription.add(this.authService.isLogged$.subscribe((data: boolean) => {
        if (data) {
          this.userInfo = this.authService.getUserInfo();
          this.userIsLoggedIn = true;
        } else {
          this.userInfo = null;
          this.userIsLoggedIn = false;
        }
      })
    )
    this.subscription.add(this.activatedRoute.params.subscribe(params => {
        if (params) {

          this.articleService.getArticle(params['url'])
            .subscribe(data => {
              this.article = data;
              this.commentsOnPage = data.comments;
              this.article.text = this.replaceDuplicateText(data.text);
              this.commentCountOnPage = data.commentsCount >= 3 ? 3 : data.commentsCount;
              if (this.userIsLoggedIn) {
                this.commentsService.getArticleCommentsReactions(this.article.id)
                  .subscribe(data => {
                    if ((data as DefaultResponseType).error) {
                      throw new Error((data as DefaultResponseType).message)
                    }
                    this.articleCommentsReactions = data as ReactionsType[]
                  })
              }
            });

          this.articleService.getRelatedArticles(params['url'])
            .subscribe(data => {
              this.relatedArticle = data
            });
        }
      })
    )

  }

  replaceDuplicateText(text: string): string {
    const textWithoutH1 = text.replace(/\s?<h1[^>]*?>.*?<\/h1>\s?/si, ' ');
    const description = `<p>${this.article.description}</p>`;
    return textWithoutH1.replace(description, ' ')
  }

  submitForm(writeComment: NgForm) {
    if (writeComment.valid && this.article.id) {
      this.subscription.add(this.commentsService.sendNewComment(this.commentForm.text, this.article.id)
        .subscribe({
          next: (data) => {
            if (data.error) {
              this.snackBar.openSnackBar(data.message);
              console.log(data.message);
              throw new Error(data.message);
            }
            this.commentForm.text = '';
            writeComment.reset();
            this.updateDataArticle();
          },
          error: (error) => {
            console.log(error.error.message);
          }
        })
      )
    }
  }

  downloadComments() {
    this.isLoading = true;
    this.subscription.add(this.commentsService.getComments(this.commentCountOnPage, this.article.id)
      .subscribe(data => {
        if ((data as DefaultResponseType).error) {
          console.log((data as DefaultResponseType).message);
          this.isLoading = false;
          throw new Error((data as DefaultResponseType).message);
        }
        this.commentsOnPage = [...this.commentsOnPage, ...(data as CommentsResponseType).comments];
        this.article.commentsCount = (data as CommentsResponseType).allCount;
        this.commentCountOnPage += (data as CommentsResponseType).comments.length;
        this.isLoading = false;
      })
    )
  }

  changeReaction(event: { commentId: string, reaction: ReactionEnum | null }) {
    if (this.userIsLoggedIn) {
      this.commentsOnPage.forEach(itemComment => {
        if (itemComment.id === event.commentId) {
          const oldReaction: ReactionsType | undefined = this.articleCommentsReactions.find(item => item.comment === event.commentId);
          if (oldReaction) {
            if (event.reaction && event.reaction === ReactionEnum.like && oldReaction.action === ReactionEnum.dislike) {
              itemComment.likesCount++
              itemComment.dislikesCount--
            } else if (event.reaction && event.reaction === ReactionEnum.dislike && oldReaction.action === ReactionEnum.like) {
              itemComment.dislikesCount++
              itemComment.likesCount--
            } else if (!event.reaction && oldReaction.action === ReactionEnum.dislike) {
              itemComment.dislikesCount--
            } else if (!event.reaction && oldReaction.action === ReactionEnum.like) {
              itemComment.likesCount--
            }
          } else {
            if (event.reaction && event.reaction === ReactionEnum.like) {
              itemComment.likesCount++
            } else if (event.reaction && event.reaction === ReactionEnum.dislike) {
              itemComment.dislikesCount++
            }
          }
          this.subscription.add(this.commentsService.getArticleCommentsReactions(this.article.id)
            .subscribe(data => {
              if ((data as DefaultResponseType).error) {
                throw new Error((data as DefaultResponseType).message)
              }
              this.articleCommentsReactions = data as ReactionsType[]
            })
          )
        }
      })
    }
  }

  updateDataArticle() {
    this.subscription.add(this.articleService.getArticle(this.article.url)
      .subscribe({
        next: (data) => {
          this.commentsOnPage = [data.comments[0], ...this.commentsOnPage]
          this.article.comments = data.comments;
          this.article.commentsCount = data.commentsCount;
          this.commentCountOnPage++;
        },
        error: (error) => {
          console.log(error.error.message);
        }
      })
    )
  }


  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
