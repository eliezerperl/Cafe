import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserManagementService } from '../../services/userManagement.service';
import { UserService } from 'src/app/services/user.service';
import { Role } from 'src/app/models/enums/role.enum';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = true;
  error = '';
  roles = Object.values(Role);
  editedUser: User | null = null;
  addingUser = false;
  newUser: User = {
    id: '00000000-0000-0000-0000-000000000000',
    userName: '',
    role: Role.User,
  };
  currentUserRole!: Role;

  constructor(
    private userManagementService: UserManagementService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    combineLatest([
      this.userService.userId$,
      this.userService.name$,
      this.userService.role$,
    ]).subscribe(([id, name, role]) => {
      this.editedUser = {
        id: id || '',
        userName: name || '',
        role: (role as Role) || Role.User,
      };
    });
    this.userService.role$.subscribe((role) => {
      this.currentUserRole = role as Role;
    });
    this.fetchUsers();
  }

  fetchUsers() {
    const currentUserId = this.userService.getUserId();

    this.loading = true;
    this.userManagementService.getUsers().subscribe({
      next: (users) => {
        this.users = users.filter((user) => user.id !== currentUserId);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
      },
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userManagementService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter((u) => u.id !== id);
      });
    }
  }

  //OWNER
  isOwner(): boolean {
    return this.userService.getRole()?.toUpperCase() == 'OWNER';
  }

  //ADD
  startAdd() {
    this.addingUser = true;
    this.cancelEdit();
  }

  cancelAdd() {
    this.addingUser = false;
    this.newUser = {
      id: '00000000-0000-0000-0000-000000000000',
      userName: '',
      role: Role.User,
    };
  }

  createUser() {
    if (!this.newUser.userName || !this.newUser.role) return;

    this.userManagementService.addUser(this.newUser).subscribe({
      next: () => {
        this.fetchUsers();
        this.cancelAdd();
      },
      error: (err) => {
        this.error = 'Failed to create user';
        console.error(err);
      },
    });
  }

  //EDIT
  startEdit(user: User) {
    this.editedUser = { ...user };
  }

  cancelEdit() {
    this.editedUser = null;
  }

  saveUser() {
    if (!this.editedUser) return;

    this.userManagementService
      .editUser(this.editedUser.id, this.editedUser)
      .subscribe({
        next: () => {
          this.fetchUsers();
          this.editedUser = null;
        },
        error: (err) => {
          this.error = 'Failed to update user';
          console.error(err);
        },
      });
  }
}
