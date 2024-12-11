import {Component, OnDestroy, OnInit} from '@angular/core';
import {ArticleType} from "../../../types/article.type";
import {ArticleService} from "../../shared/services/article.service";
import {OwlOptions} from "ngx-owl-carousel-o";
import {MatDialog} from "@angular/material/dialog";
import {DialogComponent} from "../../shared/components/dialog/dialog.component";
import {NumberWindow, TypeDialog} from "../../../types/dialog-data.type";
import {services, shares, reviews} from "../../shared/data/data-for-main-page";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  shares: typeof shares;
  services: typeof services;
  reviews: typeof reviews;
  bestArticles: ArticleType[] = [];
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: false
  };
  customOptionsRev: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    margin: 26,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 2
      },
      940: {
        items: 3
      }
    },
    nav: false
  };
  private subscription: Subscription = new Subscription();

  constructor(private articleService: ArticleService, public dialog: MatDialog) {
    this.shares = shares;
    this.services = services;
    this.reviews = reviews;
  }

  ngOnInit(): void {
    this.subscription.add(this.articleService.getBestArticles()
      .subscribe((data: ArticleType[]) => {
        this.bestArticles = data;
      }))
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

  openDialog(category?: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {numberWindow: NumberWindow.first, typeDialog: TypeDialog.service, category}
    });
    this.subscription.add(dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        this.dialog.open(DialogComponent, {
          data: {numberWindow: NumberWindow.second}
        });
      }
    }));
  }

}
