import { Component, OnInit, ContentChild, AfterContentInit, OnDestroy, ContentChildren, QueryList } from '@angular/core';
import { TabComponent } from '../tab/tab.component';
import { Tab } from "../tab/tab.interface";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit, AfterContentInit, OnDestroy {

  //con contentChild y contentChildren accedemos a los datos del ng-content
  //contentChild solo hace referencia al primer hijo, contentChildren a todos
  //@ContentChild(TabComponent, {static: true}) tab: TabComponent;
  
  //contentchilden hace referencia a todos los hijos y se trata como un array
  //Y queremos obtener los TabComponent dentro del ng-content
  @ContentChildren(TabComponent) public tabs: QueryList<TabComponent>;

  private tabClickSubscription: Subscription[] = [];

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.tabClickSubscription){
      this.tabClickSubscription.forEach(sub => {
        sub.unsubscribe();
      });
    }
  }

  //contentChildren accesible a partir de este ciclo de vida
  ngAfterContentInit() {
    this.tabs.forEach(tab => {
      //cuando hace click sobre el contenido del tab
      const subscription = tab.onClick.subscribe(() => {
        console.log("tabb");
      });

      this.tabClickSubscription.push(subscription);
    });

    //accede al primer tab con first
    this.selectTab(this.tabs.first);
  }

  selectTab(tab:Tab) {
    this.tabs.forEach(tab => tab.isActive = false);
    tab.isActive = true;
  }
  

}
