var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NavController } from 'ionic-angular';
import { FileChooser } from 'ionic-native';
var HomePage = (function () {
    function HomePage(navCtrl, changeDetector, domSanitizer) {
        this.navCtrl = navCtrl;
        this.changeDetector = changeDetector;
        this.domSanitizer = domSanitizer;
        this.src = 'assets/alien1.jpg';
        this.found = null;
        this.objects = [];
        this.colors = [];
        tracking.ColorTracker.registerColor('alien-green', function (r, g, b) {
            return r < 220 && g > 200 && b < 100;
        });
        tracking.ColorTracker.registerColor('alien-blue', function (r, g, b) {
            return r < 100 && b > 220;
        });
        tracking.ColorTracker.registerColor('alien-yellow', function (r, g, b) {
            return r > 200 && g > 200 && b < 100;
        });
        tracking.ColorTracker.registerColor('alien-grey', function (r, g, b) {
            return r > 50 && r < 100 && g > 50 && g < 100 && b > 50 && b < 100;
        });
    }
    HomePage.prototype.loadImage = function () {
        var _this = this;
        var rects = document.getElementsByClassName('rect');
        while (rects[0]) {
            rects[0].parentNode.removeChild(rects[0]);
        }
        this.found = null;
        this.objects = [];
        FileChooser.open()
            .then(function (uri) {
            var safeUrl = _this.domSanitizer.bypassSecurityTrustUrl(uri);
            _this.src = safeUrl;
        })
            .catch(function (e) { return console.log(e); });
    };
    HomePage.prototype.humanOrAlien = function () {
        var objectTracker = new tracking.ObjectTracker(['eye', 'mouth']);
        objectTracker.setStepSize(1.7);
        var t = this;
        objectTracker.on('track', function (event) {
            event.data.forEach(function (obj) {
                t.objects.push(obj);
                HomePage.plot(obj.x, obj.y, obj.width, obj.height, 'purple');
                for (var _i = 0, _a = t.colors; _i < _a.length; _i++) {
                    var rect = _a[_i];
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
        colorTracker.on('track', function (event) {
            event.data.forEach(function (rect) {
                t.colors.push(rect);
                HomePage.plot(rect.x, rect.y, rect.width, rect.height, 'green');
                for (var _i = 0, _a = t.objects; _i < _a.length; _i++) {
                    var obj = _a[_i];
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
    };
    HomePage.doesObjectIntersectWithColor = function (obj, col) {
        return (obj.x + HomePage.THRESHOLD >= col.x && obj.x + obj.width - HomePage.THRESHOLD <= col.x + col.width)
            && (obj.y + HomePage.THRESHOLD >= col.y && obj.y + obj.height - HomePage.THRESHOLD <= col.y + col.height);
    };
    HomePage.plot = function (x, y, w, h, color) {
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
    ;
    return HomePage;
}());
HomePage.THRESHOLD = 3;
HomePage = __decorate([
    Component({
        selector: 'page-home',
        templateUrl: 'home.html'
    }),
    __metadata("design:paramtypes", [NavController, ChangeDetectorRef,
        DomSanitizer])
], HomePage);
export { HomePage };
//# sourceMappingURL=home.js.map