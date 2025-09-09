import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { MobilityRequestService } from '../../services/mobility-request.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-jobs-employee-list',
  templateUrl: './jobs-employee-list.component.html',
  styleUrls: ['./jobs-employee-list.component.scss']
})
export class JobsEmployeeListComponent implements OnInit {
  jobs: any[] = [];
  selectedJob: any = null;
  showModal = false;
  applyForm: FormGroup;
  isSubmitting = false;
  screenWidth = window.innerWidth;
  showDetails = false;
  isLoading = false;
  currentUser: any = null;
  employeeApplicationsList: any[] = [];
  constructor(
    private jobService: JobService,
    private mobilityRequestService: MobilityRequestService,
    private userService: UserService,
    private fb: FormBuilder,
    private toast: HotToastService
  ) { }

  ngOnInit(): void {
    const helper = new JwtHelperService();
    const token = (localStorage.getItem('token') || '');
    const decoded = helper.decodeToken(token);

    this.jobService.getJobs().subscribe(jobs => {
      this.jobs = jobs.filter(j => j.isActive);
      if (this.jobs.length) this.selectJob(this.jobs[0]);
    });
    this.applyForm = this.fb.group({
      employee: [decoded.userId, Validators.required],
      job: ['', Validators.required],
      motivation: ['', Validators.required],
      status: ['pending'],
      currentStep: []
    });
    this.userService.getUserById(decoded.userId).subscribe((user: any) => {
      this.currentUser = user;
      this.employeeApplicationsList = user.applications.map(a => a.job._id)
    });
    window.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth;
    });
  }
  selectJob(job: any) {
    this.selectedJob = job;
    if (this.screenWidth < 992) {
      this.showDetails = true;
    }
  }
  openModal() {
    this.showModal = true;
    this.applyForm.patchValue({ job: this.selectedJob._id });
  }

  closeModal() {
    this.showModal = false;
    this.applyForm.reset({ status: 'pending', currentStep: 'applied' });
  }

  onSubmit() {
    if (this.applyForm.invalid) return;
    this.isSubmitting = true;
    this.mobilityRequestService.createMobilityRequest(this.applyForm.value).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.closeModal();
        this.toast.success(res.message);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.toast.error(error.error.message);
      }
    });
  }
}
