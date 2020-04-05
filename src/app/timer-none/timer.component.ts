import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ChangeDetectorRef, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { TimerService } from './timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-timer-none',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  providers: [TimerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  //al utilizar encapsulacion none los estilos especificados en el css 
  //se pueden aplicar a toda la aplicación
  encapsulation: ViewEncapsulation.None
})
//COMPONENTE DE EJEMPLO
export class TimerNoneComponent implements OnInit, OnDestroy {

  @Output() onComplete = new EventEmitter<void>();
  @Input() init:number = 20;
  private countdownEndSubscription: Subscription = null;
  private countdownSubscription: Subscription = null;
  public countdown: number = 0;

  get progress(): number {
    return (this.init - this.countdown) / this.init * 100;
  }

  constructor(public timer: TimerService, private coRef: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.timer.restartCountdown(this.init);

    this.countdownEndSubscription = this.timer.countdownEnd$.subscribe(() => {
      this.onComplete.emit();
    });

    this.countdownSubscription = this.timer.countdown$.subscribe(data => {
      this.countdown = data;
      //con conRef optimizamos nuestra aplicaciones porque podemos cambiar
      //ChangeDetectionStrategy.ondefault a onpush y asi podemos indicar cuando queremos que se 
      //comprueba el valor get progress() y asi no se ejecuta varias veces (solo la que necesita)
      this.coRef.markForCheck();
    });
  }

  ngOnDestroy() {
    this.timer.destroy();
    this.countdownEndSubscription.unsubscribe();
    this.countdownSubscription.unsubscribe();
  }


}
