import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../shared/services/order.service';
import { Order } from 'src/app/models/order.model';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
})
export class OrderConfirmationComponent implements OnInit {
  orderId!: string;
  orderDetails!: Order;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id')!;
    this.orderService.getOrderDetails(this.orderId).subscribe({
      next: (order) => {
        this.orderDetails = order;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  downloadPDF() {
    const element = document.getElementById('invoice-content') as HTMLElement;
    if (!element) {
      console.error('Invoice element not found');
      return;
    }

    html2canvas(element, {
      scrollY: -window.scrollY, // correct for scroll
      useCORS: true,
      scale: 2, // higher resolution
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Order_${this.orderId}.pdf`);
    });
  }
}
