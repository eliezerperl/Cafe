import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StoreComponent } from './store/store.component';
import { AdminComponent } from './admin/admin.component';
import { CartComponent } from './cart/cart.component';
import { PagesRoutingModule } from './pages-routing.module';
import { SharedComponentsModule } from './shared/components/shared-components.module';
import { CheckoutComponent } from './checkout/checkout.component';
import { OrderHistoryModalComponent } from '../shared/order-history-modal/order-history-modal.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';

@NgModule({
  declarations: [
    DashboardComponent,
    StoreComponent,
    AdminComponent,
    CartComponent,
    CheckoutComponent,
    OrderHistoryModalComponent,
    OrderConfirmationComponent
  ],
  imports: [CommonModule, PagesRoutingModule, SharedComponentsModule],
})
export class PagesModule {}
