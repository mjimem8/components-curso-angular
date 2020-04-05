import { Component, ViewChild, ElementRef,
        AfterViewInit, AfterContentInit, ViewChildren, QueryList, ChangeDetectorRef, Renderer2, ViewContainerRef, ComponentFactoryResolver, ComponentRef } from '@angular/core';
import { SimpleAlertViewComponent } from './simple-alert-view/simple-alert-view.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterContentInit, AfterViewInit {
  public isAddTimerVisible: boolean = false;
  public time: number = 0;
  public timers: Array<number> = [];
  public simpleAlert: ComponentRef<SimpleAlertViewComponent> = null;

  //con @viewChild o children podemos hacer referencia al elemento del DOM (: ElementRef), al container de 
  //ese elemento (: ViewContainerRef), o un componente creado con anterioridad en el DOM (: SimpleAlertViewComponent)

  //de igual manera que contentchilden podemos acceder a varios hijos
  //@ViewChild(SimpleAlertViewComponent, {static: true}) alert: SimpleAlertViewComponent;
  //@ViewChildren(SimpleAlertViewComponent) alerts: QueryList<SimpleAlertViewComponent>;

  @ViewChild("timerInput", {static: true}) timeInput: ElementRef;

  //viewContainerRef nos permite crear componentes de forma dinamica a partir de su container
  //haciendo referencia a un elemento del DOM
  @ViewChild("alert", {static: true, read: ViewContainerRef}) alertContainer: ViewContainerRef;

  //ComponentFactoryResolver nos permite crear componentes dinamicamente
  constructor(private renderer: Renderer2, private resolver: ComponentFactoryResolver) {
    this.timers = [3, 20, 105]
  }

  ngAfterViewInit() {
    //con renderer nos aseguramos que esten disponibles los cambio en 
    //en DOM en todas las plataformas
    this.renderer.setAttribute(this.timeInput.nativeElement,
      "placeholder", "enter seconds");
    this.renderer.addClass(this.timeInput.nativeElement, "time-in");
    
  }

  //viewChild accesible a partir de este ciclo de vida
  ngAfterContentInit() {

    //modificamos @input desde el controlador
    // this.alert.show();
    // this.alert.title = "Hi";
    // this.alert.message = "Hello world";

  }

  public showAddTimer() {
    this.isAddTimerVisible = true;
    setTimeout(() => this.renderer.selectRootElement(this.timeInput.nativeElement).focus());
  }

  public hideAddTimer() {
    this.isAddTimerVisible = false;
  }

  //creamos el componente anteriormente y lo mostramos cuando
  //termine el proceso de la cuenta del tiempo del cronometro
  public showEndTimerAlert() {

    //crear factoria con el componente
    const alertFactory = this.resolver.resolveComponentFactory(SimpleAlertViewComponent);
    //guardamos el componente en una propiedad de la clase para utlizarla posteriormente
    this.simpleAlert = this.alertContainer.createComponent(alertFactory);
    
    //estamos definiendo los @input
    this.simpleAlert.instance.title = "timer ended";
    this.simpleAlert.instance.message = "yout countdown has finished";

    //los @output son observables
    //destruimos el componente
    this.simpleAlert.instance.onDismiss.subscribe(() => this.simpleAlert.destroy());
    
    //utilizamos la funcion del componente show para mostrarlo
    //this.alerts.first.show();
    this.simpleAlert.instance.show();
  }

  public submitAddTimer() {
    this.timers.push(this.time);
    this.hideAddTimer();
  }
}
