import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { CartService } from 'src/app/services/cart.service';
import { SharedService } from 'src/app/services/shared.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  isLoggedIn = false;
  userName$ = this.userService.name$;
  cartCount = 0;
  currentRoute = '';
  showCart = false;
  showBack = false;
  justLoggedIn = false;

  constructor(
    private userService: UserService,
    private cartService: CartService,
    private sharedService: SharedService,
    private location: Location,
    private router: Router
  ) {}

  ngOnInit() {
    this.sharedService.loggedIn$.subscribe((status) => {
      this.isLoggedIn = status;
      if (status) {
        // User just logged in
        this.justLoggedIn = true;
      }
    });

    this.cartService.items$.subscribe((items) => {
      this.cartCount = items.reduce((total, item) => total + item.quantity, 0);
    });

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd
        )
      )
      .subscribe((event) => {
        this.currentRoute = event.urlAfterRedirects;
        this.showCart =
          this.isLoggedIn && this.shouldShowCart(this.currentRoute);

        if (this.justLoggedIn) {
          // We are at first navigation after login, hide back button and reset flag
          this.showBack = false;
          this.justLoggedIn = false;
        } else {
          this.showBack = this.shouldShowBack(this.currentRoute);
        }
      });
  }

  shouldShowCart(route: string): boolean {
    const visibleRoutes = ['/dashboard', '/store'];
    return visibleRoutes.some((r) => route.startsWith(r));
  }

  isAdminOrOwner(): boolean {
    const role = this.userService.getRole()?.toString().toUpperCase();
    return role === 'ADMIN' || role === 'OWNER';
  }

  logout() {
    this.sharedService.logout();
  }

  shouldShowBack(route: string): boolean {
    const excludedRoutes = ['/login', '/register'];
    return !excludedRoutes.some((r) => route.startsWith(r));
  }

  goBack() {
    this.location.back();
  }
}
