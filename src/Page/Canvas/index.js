import { WebGLRenderer } from 'three/src/renderers/WebGLRenderer';
import { OrthographicCamera } from 'three/src/cameras/OrthographicCamera';
import { Scene } from 'three/src/scenes/Scene';
import { PlaneGeometry } from 'three/src/geometries/PlaneGeometry';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { ShaderMaterial } from 'three/src/materials/ShaderMaterial';
import { Mesh } from 'three/src/objects/Mesh';
import { Vector2 } from 'three/src/math/Vector2';

import vertexSource from './shaders/shader.vert';
import fragmentSource from './shaders/shader.frag';


export default class Canvas {
  constructor({ w, h, dpr, eContainer, imageUrls }) {
    this.w = w;
    this.h = h;

    this.renderer = new WebGLRenderer();
    this.renderer.setSize(this.w, this.h);
    this.renderer.setPixelRatio(dpr);

    eContainer.appendChild(this.renderer.domElement);

    this.camera = new OrthographicCamera(-1, 1, 1, -1, 0, -1);

    const geo = new PlaneGeometry(2, 2, 1, 1);

    const loader = new TextureLoader();
    this.textures = imageUrls.map(url => loader.load(url));// urlからテクスチャ読み込み

    this.uniforms = {
      uTime: {
        value: 0.0
      },
      uFixAspect: {
        value: this.h / this.w
      },
      uProgress: {
        value: 0.0
      },
      uAccel: {
        value: new Vector2(0.5, 2.0)
      },
      uTex0: {
        value: this.textures[0]
      },
      uTex1: {
        value: this.textures[1]
      }
    };

    const mat = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexSource,
      fragmentShader: fragmentSource
    });

    const mesh = new Mesh(geo, mat);

    this.scene = new Scene();
    this.scene.add(mesh);

    this.render();
  }

  isValidTextureIndex(index) {
    const isValid = (index >= 0 && index < this.textures.length);
    if(!isValid) console.log(`${ index } is not valid texture index!`);
    return isValid;
  }

  set textureIndex0(index) {
    if(this.isValidTextureIndex(index)) {
      this.uniforms.uTex0.value = this.textures[index];
    }
  }

  set textureIndex1(index) {
    if(this.isValidTextureIndex(index)) {
      this.uniforms.uTex1.value = this.textures[index];
    }
  }

  update() {
    const sec = performance.now() / 1000;
    this.uniforms.uTime.value = sec;
  }

  render() {
    this.renderer.render( this.scene, this.camera );
  }

  resize(w, h) {
    this.w = w;
    this.h = h;

    this.renderer.setSize(this.w, this.h);
    this.uniforms.uFixAspect.value = this.h / this.w;

    this.camera.updateProjectionMatrix();
  }
};
