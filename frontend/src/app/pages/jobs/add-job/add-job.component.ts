import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { JobService } from '../../services/job.service';
import { SkillService } from '../../services/skill.service';

@Component({
  selector: 'app-add-job',
  templateUrl: './add-job.component.html',
  styleUrls: ['./add-job.component.scss']
})
export class AddJobComponent implements OnInit {
  jobForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  skillsList: any[] = [];
  departements: any[] = [
    { value: 'Client Success', label: 'Client Success' },
    { value: 'Support', label: 'Support' },
    { value: 'Recherche et développement', label: 'Recherche et développement' },
    { value: 'Nouvelle technologie & BI', label: 'Nouvelle technologie & BI' },
  ];
  constructor(private jobService: JobService, private skillService: SkillService, private toast: HotToastService, private route: Router) { }

  ngOnInit(): void {
    this.jobForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      departement: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      requirements: new FormControl('', [Validators.required]),
      requiredSkills: new FormControl('', [Validators.required]),
      isActive: new FormControl(true)
    });
    this.getSkills()
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

  onSubmit() {
    this.isSubmitted = true;
    if (this.jobForm.invalid) {
      return;
    }
    this.jobService.addJob(this.jobForm.value).subscribe(
      {
        next: (data) => {
          this.isLoading = false;
          this.isSubmitted = false;
          this.toast.success(data.message, {
            duration: 3000,
            position: 'top-right'
          });
          this.jobForm.reset();
          this.route.navigate(['/jobs']);
        },
        error: (error) => {
          this.isLoading = false;
          this.isSubmitted = false;
          console.error('Error adding job:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      }
    )
  }

}
