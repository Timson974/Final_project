import {Component, OnDestroy} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {DialogComponent} from "../../components/dialog/dialog.component";
import {NumberWindow, TypeDialog} from "../../../../types/dialog-data.type";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnDestroy {
  private subscription: Subscription | null = null;
  constructor(public dialog: MatDialog) {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {numberWindow: NumberWindow.first, typeDialog: TypeDialog.consultation}
    });
    this.subscription = dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed', result);
      if (result) {
        this.dialog.open(DialogComponent, {
          data: {numberWindow: NumberWindow.second}
        });
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

}
