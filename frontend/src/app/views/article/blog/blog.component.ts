import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleService} from "../../../shared/services/article.service";
import {ArticleType} from "../../../../types/article.type";
import {CategoryService} from "../../../shared/services/category.service";
import {CategoriesType} from "../../../../types/categories.type";
import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsUtil} from "../../../shared/utils/active-params.util";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, OnDestroy {
  articles: ArticleType[] = [];
  categories: CategoriesType[] = [];
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];
  pages: number[] = [];
  private subscription: Subscription = new Subscription();
  constructor(private articleService: ArticleService,
              private categoryService: CategoryService,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.subscription.add( this.categoryService.getCategories()
      .subscribe(data => {
        this.categories = data;
        this.subscription.add(this.activatedRoute.queryParams
          .subscribe(params => {
            this.activeParams = ActiveParamsUtil.processParams(params);
            this.appliedFilters = [];
            this.activeParams.categories.forEach(url => {
              const foundName = this.categories.find(item => item.url === url);
              if (foundName) {
                this.appliedFilters.push({
                  name: foundName.name,
                  urlParam: url
                })
              }
            });
            this.subscription.add(this.articleService.getArticles(this.activeParams)
              .subscribe(data => {
                this.pages = [];
                for (let i = 1; i <= data.pages; i++) {
                  this.pages.push(i);
                }
                this.articles = data.items;
                console.log(this.articles); // Лог отформатированных статей
              }))
          }))
      }));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  removeAppliedFilter(appliedFilter: AppliedFilterType) {
    this.activeParams.categories = this.activeParams.categories.filter(item => item !== appliedFilter.urlParam);
    this.activeParams.page = 1;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/blog'], {
      queryParams: this.activeParams
    })
  }

  openPrevPage() {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

  openNextPage() {
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++;
      this.router.navigate(['/blog'], {
        queryParams: this.activeParams
      })
    }
  }

}
