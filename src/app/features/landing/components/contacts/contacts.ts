import {Component, inject} from '@angular/core';
import {DomSanitizer, SafeResourceUrl} from "@angular/platform-browser";
import {environment} from '../../../../../environments/environment';
import {TranslocoPipe} from '@jsverse/transloco';
import {AppIcon} from '../../../../shared/components/icon/icon';

@Component({
  selector: 'as-contacts',
  imports: [
    TranslocoPipe,
    AppIcon
  ],
  templateUrl: './contacts.html',
  styleUrl: './contacts.scss',
})
export class Contacts {
  private sanitizer = inject(DomSanitizer);

  private rawUrl = environment.mapURL;

  readonly safeMapUrl: SafeResourceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.rawUrl);
  protected readonly environment = environment;
}
