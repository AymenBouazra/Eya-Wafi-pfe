import { Component, OnInit } from '@angular/core';
import { SkillService } from '../../services/skill.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-skills-list',
  templateUrl: './skills-list.component.html',
  styleUrls: ['./skills-list.component.scss']
})
export class SkillsListComponent implements OnInit {
  currentPage = 1;
  itemsPerPage = 5;
  pageSize = 5;
  totalItems = 0;
  skills: any[] = []
  isLoading: boolean = false;
  constructor(private skillService: SkillService, private toast: HotToastService) { }

  ngOnInit(): void {
    this.loadSkills();
  }

  loadSkills() {
    this.isLoading = true;
    this.skillService.getSkillsPaginated(this.currentPage, this.itemsPerPage,).subscribe(
      {
        next: (res) => {
          this.skills = res.data;
          this.totalItems = res.pagination.total;
        },
        error: (error) => {
          console.error('Error loading skills', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      }
    )
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSkills();
  }

  deleteSkill(skillId: string) {
    this.skillService.deleteSkill(skillId).subscribe(
      {
        next: (res) => {
          this.toast.success(res.message);
          this.loadSkills()
        },
        error: (error) => {
          console.error('Error deleting skill', error);
        },
        complete: () => {
          this.loadSkills();
        }
      }
    )
  }
}
