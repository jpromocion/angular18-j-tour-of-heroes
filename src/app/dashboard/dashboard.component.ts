import { Component, OnInit, inject } from '@angular/core';
import {NgFor} from '@angular/common';
import { RouterModule } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { HeroSearchComponent } from '../hero-search/hero-search.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgFor, RouterModule, HeroSearchComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  heroes: Hero[] = [];

  private heroService: HeroService = inject(HeroService);

  constructor() { }

  ngOnInit(): void {
    this.getHeroes();
  }

  getHeroes(): void {
    //los heroes los retorna pero solo los 2,3,4,5 (slice)
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes.slice(1, 5));
  }
}



