import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable, from, fromEvent, interval, map, mergeMap, of, retry, take, throwError, timer, toArray } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
  title = 'rxjs-tutorial';
  @ViewChild('btn') btn!: ElementRef;

  ngOnInit() {
    const intObservable = interval(1000);
    const intObservableObs = intObservable.subscribe(data => console.log(data + 1))

    const timerObservable = timer(5000, 1000);
    const timerObservableObs = timerObservable.subscribe(data => console.log(`timer ${data + 1}`));

    setTimeout(() => {
      intObservableObs.unsubscribe();
      timerObservableObs.unsubscribe();
    }, 10000)

    const ofObservable = of(...['d1', 'd2', 'd3', 'd4'], 'str1', 'str2', 'str3', new Promise((resolve: any) => {resolve({data: {name: 'shubham', age: 30, profile: {linkedin: 'shubham644', github: 'shubham16394'}}})} ), 20, 35, 69);
    ofObservable.subscribe(async data => console.log(await data));

    const fromObservable = from(['d1', 'd2', 'd3', 'd4', 'str1', 'str2', 'str3', new Promise((resolve: any) => {resolve(100)} )]);
    fromObservable.subscribe(async data => console.log(await data + ' from'));

    ofObservable.pipe(
      toArray()
    ).subscribe(async data => console.log( await data ));

    const custObservable = new Observable(obs => {
      obs.next('next data');
      obs.error('err data');
      obs.complete();
    })

    custObservable.subscribe({
      next: data => console.log(data),
      error: data => console.log(data),
      complete: () => console.log('complete called')
    })

    ofObservable.pipe(
      take(5),
      map(data => {return typeof data === 'object' ? data : null})
    ).subscribe(
      async data => {
        const result = await data;
        console.log(result)
      }
    )

    intObservable.pipe(
      mergeMap(val => val < 5 ? throwError(() => 'Error!') : of(val)),
      retry(3)
    ).subscribe({
      next: (data) => { console.log(data) },
      error: (err) => { console.log(err) }
    })
  }



  ngAfterViewInit(): void {
    fromEvent(this.btn.nativeElement, 'click').subscribe(
      res => {
        console.log(res);
      }
    );
  }



}
