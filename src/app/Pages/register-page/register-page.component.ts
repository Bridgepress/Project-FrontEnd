import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountRequests } from '../auth/Requests/AccountRequests';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  @Output() cancelRegister = new EventEmitter();
  registerForm: FormGroup = new FormGroup({});

  constructor(
    public accountRequests: AccountRequests,
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), Validators.maxLength(20)]
      ]
    });
  }

  register() {
    const values = { ...this.registerForm.value };
    this.accountRequests.register(values).subscribe({
      next: () => {
        this.router.navigateByUrl('');
      },
      error: (err) => {
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
    this.router.navigateByUrl('');
  }
}
