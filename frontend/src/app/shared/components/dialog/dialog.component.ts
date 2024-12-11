import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogDataType, NumberWindow, TypeDialog} from "../../../../types/dialog-data.type";
import {RequestService} from "../../services/request.service";
import {NgForm} from "@angular/forms";
import {TypeRequest} from "../../../../types/dialog-request.type";
import {SnackBarService} from "../../services/snack-bar.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {CategoryService} from "../../services/category.service";
import {CategoriesType} from "../../../../types/categories.type";
import {CategoriesValueUtil} from "../../utils/categories-value.util";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',

})
export class DialogComponent implements OnInit, OnDestroy {
  numberWindow = NumberWindow;
  typeDialog = TypeDialog;
  typeRequest = TypeRequest;
  requestForm = {
    name: '',
    phone: '',
    category: 'undefined'
  }
  private subscription: Subscription = new Subscription();

  categories: CategoriesType[]  = [];
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataType,
    private requestService: RequestService,
    private snackBar: SnackBarService,
    private categoryService: CategoryService

  ) {

    this.requestForm.category =  this.data.category ? CategoriesValueUtil.getCategoriesValue(this.data.category) : 'undefined';

  }

  ngOnInit() {
    if (this.data.numberWindow === NumberWindow.first) {
      this.subscription.add( this.categoryService.getCategories().subscribe( data => {
        this.categories = data
      }));
    }
  }

  parsCategoryValue(url: string): string {
      return this.categories.find( item => item.url === url) ? this.categories.find( item => item.url === url)!.name : ''
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
  onClick(reForm: NgForm, type: TypeRequest) {
    if (reForm.valid) {
      const service = this.requestForm.category === 'undefined' || '' ? '' :  this.parsCategoryValue(this.requestForm.category);
      this.subscription.add(this.requestService.request(this.requestForm.name, this.requestForm.phone,  type, service )
        .subscribe( {
          next: (response: DefaultResponseType) => {
            if (response.error) {
              this.snackBar.openSnackBar(response.message)
            }
            if (!response.error) {
              this.dialogRef.close('second');
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this.snackBar.openSnackBar(errorResponse.error.message);
            } else {
              this.snackBar.openSnackBar('Ошибка заказа');
            }
            //this.dialogRef.close();
          }
        }));
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }
}
