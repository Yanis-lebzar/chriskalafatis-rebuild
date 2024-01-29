import * as THREE from 'three'
import Experience from './Experience.js'

export default class Image
{
    constructor(element, imageName, imageSize, vertexShader, fragmentShader,scene)
    {
        this.experience = new Experience()
        this.scene = scene
        this.sizes = this.experience.sizes
        this.resources = this.experience.resources
        this.camera = this.experience.camera
        this.time = this.experience.time

        this.texturesWidth = 0
        this.texturesHeight = 0
        
// console.log(element)
this.element = element
this.borderRadiusValue = 0

        this.img = imageName
        this.vertexShader = vertexShader
        this.fragmentShader = fragmentShader
        this.setGeometry(imageSize)
        this.setTextures(imageName)
        this.setMaterial(imageSize)
        this.getBorderRadius()
        this.setMesh()

    }

    setGeometry(imageSize)
    {
        this.geometry = new THREE.PlaneGeometry(imageSize.width, imageSize.height, 32, 32)
    }

    setTextures(imageName)
    {
        if(imageName === '')
        {
            return
        }
        this.textures = {}
        this.textures.needsUpdate = true

        this.textures = imageName
        this.texturesWidth = this.textures.image.width
        this.texturesHeight = this.textures.image.height
    }

    resize () {
    }
    updateSize(newSize) {
        // Supprimer l'ancienne géométrie
        this.geometry.dispose();
    
        // Créer une nouvelle géométrie avec la nouvelle taille
        this.geometry = new THREE.PlaneGeometry(newSize.width, newSize.height, 32, 32);
    
        // Appliquer la nouvelle géométrie au mesh
        this.mesh.geometry = this.geometry;

        // this.material.uniforms.uGeometrySize.value.x = newSize.width / this.sizes.width;
        // this.material.uniforms.uGeometrySize.value.y = newSize.height / this.sizes.height;
        this.material.uniforms.uGeometrySize.value = new THREE.Vector2(newSize.width, newSize.height);
        this.getBorderRadius()

    }

    getBorderRadius () {
        const computedStyle = getComputedStyle(this.element) 
        let borderRadiusValue = parseFloat(computedStyle.getPropertyValue('border-radius'))
    
        // Convertir en pixels si la valeur est en 'rem'
        if (computedStyle.getPropertyValue('border-radius').endsWith('rem')) {
          borderRadiusValue *= parseFloat(getComputedStyle(document.documentElement).fontSize)
        }
        this.borderRadiusValue = borderRadiusValue
        // console.log(this.borderRadiusValue)
        this.material.uniforms.uBorderRadius.value = this.borderRadiusValue
      }

    setMaterial(size)
    {
        this.material = new THREE.ShaderMaterial({
            transparent: true,
            // wireframe:true,
            side: THREE.DoubleSide,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            uniforms: {
                uTexture: { value: this.textures },
                uGeometrySize: { value: new THREE.Vector2(1,1) },
                uBorderRadius: { value: this.borderRadiusValue },
                uImageSize: { value: new THREE.Vector2(this.texturesWidth, this.texturesHeight) },
                uTime: { value: 0 },
            },
            defines: 
            {
                PR: Math.min(window.devicePixelRatio.toFixed(1), 2)
            }
        })


        this.material.uniforms.uGeometrySize.value = new THREE.Vector2(size.width, size.height);

        console.log(this.material.uniforms.uGeometrySize)

    }

    setMesh()
    {
        this.mesh = new THREE.Mesh(this.geometry, this.material)
        this.scene.add(this.mesh)
    }

    update()
    {
        this.material.uniforms.uTime.value = this.time.elapsed * 0.001

    }
}