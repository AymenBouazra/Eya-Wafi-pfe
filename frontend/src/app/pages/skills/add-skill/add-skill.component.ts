import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SkillService } from '../../services/skill.service';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-skill',
  templateUrl: './add-skill.component.html',
  styleUrls: ['./add-skill.component.scss']
})
export class AddSkillComponent implements OnInit {
  skillForm: FormGroup;
  isSubmitted = false;
  isLoading = false;
  constructor(private skillService: SkillService, private toast: HotToastService, private route: Router) { }

  ngOnInit(): void {
    this.skillForm = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(300)]),
    });
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.skillForm.invalid) {
      return;
    }
    this.skillService.addSkill(this.skillForm.value).subscribe(
      {
        next: (data) => {
          this.isLoading = false;
          this.isSubmitted = false;
          this.toast.success(data.message, {
            duration: 3000,
            position: 'top-right'
          });
          this.skillForm.reset();
          this.route.navigate(['/skills']);
        },
        error: (error) => {
          this.isLoading = false;
          this.isSubmitted = false;
          console.error('Error adding skill:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      }
    )
  }

}
