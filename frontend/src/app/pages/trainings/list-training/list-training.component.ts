import { Component, OnInit } from '@angular/core';
import { TrainingService } from '../../services/training.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-list-training',
  templateUrl: './list-training.component.html',
  styleUrls: ['./list-training.component.scss']
})
export class ListTrainingComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 5;
  pageSize = 5;
  totalItems = 0;
  trainings: any[] = [];
  isLoading: boolean = false;

  constructor(private trainingService: TrainingService, private toast: HotToastService) { }

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings() {
    this.isLoading = true;
    this.trainingService.getTrainingsPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (res) => {
        this.trainings = res.data;
        this.totalItems = res.pagination.total;
      },
      error: (error) => {
        console.error('Error loading trainings', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTrainings();
  }

  deleteTraining(trainingId: string) {
    this.trainingService.deleteTraining(trainingId).subscribe({
      next: (res) => {
        this.toast.success(res.message);
        this.loadTrainings();
      },
      error: (error) => {
        console.error('Error deleting training', error);
      },
      complete: () => {
        this.loadTrainings();
      }
    });
  }
}
