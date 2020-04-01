import { Component, Input, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy{

  @Input() init: number = null;
  @Output() onDecrease = new EventEmitter<number>();
  @Output() onComplete = new EventEmitter<void>();

  public counter: number = 0;
  private countdownTimerRef: any = null;

  constructor() { }

  ngOnInit() {
    this.startCountDown();
  }

  ngOnDestroy() {
    this.clearTimeout();
  }

  startCountDown() {
    if(this.init && this.init > 0) {
      this.clearTimeout();
      this.counter = this.init;
      this.doCountdown();
    }
  }

  private clearTimeout() {
    if(this.countdownTimerRef) {
      clearTimeout(this.countdownTimerRef);
      this.countdownTimerRef = null;
    }
  }

  doCountdown() {
    this.countdownTimerRef = setTimeout(() => {
      this.counter --;
      this.progressCount();
    }, 1000);
  }

  progressCount() {
    this.onDecrease.emit(this.counter);

    if(this.counter == 0){
      this.onComplete.emit();
    }else {
      this.doCountdown();
    }
  }

}
