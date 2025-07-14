import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SkillService } from '../../services/skill.service';
import { ActivatedRoute } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-update-skill',
  templateUrl: './update-skill.component.html',
  styleUrls: ['./update-skill.component.scss']
})
export class UpdateSkillComponent implements OnInit {
  skillForm: FormGroup;
  isLoading = false;
  idSkill: string;
  constructor(private toast: HotToastService, private skillService: SkillService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.idSkill = this.route.snapshot.params['id'];
    this.skillService.getSkill(this.idSkill).subscribe({
      next: (data) => {
        this.skillForm.patchValue(data);
      },
      error: (error) => {
        console.error('Error loading skill:', error);
      },
      complete: () => {
        this.isLoading = false;
      }
    })
    this.skillForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
    });
  }
  get f() {
    return this.skillForm.controls;
  }

  onSubmit() {
    this.isLoading = true;
    if (this.skillForm.invalid) {
      this.isLoading = false;
      return;
    }
    this.skillService.updateSkill(this.idSkill, this.skillForm.value).subscribe(
      {
        next: (data) => {
          this.isLoading = false;
          this.skillForm.reset();
          this.toast.success(data.message, {
            duration: 3000,
            position: 'top-right'
          });
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating skill:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      }
    )
  }

}
