import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';
import { BlogService } from '../service/blog.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.page.html',
  styleUrls: ['./upload.page.scss'],
})
export class UploadPage implements OnInit {

imgSrc = '../assets/logo.png';
selectedImage: any = null;
isSubmitted: boolean ;

  formTemplate = new FormGroup({
    title : new FormControl ('', Validators.required),
    imageUrl : new FormControl (''),
    contents : new FormControl ('')
  });

  // var for logins---------------------
  title = 'firebaseLogin';
  contents: string;
  selectedVal: string;
  responseMessage = '';
  responseMessageType = '';
  emailInput: string;
  passwordInput: string;
  isForgotPassword: boolean;
  userDetails: any;
  //  -----------------------------
  constructor(
    private storage: AngularFireStorage,
    private blogService: BlogService
  ) {
    this.selectedVal = 'login';
    this.isForgotPassword = false;
  }

  ngOnInit() {
    // this.userDetails = this.blogService.isUserLoggedIn();
  }

  myFunction2() {
    const x = document.getElementById('myTopnav');
    const y = document.getElementById('contacts_icon');
    if (x.className === 'topnav') {
      x.className += ' responsive';
      y.style.display = 'block';
    } else {
      x.className = 'topnav';
      y.style.display = 'none';
    }
  }


  showPrev(event: any) {
    if (event.target.files && event.target.files[0]) {
 const reader = new FileReader();
 reader.onload = (e: any) => this.imgSrc = e.target.result;
 reader.readAsDataURL(event.target.files[0]);
 this.selectedImage = event.target.files[0];
    } else {
      this.imgSrc = '../assets/logo.png';
      this.selectedImage = null;
    }
  }
  onSubmit(formValue) {
this.isSubmitted = true;
if (this.formTemplate.valid) {
  formValue.contents = formValue.contents.replace(/\r?\n/g, '<br />');
  if (!this.selectedImage) {
    formValue.imageUrl = '-';
    this.blogService.insertImageDetails(formValue);
    this.resetForm();
  } else {
    const thename = this.selectedImage.name.split('.').slice(0, -1).join('.');
    const thetime = new Date().getTime();
    const filepath = 'datapretblog/' + thename + '_' + thetime;
    const fileRef = this.storage.ref(filepath);
    this.storage.upload(filepath, this.selectedImage).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          formValue.imageUrl = url;
          this.blogService.insertImageDetails(formValue);
          this.resetForm();
        });
      })
    ).subscribe();
  }

}
  }

  get formControls() {
    return this.formTemplate.controls;
  }
  resetForm() {
    this.imgSrc = '../assets/logo.png';
    this.selectedImage = '';
    this. isSubmitted = false;
    this.formTemplate.reset();
    }

  // login rdsdjfkjsdkljsd
  // Comman Method to Show Message and Hide after 2 seconds
  showMessage(type, msg) {
    this.responseMessageType = type;
    this.responseMessage = msg;
    setTimeout(() => {
      this.responseMessage = '';
    }, 2000);
  }

  // Called on switching Login/ Register tabs
  public onValChange(val: string) {
    this.showMessage('', '');
    this.selectedVal = val;
  }

  // Check localStorage is having User Data
  isUserLoggedIn() {
    this.userDetails = this.blogService.isUserLoggedIn();
  }

  // SignOut Firebase Session and Clean LocalStorage
  logoutUser() {
    this.blogService.logout()
      .then(res => {
        console.log(res);
        this.userDetails = undefined;
        localStorage.removeItem('user');
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Login user with  provided Email/ Password
  loginUser() {
    this.responseMessage = '';
    this.blogService.login(this.emailInput, this.passwordInput)
      .then(res => {
        console.log(res);
        this.showMessage('success', 'Successfully Logged In!');
        this.isUserLoggedIn();
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Register user with  provided Email/ Password
  registerUser() {
    alert('Sorry, New user registration blocked by Admin!');
    /*
    this.blogService.register(this.emailInput, this.passwordInput)
      .then(res => {

        // Send Varification link in email
        this.blogService.sendEmailVerification().then(res => {
          console.log(res);
          this.isForgotPassword = false;
          this.showMessage('success', 'Registration Successful! Please Verify Your Email');
        }, err => {
          this.showMessage('danger', err.message);
        });
        this.isUserLoggedIn();


      }, err => {
        this.showMessage('danger', err.message);
      });*/
  }

  // Send link on given email to reset password
  forgotPassword() {
    this.blogService.sendPasswordResetEmail(this.emailInput)
      .then(res => {
        console.log(res);
        this.isForgotPassword = false;
        this.showMessage('success', 'Please Check Your Email');
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

  // Open Popup to Login with Google Account
  googleLogin() {
    this.blogService.loginWithGoogle()
      .then(res => {
        console.log(res);
        this.showMessage('success', 'Successfully Logged In with Google');
        this.isUserLoggedIn();
      }, err => {
        this.showMessage('danger', err.message);
      });
  }

}
// ---------------------------------------------------------


