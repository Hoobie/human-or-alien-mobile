import { Component, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { NavController } from 'ionic-angular';
import { FileChooser } from 'ionic-native';

import { offloadable } from 'ml-offloading';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  src: any = 'assets/example.jpg';
  humanFound: boolean = false;

  constructor(public navCtrl: NavController, public changeDetector: ChangeDetectorRef,
    public domSanitizer: DomSanitizer) {
  }

  loadImage() {
    var rects = document.getElementsByClassName('rect');
    while (rects[0]) {
      rects[0].parentNode.removeChild(rects[0])
    }

    this.humanFound = false;
    FileChooser.open()
      .then(uri => {
        let safeUrl = this.domSanitizer.bypassSecurityTrustUrl(uri);
        this.src = safeUrl;
      })
      .catch(e => console.log(e));
  }

  humanOrAlien() {
    var img = tracking.one(document.getElementById('img'));
    var width = img.width;
    var height = img.height;
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, width, height);
    var imageData: any[] = Array.from(context.getImageData(0, 0, width, height).data);

    var results = this.findObjects(imageData, width, height);

    for (let r of results) {
      this.plot(r[0], r[1], r[2], r[3]);
    }
    this.humanFound = true;
  }

  //@offloadable
  findObjects(imageData, width, height): any[] {
    var results: any[] = [];
    var uint8ImageData = new Uint8ClampedArray(imageData);

    var tracker = new tracking.ObjectTracker(['face', 'eye', 'mouth']);
    var task = new tracking.TrackerTask(tracker);
    tracker.setStepSize(1.7);

    tracker.on('track', function(event) {
      event.data.forEach(function(rect) {
        results.push([rect.x, rect.y, rect.width, rect.height]);
      });
      task.stop();
    });

    task.on('run', function() {
      tracker.track(uint8ImageData, width, height);
    });
    task.run();

    while (task.inRunning()) {
      // wait
    }
    return results;
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
