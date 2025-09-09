import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { MobilityRequestService } from '../services/mobility-request.service';

@Component({
  selector: 'app-my-applications',
  templateUrl: './my-applications.component.html',
  styleUrls: ['./my-applications.component.scss']
})
export class MyApplicationsComponent implements OnInit {
  applications: any[] = [];
  totalItems: number = 0;
  itemsPerPage = 10;
  currentPage = 1;
  isLoading = false;
  currentUser: any;
  modalShow: boolean = false;
  motivationText: string = '';
  applicationId: string = '';
  constructor(private authService: AuthService,
    private userService: UserService,
    private mobilityRequestService: MobilityRequestService) { }

  ngOnInit(): void {
    this.getApplications();
  }
  getApplications() {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.userService.getUserById(user._id).subscribe((userDetails: any) => {
        this.applications = userDetails.applications;
      });
    });
  }
  deleteApplication(id: string) {
    this.mobilityRequestService.deleteMobilityRequest(id).subscribe(() => {
      this.getApplications();
    });
  }
  openModal(motivationLetter: string, id: string) {
    this.modalShow = true;
    this.applicationId = id;
    this.motivationText = motivationLetter;
  }
  closeModal() {
    this.modalShow = false;
  }

  submit() {
    this.mobilityRequestService.updateMobilityRequest(this.applicationId, { motivation: this.motivationText }).subscribe(() => {
      this.modalShow = false;
      this.getApplications();
    });
  }

}
