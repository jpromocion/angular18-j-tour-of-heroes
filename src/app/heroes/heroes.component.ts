import { Component, inject, OnInit } from '@angular/core';
import { Hero } from '../hero';
import {UpperCasePipe, NgFor, NgIf} from '@angular/common';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule} from '@angular/forms';
import { HeroDetailComponent } from '../hero-detail/hero-detail.component';
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-heroes',
  standalone: true,
  imports: [UpperCasePipe, ReactiveFormsModule, NgFor, NgIf, FormsModule, HeroDetailComponent, RouterModule],
  templateUrl: './heroes.component.html',
  styleUrl: './heroes.component.css'
})
export class HeroesComponent implements OnInit {
  /*
  //ahora el heroe lo hemos creado como una interfaz
  //hero = 'Windstorm';
  hero: Hero = {
    id: 1,
    name: 'Windstorm'
  };

  //Formulario para modificar ddatos
  heroForm = new FormGroup({
    name: new FormControl('')
  });
  */

  //listado de heroes
  //heroes = HEROES;  //ahora se obtienen del servicio
  heroes: Hero[] = []; //ahora de inicio vacio, sera el sistem de inyeccion de dependencias el que lo rellene en el contructor

  //DEPRECATED: al meter el enrutador, ya no se usa este metodo pues se accede al detalle por la URL "detail/:id"
  //selectedHero?: Hero;


  //FORMA ALTERNATIVA INYECCIONN DEPENDENCIAS DEL TUTORIAL DE 18
  // En vez de declarar en el constructor el servicio, se declara como una propiedad de la clase
  // y se le asigna el valor que se obtiene del inyector de dependencias con "inject"
  private heroService: HeroService = inject(HeroService);

  //inyeccion de dependencias para que a su vez pueda hacer uso del servicio de mensajes
  private messageService: MessageService = inject(MessageService);


  //inyectamos el servicio de obtener heroesen el constructor
  //Cuando Angular cree HeroesComponent, el sistema de inyeccion de dependencias rellenara el parametro
  //heroService con una instancia singleton del HeroService.
  //constructor(private heroService: HeroService) {
  //NOTA: version alternativa de inyeccion de dependencias, donde se declara como propiedad haciendo uso de "inject"
  //Tutorial angular 18
  constructor() {
    //podria llamarse aca al metodo getHeroes, pero no es buena practica, se hace en el ngOnInit.
    //es buena practica que el contructor haga nada o lo menos posible. Mucho menos estar llamando a una API http remota.
    //Component Lifecycle https://v17.angular.io/guide/lifecycle-hooks:
    // Una instancia de componente tiene un ciclo de vida que comienza cuando Angular crea una instancia de la
    // clase de componente y renderiza la vista del componente junto con sus vistas secundarias.
    // El ciclo de vida continúa con la detección de cambios, ya que Angular verifica cuándo cambian las
    // propiedades vinculadas a los datos y actualiza tanto la vista como la instancia del componente según sea necesario.
    // El ciclo de vida finaliza cuando Angular destruye la instancia del componente y elimina su p
    // lantilla renderizada del DOM. Las directivas tienen un ciclo de vida similar, ya que Angular crea,
    // actualiza y destruye instancias en el transcurso de la ejecución.
    //Angular tiene diversos eventos que responden al ciclod e vica. Entre ellos ngOnInit:
    //  Inicialice la directiva o el componente después de que Angular muestre por primera vez las propiedades
    //  vinculadas a los datos y establezca las propiedades de entrada de la directiva o el componente.
  }


  //Utilizamos para inicializar mejor que el constructor
  //la clase debe implementar OnInit
  ngOnInit(): void {
    //aqui si invocamos el metodo que obtiene los heroes del servicio.
    this.getHeroes();
  }

  //al seleccionar de la lista, el hero lo asignamos a la propiedad selectedHero
  //DEPRECATED: al meter el enrutador, ya no se usa este metodo pues se accede al detalle por la URL "detail/:id"
  //onSelect(hero: Hero): void {
  //  this.selectedHero = hero;
  //  this.messageService.add(`HeroesComponent: Seleccionado heroe id=${hero.id}`);
  //}


  //el metodo que obtiene los heroes, aqui invocaremos al servicio
  //FUNCIONA PERO: es una llamada SINCRONA... en el munod real, si etamos trayendo los datos de una API rest...
  //la llamada deberia ser asincrona, para no bloquear la UI por no tener datos
  //getHeroes(): void {
  //  this.heroes = this.heroService.getHeroes();
  //}
  //VERSION ASINCRONA
  getHeroes(): void {
    //al utilizar el metodo getHeroes del servicio, este nos devuelve un Observable<Hero[]>.
    //la Observable.subscribe(), permite que el array sea actualizado con los datos cuantos estos lleguen
    //(aunque esto suce en un futuro, no ahora y tarde imaginemos que unos minutos), y sin embargo la UI no se bloquea
    //y tienes control en ella... aunque los datos no esten aun.
    this.heroService.getHeroes()
        .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.addHero({ name } as Hero)
      .subscribe(hero => {
        this.heroes.push(hero);
      });
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }

}
