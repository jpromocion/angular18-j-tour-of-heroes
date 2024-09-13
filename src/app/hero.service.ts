/**
 * La clase que actuara coimo servicio para proporcionar los heroes
 * teniendo separado la logica de negocio de la vista.
 * El servicio se utilizara como inyeccion de dependencias en los componentes
 */
import { Injectable, inject } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable, of, delay } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

//El decorador @Injectable hace que el servicio sea inyectable a un componente.
//Cuando el proveedor se rellena con root level, Angular crea una sola y compartida instancia del
//HeroService y la inyecta en la clase que pregunte por ella.
@Injectable({
  providedIn: 'root'
})
export class HeroService {

  //inyeccion de dependencias para que a su vez pueda hacer uso del servicio de mensajes
  messageService: MessageService = inject(MessageService);

  //inyectamos el servicio para realizar una HTTP simulada de la herramienta angular-in-memory-web-api
  http: HttpClient = inject(HttpClient);
  //la API base que crea angular-in-memory-web-api
  private heroesUrl = 'api/heroes';


  constructor() { }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
  * Handle Http operation that failed.
  * Let the app continue.
  *
  * @param operation - name of the operation that failed
  * @param result - optional value to return as the observable result
  */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  //listado de heroes.. que los saca del archivo mock-heroes.ts a piñon, pero aqui vendria la comunicacion con
  //la obtenicion real: API rest, base de datos, etc
  //DEPRECATED: DEVOLUCION DIRECTA PARA SINCRONIA
  //getHeroes(): Hero[] {
  //  return HEROES;
  //}
  //DEVOLUCION ASINCRONA: Observable de la libreria RxJS, simula la obtenicion de datos de una API rest
  //DEPRECATED: por una peticion contra una API rest simulada de angular-in-memory-web-api
  /*
  getHeroes(): Observable<Hero[]> {
    const heroes = of(HEROES);
    //usamos el servicio de mensajes para informar de la obtencion
    this.messageService.add('HeroService: heroes recuperados!!!');
    return heroes;
    //metamos un timeout de 30 segundos para probar obtener datos asincronos
    //return of(HEROES).pipe(delay(30000));
  }
  */
  //La peticion asincrona pero sobre la API rest de angular-in-memory-web-api
  //pipi.catchError -> nos permite capturar cualquier error y tratarlo
  //pipe.tap ->  nos permite realizar acciones secundarias en la respuesta, en este caso escribie en log
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log('heroe recuperado')),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }



  //obtener un heroe por su id. Asincrono
  //DEPRECATED: por una peticion contra una API rest simulada de angular-in-memory-web-api
  /*
  getHero(id: number): Observable<Hero> {
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
    const hero = HEROES.find(h => h.id === id)!;
    this.messageService.add(`HeroService: recuperado heroe id=${id}`);
    return of(hero);
  }
  */
  //La peticion asincrona pero sobre la API rest de angular-in-memory-web-api
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
      tap(_ => this.log(`heroe recuperado id=${id}`)),
      catchError(this.handleError<Hero>(`getHero id=${id}`))
    );
  }

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  /** PUT: update the hero on the server */
  //hace una operacion de save sobre el objeto en la API rest angular-in-memory-web-api
  //haciento una operacion PUT en vez de GET y como parametro el heroe en si
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
      tap(_ => this.log(`heroe actualizado id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }


  /** POST: add a new hero to the server */
  //mismo caso de antes, pero para  hacer un POST que este servidor entiende que es para insertar
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`heroe nuevo w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  /** DELETE: delete the hero from the server */
  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;

    return this.http.delete<Hero>(url, this.httpOptions).pipe(
      tap(_ => this.log(`deleted hero id=${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }

  /* GET heroes whose name contains search term */
  //busca heroes por nombre, en la API rest simulada de angular-in-memory-web-api
  //en este caso, la api rest permite filtrar por el nombre, de esta forma, la api ya nos devuelve
  //los resultados filtrados, y se evita obtener todos siempre y filtrarlos tu aqui en codigo
  //que siempre seria mas costoso.
  searchHeroes(term: string): Observable<Hero[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(x => x.length ?
        this.log(`found heroes matching "${term}"`) :
        this.log(`no heroes matching "${term}"`)),
      catchError(this.handleError<Hero[]>('searchHeroes', []))
    );
  }


}
