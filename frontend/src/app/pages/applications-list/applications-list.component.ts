import { Component, OnInit } from '@angular/core';
import { MobilityRequestService } from '../services/mobility-request.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-applications-list',
  templateUrl: './applications-list.component.html',
  styleUrls: ['./applications-list.component.scss']
})
export class ApplicationsListComponent implements OnInit {
  applications: any[] = [];
  totalItems: number = 0;
  itemsPerPage = 10;
  currentPage = 1;
  isLoading = false;
  currentUser: any;

  // Modal properties
  selectedApplication: any = null;
  modalShow: boolean = false;
  isApproving: boolean = true;
  commentText: string = '';

  constructor(private mobilityRequestService: MobilityRequestService, private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: any) => {
      this.currentUser = user;
      if (user.role === 'manager') {
        this.getApplications();
      }
      if (user.role === 'hr') {
        this.getAllApplications();
      }
    });
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.getApplications();
  }

  getAllApplications() {
    this.isLoading = true;
    this.mobilityRequestService.getAllMobilityRequests(this.currentPage, this.itemsPerPage).subscribe(applications => {
      this.applications = applications.data;
      this.totalItems = applications.pagination.totalItems;
      this.isLoading = false;
    });
  }

  getApplications() {
    this.isLoading = true;
    this.mobilityRequestService.getMobilityRequestsByManager(this.currentPage, this.itemsPerPage).subscribe(applications => {
      this.applications = applications.data;
      this.totalItems = applications.pagination.totalItems;
      this.isLoading = false;
    });
  }

  deleteApplication(id: string) {
    this.mobilityRequestService.deleteMobilityRequest(id).subscribe(() => {
      this.getApplications();
    });
  }

  canApprove(application: any): boolean {
    if (!this.currentUser) return false;
    if (application.currentStep === 'current_manager_approval' && this.currentUser._id === application.employee.manager) {
      return true;
    }
    if (application.currentStep === 'manager_approval' && this.currentUser._id === application.job.postedBy) {
      return true;
    }
    if (application.currentStep === 'hr_approval' && this.currentUser.role === 'hr') {
      return true;
    }
    return false;
  }

  // Open modal for adding comment
  openCommentModal(application: any, isApproving: boolean) {
    this.modalShow = true;
    this.selectedApplication = application;
    this.isApproving = isApproving;
    this.commentText = '';
  }

  // Close modal
  closeModal() {
    this.modalShow = false;
    this.selectedApplication = null;
    this.commentText = '';
  }

  // Process the decision (approve or reject) with comment
  processDecision() {
    if (!this.selectedApplication) return;

    const decisionData = {
      approved: this.isApproving,
      comment: this.commentText
    };

    let apiCall;
    if (this.selectedApplication.currentStep === 'current_manager_approval') {
      apiCall = this.mobilityRequestService.currentManagerApproval(this.selectedApplication._id, decisionData);
    } else if (this.selectedApplication.currentStep === 'manager_approval') {
      apiCall = this.mobilityRequestService.managerApproval(this.selectedApplication._id, decisionData);
    } else if (this.selectedApplication.currentStep === 'hr_approval') {
      apiCall = this.mobilityRequestService.hrApproval(this.selectedApplication._id, decisionData);
    }

    if (apiCall) {
      apiCall.subscribe(() => {
        this.closeModal();
        this.getApplications();
      });
    }
  }

  approve(application: any) {
    this.openCommentModal(application, true);
  }

  reject(application: any) {
    this.openCommentModal(application, false);
  }
}