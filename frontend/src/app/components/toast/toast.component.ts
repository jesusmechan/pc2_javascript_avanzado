import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  template: `<div class="toast" [class.show]="toast.visible()" role="status" aria-live="polite">{{ toast.mensaje() }}</div>`,
})
export class ToastComponent {
  toast = inject(ToastService);
}
