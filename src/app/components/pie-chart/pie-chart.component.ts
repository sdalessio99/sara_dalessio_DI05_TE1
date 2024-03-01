import { Component, OnInit, Renderer2, ElementRef  } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent implements OnInit {

  //se declara el atributo chart
  public chart!: Chart;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    console.log("Ejecuta line-chart");
    this.inicializarChart();
  }

  private inicializarChart(){

    const data = {
      labels: [
        'Red',
        'Green',
        'Yellow',
        'Grey',
        'Blue'
      ],
      datasets: [{
        label: 'My First Dataset',
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)',
          'rgb(255, 205, 86)',
          'rgb(201, 203, 207)',
          'rgb(54, 162, 235)'
        ]
      }]
    };

    //se crea el canvas
    const canvas = this.renderer.createElement('canvas');
    this.renderer.setAttribute(canvas, 'id', 'lineChart');
    const container = this.el.nativeElement.querySelector('#contenedor-piechart');
    this.renderer.appendChild(container, canvas);

    //se crea la grafica
    this.chart = new Chart(canvas, {
      type: 'pie' as ChartType,
      data: data,
    });
  }
}
