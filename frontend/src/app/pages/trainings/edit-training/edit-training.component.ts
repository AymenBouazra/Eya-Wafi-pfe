import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TrainingService } from '../../services/training.service';
import { SkillService } from '../../services/skill.service';
import { JobService } from '../../services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-edit-training',
  templateUrl: './edit-training.component.html',
  styleUrls: ['./edit-training.component.scss']
})
export class EditTrainingComponent implements OnInit {
  trainingForm: FormGroup;
  isLoading = false;
  idTraining: string;
  skillsList: any[] = [];
  jobsList: any[] = [];

  constructor(
    private toast: HotToastService,
    private trainingService: TrainingService,
    private skillService: SkillService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.idTraining = this.route.snapshot.params['id'];

    // Initialize form
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

    // Load skills and jobs for select options
    this.loadSkills();
    this.loadJobs();

    // Load training data
    this.isLoading = true;
    this.trainingService.getTraining(this.idTraining).subscribe({
      next: (data) => {
        this.trainingForm.patchValue(data);
      },
      error: (error) => {
        console.error('Error loading training:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  loadSkills(): void {
    this.skillService.getSkills().subscribe({
      next: (skills: any) => {
        this.skillsList = skills;
      },
      error: (err) => console.error('Failed to load skills', err)
    });
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (jobs: any) => {
        this.jobsList = jobs;
      },
      error: (err) => console.error('Failed to load jobs', err)
    });
  }

  compareSkills(s1: any, s2: any): boolean {
    return s1?._id === s2?._id;
  }

  compareJobs(j1: any, j2: any): boolean {
    return j1?._id === j2?._id;
  }

  onSubmit(): void {
    if (this.trainingForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.trainingService.updateTraining(this.idTraining, this.trainingForm.value).subscribe({
      next: () => {
        this.toast.success('Formation mise à jour avec succès !');
        this.router.navigate(['/trainings']);
      },
      error: (error) => {
        console.error('Error updating training:', error);
        this.toast.error('Erreur lors de la mise à jour de la formation. Veuillez réessayer plus tard.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  get f() {
    return this.trainingForm.controls;
  }

}
