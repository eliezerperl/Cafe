import { Component, OnInit } from '@angular/core';
import { Beverage } from 'src/app/models/beverage.model';
import { BeverageService } from '../../services/beverage.service';

@Component({
  selector: 'app-beverages',
  templateUrl: './beverages.component.html',
  styleUrls: ['./beverages.component.css'],
})
export class BeveragesComponent implements OnInit {
  beverages: Beverage[] = [];
  loading = false;
  error = '';

  newType: string = '';
  newPrice: number | null = null;
  newUnitsInStock: number | null = null;

  editingId: string | null = null;
  editPrice: number | null = null;
  editUnitsInStock: number | null = null;
  editType: string = '';

  constructor(private beverageService: BeverageService) {}

  ngOnInit(): void {
    this.loadBeverages();
  }

  loadBeverages() {
    this.loading = true;
    this.beverageService.getBeverages().subscribe({
      next: (data) => {
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
      alert('Type is required');
      return;
    }
    if (this.editPrice === null || this.editPrice <= 0) {
      alert('Price must be positive');
      return;
    }
    if (this.editUnitsInStock === null || this.editUnitsInStock < 0) {
      alert('Units in stock cannot be negative');
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
        error: () => alert('Failed to update beverage'),
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

  createBeverage() {
    this.beverageService
      .addBeverage({
        type: this.newBeverage.type,
        price: this.newBeverage.price,
        quantity: this.newBeverage.unitsInStock,
      })
      .subscribe({
        next: () => {
          this.loadBeverages();
          this.cancelAdd();
        },
        error: () => alert('Failed to add beverage'),
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
