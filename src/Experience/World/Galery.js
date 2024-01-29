import * as THREE from 'three'

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

        this.images = []; // Tableau pour stocker les instances d'Image
        this.imagesElements = document.querySelectorAll('.img');
        this.textures = Object.values(this.resources.items)

        this.createImages()
        this.scene.add(this.group);

        window.addEventListener('wheel', (e) => {
            this.scroll.scroll.current += e.deltaY
            // console.log(e.deltaY)
        })
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
            fragmentShader, this.group)
    imageInstance.mesh.position.y = -imageBounds.top + this.sizes.height / 2 - imageBounds.height / 2;
    imageInstance.mesh.position.x =  imageBounds.left - this.sizes.width /2 + imageBounds.width / 2;
    
    this.images.push(imageInstance);
})

// this.group.position.y = -(this.images[0].geometry.parameters.height * this.spacing) * (this.images.length - 1);

    }

    resize() {
        this.imagesElements.forEach((htmlElement, i) => {
            const newBounds = htmlElement.getBoundingClientRect();
    
            // Mise à jour de la taille de l'instance de l'image
            const imageInstance = this.images[i];

            // imageInstance.mesh.position.y = i * (newBounds.height * this.spacing);

            imageInstance.updateSize({ width: newBounds.width, height: newBounds.height });
        });
        this.group.position.y = -(this.images[0].geometry.parameters.height * this.spacing) * (this.images.length - 1);
    }

    update () {

// console.log(this.scroll.scroll.current)
   // Déplacer le groupe vers le haut
// this.group.position.y += this.time.elapsed * 0.0005;

   // Déplacer le groupe vers le bas
   this.group.position.y =  this.scroll.scroll.current ;

//    Hauteur totale de la galerie
   const totalHeight = this.images.length * this.images[0].geometry.parameters.height * this.spacing;

   this.images.forEach(image => {
       image.update();

       // Vérifiez si l'image est trop basse
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