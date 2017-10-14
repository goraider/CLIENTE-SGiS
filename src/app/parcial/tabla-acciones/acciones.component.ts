import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tabla-acciones',
  templateUrl: './acciones.component.html'
})

export class TablaAccionesComponent implements OnInit {
  @Input() item: any;
  @Input() index: number;
  @Input() ctrl: any;
  private url_editar: string = '';
  private url_imprimir: string = '';
  private permisos;
  private carpeta;
  private modulo;
  private controlador;

  ngOnInit() {
    var url = location.href.split("/");
    this.carpeta = url[3];
    this.modulo = url[4];

    var ctrl = "-" + this.modulo;
    this.controlador = ctrl.toLowerCase()
        // remplazar _ o - por espacios
        .replace(/[-_]+/g, ' ')
        // quitar numeros
        .replace(/[^\w\s]/g, '')
        // cambiar a mayusculas el primer caracter despues de un espacio
        .replace(/ (.)/g, function($1) {
            return $1.toUpperCase(); })
        // quitar espacios y agregar controller
        .replace(/ /g, '') + "Controller";

    this.permisos = JSON.parse(localStorage.getItem("permisos"));
    this.url_editar = '/' + this.carpeta + '/' + this.modulo + '/editar/' + this.item.id;
    this.url_imprimir = '/' + this.carpeta + '/' + this.modulo + '/ver/' + this.item.id;
  }
}