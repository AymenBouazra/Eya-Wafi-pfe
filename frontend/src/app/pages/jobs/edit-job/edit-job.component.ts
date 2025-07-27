import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { JobService } from '../../services/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { SkillService } from '../../services/skill.service';

@Component({
  selector: 'app-edit-job',
  templateUrl: './edit-job.component.html',
  styleUrls: ['./edit-job.component.scss']
})
export class EditJobComponent implements OnInit {
  jobForm: FormGroup;
  isLoading = false;
  idJob: string;
  skills: any[] = [];

  constructor(
    private toast: HotToastService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private skillService: SkillService // Assuming JobService has a method to get skills
  ) { }

  ngOnInit(): void {
    this.idJob = this.route.snapshot.params['id'];

    // Initialize form
    this.jobForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      departement: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      requirements: new FormControl(''),
      requiredSkills: new FormControl([]),
      isActive: new FormControl()
    });

    // Load job data
    this.isLoading = true;
    this.skillService.getSkills().subscribe(allSkills => {
      this.skills = allSkills;
      this.jobService.getJob(this.idJob).subscribe({
        next: (data) => {
          this.jobForm.patchValue(data);
        },
        error: (error) => {
          console.error('Error loading job:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    });

    // Load skills for select options
    this.loadSkills();
  }

  loadSkills(): void {
    this.skillService.getSkills().subscribe({
      next: (skills: any) => {
        this.skills = skills;
      },
      error: (err) => console.error('Failed to load skills', err)
    });
  }

  compareSkills(s1: any, s2: any): boolean {
    return s1?._id === s2?._id;
  }

  onSkillChange(skillId: string, isChecked: boolean): void {
    const requiredSkills = this.jobForm.get('requiredSkills').value as string[];
    if (isChecked) {
      requiredSkills.push(skillId);
    } else {
      const index = requiredSkills.indexOf(skillId);
      if (index !== -1) {
        requiredSkills.splice(index, 1);
      }
    }
    this.jobForm.get('requiredSkills').setValue(requiredSkills);
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      console.log(this.jobForm.errors);

      return;
    }

    this.isLoading = true;
    this.jobService.updateJob(this.idJob, this.jobForm.value).subscribe({
      next: () => {
        this.toast.success('Job updated successfully!');
        this.isLoading = true;
        this.router.navigate(['/jobs']);
      },
      error: (error) => {
        console.error('Error updating job:', error);
        this.isLoading = true;

        this.toast.error('Error updating job. Please try again later.');
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
