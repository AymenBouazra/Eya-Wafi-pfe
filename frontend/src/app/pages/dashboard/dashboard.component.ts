import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import { DashboardService } from '../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  stats: any = {};
  isLoading = false;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    this.fetchStats();
  }

  fetchStats() {
    this.isLoading = true;
    this.dashboardService.getDashboardstats().subscribe({
      next: (res: any) => {
        this.stats = res;
        this.isLoading = false;
        setTimeout(() => this.renderCharts(), 0); // Wait for DOM
      },
      error: () => { this.isLoading = false; }
    });
  }

  renderCharts() {
    // Jobs Doughnut
    const jobsCtx = document.getElementById('jobs-doughnut') as HTMLCanvasElement;
    if (jobsCtx) {
      new Chart(jobsCtx, {
        type: 'doughnut',
        data: {
          labels: ['Disponibles ' + (this.stats.jobsAvailable || 0), 'Indisponibles ' + (this.stats.jobsUnavailable || 0)],
          datasets: [{
            data: [
              this.stats.jobsAvailable || 0,
              this.stats.jobsUnavailable || 0
            ],
            backgroundColor: ['#2dce89', '#f5365c']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: true }
        }
      });
    }

    // Mobility Pie
    const mobilityCtx = document.getElementById('mobility-pie') as HTMLCanvasElement;
    if (mobilityCtx) {
      new Chart(mobilityCtx, {
        type: 'pie',
        data: {
          labels: ['Acceptées ' + (this.stats.mobilityRequestsAccepted || 0), 'Rejetées ' + (this.stats.mobilityRequestsRejected || 0), 'En attente ' + (this.stats.mobilityRequestsPending || 0)],
          datasets: [{
            data: [
              this.stats.mobilityRequestsAccepted || 0,
              this.stats.mobilityRequestsRejected || 0,
              this.stats.mobilityRequestsPending || 0
            ],
            backgroundColor: ['#5e72e4', '#f5365c', '#ffbb33']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: { display: true }
        }
      });
    }
  }
}
