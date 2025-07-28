import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { TrainingService } from '../../services/training.service';
import { SkillService } from '../../services/skill.service';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-add-training',
  templateUrl: './add-training.component.html',
  styleUrls: ['./add-training.component.scss']
})
export class AddTrainingComponent implements OnInit {
  trainingForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  skillsList: any[] = [];
  jobsList: any[] = [];

  constructor(
    private trainingService: TrainingService,
    private skillService: SkillService,
    private jobService: JobService,
    private toast: HotToastService,
    private route: Router
  ) { }

  ngOnInit(): void {
    this.trainingForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      duration: new FormControl('', [Validators.required]),
      provider: new FormControl(''),
      targetSkills: new FormControl([]),
      recommendedFor: new FormControl([]),
      isActive: new FormControl(true)
    });
    this.getSkills();
    this.getJobs();
  }

  getSkills() {
    this.skillService.getSkills().subscribe({
      next: (skills) => {
        this.skillsList = skills;
      },
      error: (error) => {
        console.error('Error loading skills:', error);
      }
    });
  }

  getJobs() {
    this.jobService.getJobs().subscribe({
      next: (jobs) => {
        this.jobsList = jobs;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
      }
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    console.log(this.trainingForm.value);

    if (this.trainingForm.invalid) {
      return;
    }
    this.isLoading = true;
    this.trainingService.addTraining(this.trainingForm.value).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.isSubmitted = false;
        this.toast.success(data.message, {
          duration: 3000,
          position: 'top-right'
        });
        this.trainingForm.reset();
        this.route.navigate(['/trainings']);
      },
      error: (error) => {
        this.isLoading = false;
        this.isSubmitted = false;
        console.error('Error adding training:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
