import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.fov = 35
        this.zDepth = 3

        this.heightToFit = this.heightAtZDepth()
        this.widthToFit = this.widthAtZDepth()
        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(this.fov, this.sizes.aspectRatio, 0.01, 100)
        this.instance.position.set(this.widthToFit / 2, -(this.heightToFit / 2), this.zDepth)
        this.scene.add(this.instance)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    heightAtZDepth()
    {
        // vertical fov in radians
        const vFOV = this.fov * Math.PI / 180 
        // Math.abs to ensure the result is always positive
        return 2 * Math.tan( vFOV / 2 ) * Math.abs(this.zDepth)
    }

    widthAtZDepth()
    {
        const height = this.heightAtZDepth()
        return height * this.sizes.aspectRatio
    }

    resize()
    {
        this.instance.aspect = this.sizes.aspectRatio
        this.instance.updateProjectionMatrix()
        this.heightToFit = this.heightAtZDepth()
        this.widthToFit = this.widthAtZDepth()
    }

    update()
    {
        if(this.controls)
        {
            this.controls.update()
        }
    }
}