import { Component } from '@angular/core';
import {TranslocoPipe} from '@jsverse/transloco';

@Component({
  selector: 'as-about',
  imports: [
    TranslocoPipe
  ],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {}
