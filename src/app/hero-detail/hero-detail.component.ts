import {Component, Input, inject, OnInit} from '@angular/core';
import {UpperCasePipe, NgFor, NgIf, Location} from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Hero } from '../hero';
import {FormsModule} from '@angular/forms';
import { HeroService } from '../hero.service';





@Component({
  selector: 'app-hero-detail',
  standalone: true,
  imports: [UpperCasePipe, NgFor, NgIf, FormsModule],
  templateUrl: './hero-detail.component.html',
  styleUrl: './hero-detail.component.css'
})
export class HeroDetailComponent implements OnInit {
  //el @Input() permite que el componente padre (HeroesComponent) pase el héroe al componente hijo (HeroDetailComponent).
  //DEPRECATED: al meter el enrutador, ya no se usa inserta embebido el componente detalle en el padre
  //sino que se accede al detalle por la URL "detail/:id"
  //@Input() hero?: Hero;
  //en su lugar la definimos vacia y la cargaremos al iniciar obteniendo el heroe del srvicio con el id
  hero: Hero | undefined;


  //INYECCION DE DEPENDENCIAS
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  private location: Location = inject(Location);
  private heroService: HeroService = inject(HeroService);




  ngOnInit(): void {
    this.getHero();
  }

  getHero(): void {
    //utiliza activatedRoute para obtener el parametro de la url
    const id = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }


  goBack(): void {
    //interesante la interfaz location, permite con back volver por la ruta que lo invoco
    //sin necesidad de estar creando un enrutamiento inverso a mano!!! -> mas limpio
    this.location.back();
  }

  //vamos a actualizar el nombre, en la API rest simulada de angular-in-memory-web-api
  save(): void {
    if (this.hero) {
      this.heroService.updateHero(this.hero)
        .subscribe(() => this.goBack());
    }
  }

}
