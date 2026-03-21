import {Component, OnInit} from '@angular/core';
import {LoginFormComponent} from '../../forms/login-form/login-form.component';

@Component({
  selector: 'app-login-page',
  imports: [LoginFormComponent],
  standalone: true,
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
    ngOnInit(): void {

    }



}
