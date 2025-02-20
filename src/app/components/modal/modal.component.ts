import { Component, Input, Output, EventEmitter } from '@angular/core';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 p-4" *ngIf="isOpen">
      <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button (click)="closeModal()" class="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✖</button>

        <ng-content></ng-content>
      </div>
    </div>
  `,
  imports: [
    NgIf
  ],
  styles: [`
    .fixed {
      position: fixed;
      z-index: 50;
      width: 100%;
      height: 100%;
    }
  `]
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
}
