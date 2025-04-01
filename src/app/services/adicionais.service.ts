import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdicionaisService {
  private selectedItems: string[] = [];

  private selectedItemsSubject = new BehaviorSubject<string[]>(this.selectedItems);
  selectedItems$ = this.selectedItemsSubject.asObservable();

  addItem(itemName: string): void {
    if (!this.selectedItems.includes(itemName)) {
      this.selectedItems.push(itemName);
      this.selectedItemsSubject.next(this.selectedItems);
    }
  }

  removeItem(itemName: string): void {
    const index = this.selectedItems.indexOf(itemName);
    if (index !== -1) {
      this.selectedItems.splice(index, 1);
      this.selectedItemsSubject.next(this.selectedItems);
    }
  }

  getSelectedItems(): string[] {
    return this.selectedItems;
  }
}
