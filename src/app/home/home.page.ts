import { Component, } from '@angular/core';
import { IonSlides } from '@ionic/angular';

const slideOptions = {
  initialSlide: 3,
  speed: 400,
};

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}
  slidesDidLoad(slides: IonSlides) {
    slides.startAutoplay();
  }

  myFunction() {
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
 getFocus() {
    document.getElementById('contactFoucus').scrollIntoView();
  }

}
