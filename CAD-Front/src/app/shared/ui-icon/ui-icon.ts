import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type UiIconName =
  | 'menu'
  | 'close'
  | 'search'
  | 'sun'
  | 'moon'
  | 'arrow-right'
  | 'play'
  | 'user'
  | 'school'
  | 'family'
  | 'shield'
  | 'course'
  | 'spark'
  | 'library'
  | 'video'
  | 'lock'
  | 'phone'
  | 'community'
  | 'children'
  | 'check'
  | 'download'
  | 'file'
  | 'warning'
  | 'message'
  | 'building'
  | 'flag';

@Component({
  selector: 'app-ui-icon',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.aria-label]="label || name"
      [attr.role]="decorative ? 'presentation' : 'img'"
      [attr.aria-hidden]="decorative ? 'true' : null"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      [attr.stroke-width]="strokeWidth"
      class="block h-full w-full">
      @switch (name) {
        @case ('menu') {
          <path d="M4 7h16M4 12h16M4 17h16" />
        }
        @case ('close') {
          <path d="M6 6l12 12M18 6 6 18" />
        }
        @case ('search') {
          <circle cx="11" cy="11" r="6.5" />
          <path d="m16 16 4 4" />
        }
        @case ('sun') {
          <circle cx="12" cy="12" r="4.2" />
          <path d="M12 2.5v2.3M12 19.2v2.3M4.8 4.8l1.6 1.6M17.6 17.6l1.6 1.6M2.5 12h2.3M19.2 12h2.3M4.8 19.2l1.6-1.6M17.6 6.4l1.6-1.6" />
        }
        @case ('moon') {
          <path d="M19 14.8A7.5 7.5 0 1 1 9.2 5a6.1 6.1 0 0 0 9.8 9.8Z" />
        }
        @case ('arrow-right') {
          <path d="M5 12h13" />
          <path d="m13 6 6 6-6 6" />
        }
        @case ('play') {
          <circle cx="12" cy="12" r="9" />
          <path d="m10 8.8 5 3.2-5 3.2Z" fill="currentColor" stroke="none" />
        }
        @case ('user') {
          <circle cx="12" cy="8.2" r="3.3" />
          <path d="M5.5 19c1.7-2.7 4-4 6.5-4s4.8 1.3 6.5 4" />
        }
        @case ('school') {
          <path d="m3 10 9-5 9 5-9 5-9-5Z" />
          <path d="M7 12.5V16c0 1.4 2.2 2.8 5 2.8s5-1.4 5-2.8v-3.5" />
        }
        @case ('family') {
          <circle cx="8" cy="9" r="2.3" />
          <circle cx="16.5" cy="9.5" r="2" />
          <path d="M3.8 18c.7-2.4 2.3-3.8 4.5-3.8 2.1 0 3.8 1.2 4.5 3.3" />
          <path d="M13.4 18c.5-1.9 1.8-3 3.6-3 1.6 0 2.9.9 3.6 2.6" />
        }
        @case ('shield') {
          <path d="M12 3.5 5.5 6v5.1c0 4 2.4 7 6.5 9.4 4.1-2.4 6.5-5.4 6.5-9.4V6L12 3.5Z" />
          <path d="m9.4 12.2 1.7 1.8 3.6-4" />
        }
        @case ('course') {
          <path d="M4.5 6.5h6.8a2.7 2.7 0 0 1 2.7 2.7V18H7.2A2.7 2.7 0 0 0 4.5 20.7V6.5Z" />
          <path d="M14 18h2.8a2.7 2.7 0 0 1 2.7 2.7V6.5h-5.6" />
        }
        @case ('spark') {
          <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
        }
        @case ('library') {
          <path d="M4.5 19.5h15" />
          <path d="M7 5.5v14M11 4.5v15M15 6.5v13M18.5 8v11" />
        }
        @case ('video') {
          <rect x="4" y="6" width="11.5" height="12" rx="2.2" />
          <path d="m15.5 10 4.5-2.5v9l-4.5-2.5" />
        }
        @case ('lock') {
          <rect x="5.5" y="10.5" width="13" height="9" rx="2.2" />
          <path d="M8.5 10V8.5a3.5 3.5 0 0 1 7 0V10" />
        }
        @case ('phone') {
          <rect x="7.2" y="2.8" width="9.6" height="18.4" rx="2.3" />
          <path d="M10.5 5.5h3" />
          <path d="M11.9 18.2h.2" />
        }
        @case ('community') {
          <path d="M12 4.5 19 8v8l-7 3.5L5 16V8l7-3.5Z" />
          <path d="M12 8v8M8.5 10l3.5 2 3.5-2" />
        }
        @case ('children') {
          <circle cx="8" cy="8.2" r="2.2" />
          <circle cx="16" cy="8.2" r="2.2" />
          <path d="M5 18c.5-2.2 1.8-3.4 3.8-3.4S12 15.8 12.6 18" />
          <path d="M11.4 18c.5-2.2 1.8-3.4 3.8-3.4S18.4 15.8 19 18" />
        }
        @case ('check') {
          <path d="m5 12 4.1 4.1L19 6.8" />
        }
        @case ('download') {
          <path d="M12 4.5v10" />
          <path d="m8.2 10.8 3.8 3.8 3.8-3.8" />
          <path d="M5 19.5h14" />
        }
        @case ('file') {
          <path d="M8 3.5h6l4 4V20.5H8a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z" />
          <path d="M14 3.5v4h4" />
          <path d="M9.5 13h5M9.5 16.5h5" />
        }
        @case ('warning') {
          <path d="M12 4.5 20 19.5H4L12 4.5Z" />
          <path d="M12 10v4.4" />
          <path d="M12 17.2h.01" />
        }
        @case ('message') {
          <path d="M5.5 6.5h13a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H10l-4.5 3v-3H5.5a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2Z" />
        }
        @case ('building') {
          <path d="M6 20V6.5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2V20" />
          <path d="M9 8.5h1.5M13.5 8.5H15M9 12h1.5M13.5 12H15M9 15.5h1.5M13.5 15.5H15" />
          <path d="M4 20h16" />
        }
        @case ('flag') {
          <path d="M6 20V4.5" />
          <path d="M6 5.5c2-.9 4-.9 6 0s4 .9 6 0v8c-2 .9-4 .9-6 0s-4-.9-6 0" />
        }
      }
    </svg>
  `,
})
export class UiIconComponent {
  @Input({ required: true }) name!: UiIconName;
  @Input() label?: string;
  @Input() strokeWidth = 1.8;
  @Input() decorative = true;
}
