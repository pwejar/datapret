import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFirestore } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class BlogService {
 imageUrl: any;
  imageDetailList: AngularFireList<any>;

  constructor(
    public angularFireAuth: AngularFireAuth,
    private firebase: AngularFireDatabase,
    public router: Router,
    private firestore: AngularFirestore
  ) {
    this.angularFireAuth.authState.subscribe(userResponse => {
      if (userResponse) {
        localStorage.setItem('user', JSON.stringify(userResponse));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }
  deleteRecord(record_id){
    this.firestore.doc('datapretBlogs/' + record_id).delete();
  }
  getImageDetailList() {
    this.imageDetailList = this.firebase.list('datapretBlogs');
  }
  read_blogs() {
    return this.firestore.collection('datapretBlogs').snapshotChanges();
  }

  insertImageDetails(imageDetails) {
    // this.imageDetailList.push(imageDetails);
     return this.firestore.collection('datapretBlogs').add(imageDetails);
  }


  async login(email: string, password: string) {
    return await this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string) {
    return await this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  async sendEmailVerification() {
    return await this.angularFireAuth.auth.currentUser.sendEmailVerification();
  }

  async sendPasswordResetEmail(passwordResetEmail: string) {
    return await this.angularFireAuth.auth.sendPasswordResetEmail(passwordResetEmail);
  }

  async logout() {
    return await this.angularFireAuth.auth.signOut();
  }


  isUserLoggedIn() {
    return JSON.parse(localStorage.getItem('user'));
  }

  async  loginWithGoogle() {
    return await this.angularFireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());
  }

}
