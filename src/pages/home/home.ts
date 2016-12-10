import { Component, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NavController } from 'ionic-angular';
import { FileChooser } from 'ionic-native';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  static THRESHOLD: number = 3;
  src: any = 'assets/example1.jpg';
  found: string = null;
  objects = [];
  colors = [];

  constructor(public navCtrl: NavController, public changeDetector: ChangeDetectorRef,
    public domSanitizer: DomSanitizer) {
    tracking.ColorTracker.registerColor('alien-green', function(r, g, b) {
      return r < 220 && g > 200 && b < 100;
    });
    tracking.ColorTracker.registerColor('alien-blue', function(r, g, b) {
      return r < 100 && b > 220;
    });
    tracking.ColorTracker.registerColor('alien-yellow', function(r, g, b) {
      return r > 200 && g > 200 && b < 100;
    });
    tracking.ColorTracker.registerColor('alien-grey', function(r, g, b) {
      return r > 50 && r < 100 && g > 50 && g < 100 && b > 50 && b < 100;
    });
  }

  loadImage() {
    this.clear();

    FileChooser.open()
      .then(uri => {
        let safeUrl = this.domSanitizer.bypassSecurityTrustUrl(uri);
        this.src = safeUrl;
      })
      .catch(e => console.log(e));
  }

  humanOrAlien() {
    this.clear();

    var objectTracker = new tracking.ObjectTracker(['eye', 'mouth']);
    objectTracker.setStepSize(1.1);
    var t = this;

    objectTracker.on('track', function(event) {
      event.data.forEach(function(obj) {
        t.objects.push(obj);
        HomePage.plot(obj.x, obj.y, obj.width, obj.height, 'purple');
        for (let rect of t.colors) {
          if (HomePage.doesObjectIntersectWithColor(obj, rect)) {
            console.log('Found an alien');
            t.found = 'Alien';
          }
        }
        if (t.found != 'Alien') {
          console.log('Found a human');
          t.found = 'Human';
        }
      });
    });

    var colorTracker = new tracking.ColorTracker(['alien-green', 'alien-blue', 'alien-yellow', 'alien-grey']);
    colorTracker.on('track', function(event) {
      event.data.forEach(function(rect) {
        t.colors.push(rect);
        HomePage.plot(rect.x, rect.y, rect.width, rect.height, 'green');
        for (let obj of t.objects) {
          if (HomePage.doesObjectIntersectWithColor(obj, rect)) {
            console.log('Found an alien');
            t.found = 'Alien';
          }
        }
        if (t.found != 'Alien') {
          console.log('Found a human');
          t.found = 'Human';
        }
      });
    });

    tracking.track('#img', objectTracker);
    tracking.track('#img', colorTracker);
  }

  clear() {
    var rects = document.getElementsByClassName('rect');
    while (rects[0]) {
      rects[0].parentNode.removeChild(rects[0])
    }

    this.found = null;
    this.objects = [];
  }

  static doesObjectIntersectWithColor(obj, col) {
    return (obj.x + HomePage.THRESHOLD >= col.x && obj.x + obj.width - HomePage.THRESHOLD <= col.x + col.width)
      && (obj.y + HomePage.THRESHOLD >= col.y && obj.y + obj.height - HomePage.THRESHOLD <= col.y + col.height);
  }

  static plot(x, y, w, h, color) {
    var img = document.getElementById('img');

    var rect = document.createElement('div');
    document.querySelector('.img-container').appendChild(rect);
    rect.classList.add('rect');
    rect.style.width = w + 'px';
    rect.style.height = h + 'px';
    rect.style.left = (img.offsetLeft + x) + 'px';
    rect.style.top = (img.offsetTop + y) + 'px';
    rect.style.borderColor = color;
  };
}
