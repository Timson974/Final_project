import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ArticleRoutingModule } from './article-routing.module';
import { BlogComponent } from './blog/blog.component';
import { ArticleComponent } from './article/article.component';
import {SharedModule} from "../../shared/shared.module";
import {FormsModule} from "@angular/forms";
import { CommentComponent } from './comment/comment.component';


@NgModule({
  declarations: [
    BlogComponent,
    ArticleComponent,
    CommentComponent
  ],
  imports: [
    CommonModule,
    ArticleRoutingModule,
    SharedModule,
    FormsModule
  ]
})
export class ArticleModule { }
