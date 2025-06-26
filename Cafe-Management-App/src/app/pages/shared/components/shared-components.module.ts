import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { OrdersComponent } from './orders/orders.component';
import { BeveragesComponent } from './beverages/beverages.component';
import { FormsModule } from '@angular/forms';
import { OrderDetailsModalComponent } from './order-details-modal/order-details-modal.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [UsersComponent, OrdersComponent, BeveragesComponent, OrderDetailsModalComponent, ],
  imports: [CommonModule, FormsModule, RouterModule],
  exports: [UsersComponent, OrdersComponent, BeveragesComponent],
})
export class SharedComponentsModule {}
