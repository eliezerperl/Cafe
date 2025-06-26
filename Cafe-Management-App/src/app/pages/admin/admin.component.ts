import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  activeTab: 'users' | 'beverages' | 'orders' = 'users';

  constructor(private userService: UserService) {}

  isOwner(): boolean {
    return this.userService.getRole()?.toUpperCase() == 'OWNER';
  }
}
