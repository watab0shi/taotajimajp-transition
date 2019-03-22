import Canvas from './Canvas';
import { isWindows, isFirefox } from '../userAgent';

export default class Page {
  constructor() {
    // デバッグ用
    this.isDebug = true;
    if(this.isDebug) {
      this.debug = document.createElement('div');
      this.debug.setAttribute('id', 'debug');
      document.body.appendChild(this.debug);
    }

    this.w = window.innerWidth;
    this.h = window.innerHeight;
    const dpr = window.devicePixelRatio;
    const imageUrls = [
      '/resource/img/img-cat-01.jpg',
      '/resource/img/img-cat-02.jpg',
      '/resource/img/img-cat-03.jpg',
      '/resource/img/img-cat-04.jpg'
    ];
    this.numImages = imageUrls.length;

    this.canvas = new Canvas({
      w: this.w,
      h: this.h,
      dpr: dpr,
      eContainer: document.getElementById('canvas-container'),
      imageUrls: imageUrls
    });

    this.scrollSpeed = 0.0;
    this.scrollPosition = 0.0;
    this.scrollMinusOffset = 1;
    this.deltaYMult = (isWindows() && isFirefox()) ? 40 : 1;

    window.addEventListener('wheel', e => { this.wheel(e); });
    window.addEventListener('resize', e => { this.resize(); });

    this.render();
  }

  update() {
    this.scrollPosition += this.scrollSpeed;
    this.scrollSpeed *= 0.7;

    const target = Math.round(this.scrollPosition);// 四捨五入して、一番近い index を目標値に

    if(Math.abs(target - this.scrollPosition) < 0.001) {
      this.scrollPosition = target;// ある程度近づいたら、位置を固定
    }
    else {
      this.scrollPosition += (target - this.scrollPosition) * 0.03;// 遠いときは、一番近い index にゆっくり近づける
    }

    const size = this.numImages;
    let currentIndex = Math.floor(this.scrollPosition) % size;
    let nextIndex = (currentIndex + 1) % size;

    // this.scrollPositionがマイナスのときは、sizeから引いてマイナスならないように
    if(this.scrollPosition < 0) {
      currentIndex = (size * this.scrollMinusOffset - Math.abs(Math.floor(this.scrollPosition))) % size;

      // マイナスインデックスになったら、プラスになるように再計算
      if(currentIndex < 0) {
        ++this.scrollMinusOffset;
        currentIndex = (size * this.scrollMinusOffset - Math.abs(Math.floor(this.scrollPosition))) % size;
      }

      nextIndex = (currentIndex + 1) % size;
    }

    // デバッグ表示
    if(this.isDebug) {
        this.debug.innerHTML = `
pos: ${ this.scrollPosition.toFixed(3) }<br>
tgt: ${ target }<br>
cur: ${ currentIndex }<br>
nxt: ${ nextIndex }`;
    }

    // canvasを更新
    this.canvas.update();
    this.canvas.uniforms.uProgress.value = this.scrollPosition;
    this.canvas.textureIndex0 = currentIndex;
    this.canvas.textureIndex1 = nextIndex;
  }

  render() {
    requestAnimationFrame( () => { this.render(); } );
    this.update();

    this.canvas.render();
  }

  wheel(e) {
    let deltaY = (e.wheelDelta !== NaN) ? e.deltaY : -e.wheelDelta;
    if(this.isWinFirefox) deltaY *= 40;

    this.scrollSpeed += deltaY * 0.0002;
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.canvas.resize(this.w, this.h);
  }
};
