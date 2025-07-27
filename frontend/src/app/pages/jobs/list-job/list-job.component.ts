import { Component, OnInit } from '@angular/core';
import { JobService } from '../../services/job.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-list-job',
  templateUrl: './list-job.component.html',
  styleUrls: ['./list-job.component.scss']
})
export class ListJobComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 5;
  pageSize = 5;
  totalItems = 0;
  jobs: any[] = [];
  isLoading: boolean = false;

  constructor(private jobService: JobService, private toast: HotToastService) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs() {
    this.isLoading = true;
    this.jobService.getJobsPaginated(this.currentPage, this.itemsPerPage).subscribe({
      next: (res) => {
        this.jobs = res.data;
        this.totalItems = res.pagination.total;
      },
      error: (error) => {
        console.error('Error loading jobs', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadJobs();
  }

  deleteJob(jobId: string) {
    this.jobService.deleteJob(jobId).subscribe({
      next: (res) => {
        this.toast.success(res.message);
        this.loadJobs();
      },
      error: (error) => {
        console.error('Error deleting job', error);
      },
      complete: () => {
        this.loadJobs();
      }
    });
  }

}
