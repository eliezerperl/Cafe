import { Component, OnInit } from '@angular/core';
import { Beverage } from 'src/app/models/beverage.model';
import { BeverageService } from '../../services/beverage.service';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-beverages',
  templateUrl: './beverages.component.html',
  styleUrls: ['./beverages.component.css'],
})
export class BeveragesComponent implements OnInit {
  beverages: Beverage[] = [];
  loading = false;
  error = '';
  selectedFile: File | null = null;

  newType: string = '';
  newPrice: number | null = null;
  newUnitsInStock: number | null = null;
  newImageUrl: string = '';

  editingId: string | null = null;
  editPrice: number | null = null;
  editUnitsInStock: number | null = null;
  editType: string = '';

  constructor(
    private beverageService: BeverageService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadBeverages();
  }

  loadBeverages() {
    this.loading = true;
    this.beverageService.getBeverages().subscribe({
      next: (data) => {
        console.log(data);
        this.beverages = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load beverages';
        this.loading = false;
      },
    });
  }

  startEditing(beverage: Beverage) {
    this.editingId = beverage.id;
    this.editPrice = beverage.price;
    this.editUnitsInStock = beverage.unitsInStock;
    this.editType = beverage.type;
  }

  cancelEditing() {
    this.editingId = null;
    this.editPrice = null;
    this.editUnitsInStock = null;
    this.editType = '';
  }

  saveEdit(beverage: Beverage) {
    if (!this.editType.trim()) {
      this.alertService.show('Type is required');
      return;
    }
    if (this.editPrice === null || this.editPrice <= 0) {
      this.alertService.show('Price must be positive');
      return;
    }
    if (this.editUnitsInStock === null || this.editUnitsInStock < 0) {
      this.alertService.show('Units in stock cannot be negative');
      return;
    }

    beverage.type = this.editType;
    beverage.price = this.editPrice;
    beverage.unitsInStock = this.editUnitsInStock;

    this.beverageService
      .updateBeverage(beverage.id, this.editUnitsInStock, this.editPrice)
      .subscribe({
        next: () => {
          this.loadBeverages();
          this.cancelEditing();
        },
        error: () => this.alertService.show('Failed to update beverage'),
      });
  }

  addingBeverage = false;
  newBeverage = {
    type: '',
    price: 0,
    unitsInStock: 0,
  };

  startAdd() {
    this.addingBeverage = true;
  }

  cancelAdd() {
    this.addingBeverage = false;
    this.newBeverage = { type: '', price: 0, unitsInStock: 0 };
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const img = new Image();

    reader.onload = () => {
      img.src = reader.result as string;
    };

    img.onload = () => {
      const canvasSize = 48; // 3rem = 48px assuming 16px root font size

      const canvas = document.createElement('canvas');
      canvas.width = canvasSize;
      canvas.height = canvasSize;

      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Calculate cropping area
      const aspectRatio = img.width / img.height;
      let sx = 0,
        sy = 0,
        sw = img.width,
        sh = img.height;

      if (aspectRatio > 1) {
        // wider than tall → crop sides
        sw = img.height;
        sx = (img.width - sw) / 2;
      } else if (aspectRatio < 1) {
        // taller than wide → crop top/bottom
        sh = img.width;
        sy = (img.height - sh) / 2;
      }

      // Draw the cropped + scaled image
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvasSize, canvasSize);

      // Compress it (0.7 = 70% quality)
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type,
            });
            this.selectedFile = resizedFile;
            // Now ready to upload
          }
        },
        file.type,
        0.7
      );
    };

    reader.readAsDataURL(file);
  }

  createBeverage() {
    if (!this.newBeverage.type.trim() || !this.newBeverage.price) {
      return this.alertService.show('Type and price are required.');
    }

    if (!this.selectedFile) {
      return this.alertService.show('Please select an image file.');
    }

    const formData = new FormData();
    formData.append('Type', this.newBeverage.type);
    formData.append('Price', this.newBeverage.price.toString());
    formData.append('Quantity', this.newBeverage.unitsInStock.toString());
    formData.append('Image', this.selectedFile);

    this.beverageService.addBeverage(formData).subscribe({
      next: () => {
        this.loadBeverages();
        this.cancelAdd();
        this.selectedFile = null; // reset
      },
      error: () => this.alertService.show('Failed to add beverage'),
    });
  }

  deleteBeverage(id: string) {
    if (confirm('Are you sure you want to delete this beverage?')) {
      this.beverageService.deleteBeverage(id).subscribe(() => {
        this.loadBeverages();
      });
    }
  }
}
