import { Component, OnInit } from '@angular/core';
import { BlogService } from '../service/blog.service';
import { NavController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.page.html',
  styleUrls: ['./blog.page.scss'],
})
export class BlogPage implements OnInit {
  userDetails: any;
  blogs: any;
  controller = document.querySelector('ion-alert-controller');
  constructor(
    private blogService: BlogService,
    public navCtrl: NavController,
    private alertControler: AlertController
  ) { }

  ngOnInit() {
    this.blogService.getImageDetailList();
    this.isUserLoggedIn();
    this.blogService.read_blogs().subscribe(data => {

      this.blogs = data.map(e => {
        return {
          id: e.payload.doc.id,
          isEdit: false,
          contents: e.payload.doc.data()['contents'],
          imageUrl: e.payload.doc.data()['imageUrl'],
          title: e.payload.doc.data()['title'],
        };
      });


    });
    this.getMydata();
  }
  getMydata() {

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
  isUserLoggedIn() {
    this.userDetails = this.blogService.isUserLoggedIn();
  }
  deleteRecord(rowID) {
  this.blogService.deleteRecord(rowID);
  }
  async presentAlertConfirm(theid) {
    const alert = await this.alertControler.create({
      header: 'Confirm!',
      message: 'This Blog will be deleted !!!',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          }
        }, {
          text: 'Delete',
          handler: () => {
            this.blogService.deleteRecord(theid);
            console.log('Confirm Okay');
          }
        }
      ]
    });
  
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }
}
