import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable()
export class TimerService {
    
    private countdownTimerRef:any = null;
    public paused: boolean = true;
    private init:number = 0;
    //subject sirve como observable o observer
    //para obtener la parte observable del subject
    private countdownEndSource = new Subject<void>();
    //con behaviorSubject obtienes siempre el ulitmo valor
    //por eso hay que inicializarlo a 0
    private countdownSource = new BehaviorSubject<number>(0);
    public countdownEnd$ = this.countdownEndSource.asObservable();
    public countdown$ = this.countdownSource.asObservable();

    constructor(){}
    
    destroy(): void {
        this.clearTimeout();
    }

    restartCountdown(init?){
        if(init) this.init = init;
    
        if(this.init && this.init > 0){
            this.paused = true;
            this.clearTimeout();
            this.countdownSource.next(this.init);
        }
    }

    toogleCountdown() {
        this.paused = !this.paused;
    
        if(!this.paused) {
            this.doCountdown();
        } else {
            this.clearTimeout();
        }
    }

      
  private doCountdown(){
    this.countdownTimerRef = setTimeout(()=>{
      this.countdownSource.next(this.countdownSource.getValue() - 1);
      this.processCountdown();
    }, 1000);
  }

  private processCountdown(){
    if(this.countdownSource.getValue() <= 0){
      //lanza el evento con subject como observer
      this.countdownEndSource.next();
    }
    else{
      this.doCountdown();
    }
  }

  private clearTimeout(){
    if(this.countdownTimerRef){
      clearTimeout(this.countdownTimerRef);
      this.countdownTimerRef = null;
    }
  }

}