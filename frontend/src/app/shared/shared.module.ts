import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DialogComponent} from './components/dialog/dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {ArticleCardComponent} from './components/article-card/article-card.component';
import {RouterModule} from "@angular/router";
import {ArticlesFilterComponent} from './components/articles-filter/articles-filter.component';
import {LoaderComponent} from './components/loader/loader.component';
import { ConvertDatePipe } from './pipes/convert-date.pipe';
import {NgxMaskModule} from "ngx-mask";


@NgModule({
  declarations: [
    DialogComponent,
    ArticleCardComponent,
    ArticlesFilterComponent,
    LoaderComponent,
    ConvertDatePipe
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    RouterModule
  ],
  exports: [
    DialogComponent,
    ConvertDatePipe,
    ArticleCardComponent,
    ArticlesFilterComponent,
    LoaderComponent
  ]
})
export class SharedModule {
}
