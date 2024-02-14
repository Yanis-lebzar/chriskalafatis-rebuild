import * as THREE from 'three'
import gsap from 'gsap'

import Experience from "../Experience.js";
import Image from "../Image.js";
import vertexShader from "../Shaders/vertex.glsl";
import fragmentShader from "../Shaders/fragment.glsl";
import Sizes from "../Utils/Sizes.js";
import Scroll from '../Utils/Scroll.js';

export default class Galery {
    constructor () {

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.sizes = new Sizes()
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.scroll = new Scroll();
        this.group = new THREE.Group();

        this.imageElement = document.querySelector('.img');
        this.images = []; // Tableau pour stocker les instances d'Image
        this.imagesElements = document.querySelectorAll('.img');
        this.minimaps = document.querySelectorAll('.minimap__line');
        this.textures = Object.values(this.resources.items)
        this.labels = document.querySelectorAll('.slider__label__li')
this.label = document.querySelector('.slider__label ul')
this.label.sizes = this.labels[0].getBoundingClientRect()
        this.objs = Array(this.minimaps.length).fill({dist:0})

        this.createImages()

        this.scene.add(this.group);

        this.currentHeight = 0;

        this.y = {
            current: 0,
            target: 0,
            lerp: 0.1,
            round: 0
          }

this.uProgress = { value: 0 }
        this.imageElement.addEventListener('mouseenter', () => {

            this.images.forEach(image => {

                gsap.to(image.material.uniforms.uProgress, {
                    value: 1,
                    duration: 1,
                    ease: 'power3.inOut'
                })

            })
        })
        this.imageElement.addEventListener('mouseleave', () => {
            
            this.images.forEach(image => {

                gsap.to(image.material.uniforms.uProgress, {
                    value: 0,
                    duration: 1,
                    ease: 'power3.inOut'
                })

            })
        })

        this.getMarginBottom(this.imageElement)
            window.addEventListener('wheel', (e) => {

                this.y.target += e.deltaY * 0.0001

            // clearTimeout(this.isScrolling);
            // this.isScrolling = setTimeout(() => {
            //     this.snapToClosestPosition();
            // }, 66); // Temps en ms pour déterminer la fin du scroll
       
        })
    }
    
    getMarginBottom (element) {
        const elementBounds = element.getBoundingClientRect();

        let style = window.getComputedStyle(element);
        let marginBottom = parseFloat(style.marginBottom);
        // Convertir la marge en pixels si elle est en 'rem'
        let fontSize = parseFloat(window.getComputedStyle(document.documentElement).fontSize);
        let marginBottomInPixels = parseFloat(marginBottom) * fontSize;
        // console.log(marginBottom)
        this.currentHeight = elementBounds.height + marginBottom ;

    }

    createImages () {


        this.spacing = 1.4; // Espacement entre les images, ajustez selon vos besoins

        let yOffset = 0; // Décalage initial en Y// const spacing = 4;

this.imagesElements.forEach((image, i) => {
  const imageBounds =   image.getBoundingClientRect()
  const textureName = image.dataset.texture;
  const texture = this.resources.items[textureName];

    const imageInstance = new Image(image, texture, 
            {
             width: imageBounds.width,
            height: imageBounds.height
            }, 
            vertexShader, 
            fragmentShader, 
            this.group, 
            this.uProgress)
    imageInstance.mesh.position.y = -imageBounds.top + this.sizes.height / 2 - imageBounds.height / 2;
    imageInstance.mesh.position.x =  imageBounds.left - this.sizes.width /2 + imageBounds.width / 2;
    
    this.images.push(imageInstance);
})


    }

    resize() {
        this.getMarginBottom(this.imageElement)
        this.label.sizes = this.labels[0].getBoundingClientRect()

        setTimeout(() => {

       
        this.imagesElements.forEach((htmlElement, i) => {
            const newBounds = htmlElement.getBoundingClientRect();
    
            // Mise à jour de la taille de l'instance de l'image
            const imageInstance = this.images[i];

            imageInstance.updateSize({ width: newBounds.width, height: newBounds.height });

            imageInstance.mesh.position.y = -newBounds.top + this.sizes.height / 2 - newBounds.height / 2;
            imageInstance.mesh.position.x =  newBounds.left - this.sizes.width /2 + newBounds.width / 2;
        });
    }, 100);
    }

 
    update () {

        // this.y.current = gsap.utils.interpolate(this.y.current, this.y.target, this.y.lerp)
        this.y.current += this.y.target
        this.y.target *= 0.8
        this.y.round = Math.round(this.y.current);

        let diff = (this.y.round - this.y.current);

        this.y.current += Math.sign(diff) * Math.pow(Math.abs(diff),0.9) * 0.015
        this.y.current = (this.y.current + this.objs.length) % this.objs.length;
        
        this.label.style.transform = `translateY(${ - this.label.sizes.height *this.y.current}px)`


        
        this.objs.forEach((obj, i) => {
           let directDist = Math.abs(this.y.current - i);
        let reverseDist = this.objs.length - directDist;
        obj.dist = Math.min(directDist, reverseDist);

        obj.dist = Math.min(obj.dist, 1);
        obj.dist = 1 - obj.dist ** 2;

        this.minimaps[i].style.transform = `scale(${1 + 0.4 * obj.dist})`;
        this.minimaps[i].style.opacity = `${0.5 * obj.dist + 0.5}`;
this.labels[i].style.opacity = `${1 * obj.dist }`;


        // this.images[i].sizes.height = Math.max(obj.dist, 0.4)
        let visibleHeight = Math.max(obj.dist, 0.1);
        this.images[i].mesh.material.uniforms.visibleHeight.value = visibleHeight;

        })

   // Déplacer le groupe vers le bas
   this.group.position.y =  this.y.current * this.currentHeight ;

//    Hauteur totale de la galerie
   const totalHeight = this.images.length * this.images[0].geometry.parameters.height * this.spacing;
            

   this.images.forEach(image => {
       image.update();

// image.mesh.scale.y = image.mesh.scale.y * this.y.current*0.05      // Vérifiez si l'image est trop basse
       if (image.mesh.position.y + this.group.position.y < -totalHeight / 2) {
           // Déplacez l'image en haut de la galerie
           image.mesh.position.y += totalHeight;
       } else if (image.mesh.position.y + this.group.position.y > totalHeight / 2) {
           // Déplacez l'image en bas de la galerie
           image.mesh.position.y -= totalHeight;
       }
   });

    }

  
}