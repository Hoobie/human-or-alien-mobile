import { Component, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NavController } from 'ionic-angular';
import { FileChooser } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  src: any;
  imgReady: boolean = false;
  humanFound: boolean = false;

  constructor(public navCtrl: NavController, public changeDetector: ChangeDetectorRef,
    public domSanitizer: DomSanitizer) {
  }

  loadImage() {
    var rects = document.getElementsByClassName('rect');
    while (rects[0]) {
      rects[0].parentNode.removeChild(rects[0])
    }

    this.imgReady = false;
    this.humanFound = false;
    FileChooser.open()
      .then(uri => {
        let safeUrl = this.domSanitizer.bypassSecurityTrustUrl(uri);
        this.imgReady = true;
        this.src = safeUrl;
      })
      .catch(e => console.log(e));
  }

  humanOrAlien() {
    var tracker = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
    tracker.setStepSize(1.7);
    tracking.track('#img', tracker);

    var t = this;

    tracker.on('track', function(event) {
      event.data.forEach(function(rect) {
        t.plot(rect.x, rect.y, rect.width, rect.height);
        t.humanFound = true;
      });
    });
  }

  plot(x, y, w, h) {
    var img = document.getElementById('img');

    var rect = document.createElement('div');
    document.querySelector('.demo-container').appendChild(rect);
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.left = (img.offsetLeft + x) + 'px';
    rect.style.top = (img.offsetTop + y) + 'px';
  };
}
