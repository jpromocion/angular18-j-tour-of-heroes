import { Component, inject } from '@angular/core';
import {NgFor, NgIf} from '@angular/common';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent {


  //inyeccion de dependencias para que a su vez pueda hacer uso del servicio de mensajes
  //public: debe ser publica porque la propiedad la vas a bindear en el template directamente,
  // angular solo bindea propiedades publicas!!!!
  public messageService: MessageService = inject(MessageService);

  constructor() {}

}
