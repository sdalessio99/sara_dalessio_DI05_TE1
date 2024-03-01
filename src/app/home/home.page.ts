import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { GestionApiService } from 'src/app/services/gestion-api.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

// Array para la cabecera de las noticias
categorias: string[] = [
  "business",
  "entertainment",
  "general",
  "technology",
  "health",
  "science",
  "sports"
];

//atributos que se van a pasar como parametros al componente bar-chart
backgroundColorCat: string[] = [
  'rgba(255, 99, 132, 0.2)',
  'rgba(255, 159, 64, 0.2)',
  'rgba(255, 205, 86, 0.2)',
  'rgba(75, 192, 192, 0.2)',
  'rgba(54, 162, 235, 0.2)',
  'rgba(153, 102, 255, 0.2)',
  'rgba(201, 203, 207, 0.2)'];

borderColorCat: string[] =[
  'rgb(255, 99, 132)',
  'rgb(255, 159, 64)',
  'rgb(255, 205, 86)',
  'rgb(75, 192, 192)',
  'rgb(54, 162, 235)',
  'rgb(153, 102, 255)',
  'rgb(201, 203, 207)'];

// Atributos para generar la consulta REST, se usan desde enviroments
apiKey: string = environment.apiKey;
apiUrl: string = environment.apiUrl;

tipoDeChartSeleccionado: string = "bar-chart";

constructor(private router: Router, public gestionServiceApi: GestionApiService) {}

ngOnInit() {
  this.categorias.forEach(categoria => {
    this.gestionServiceApi.cargarCategoria(categoria);
  });
}

//Metodo para los cambios de segmento
segmentChanged(event: any) {
  this.router.navigate(['/home', event.detail.value]);
  //Recogemos el tipo de chart (bar-chart, line-chart o pie-chart) desde el evento del componente
  this.tipoDeChartSeleccionado = event.detail.value;
  //Si es un bar-chart se hace una llamada api por cada categoria
  if (this.tipoDeChartSeleccionado == "bar-chart"){
    this.categorias.forEach(categoria => {
      this.gestionServiceApi.cargarCategoria(categoria);
    });
  }
}
}
