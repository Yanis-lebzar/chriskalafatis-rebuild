import Experience from '../Experience.js'
import * as THREE from 'three'
import Galery from './Galery.js'

// import Environment from '../Environment.js'
// import Floor from './Floor.js'
// import Fox from './Fox.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
const testPlane = new THREE.Mesh(new THREE.PlaneGeometry(3,3,30,30), new THREE.MeshBasicMaterial({ wireframe: true }))

        // Wait for resources
        this.resources.on('ready', () =>
        {
            this.galery = new Galery()
            // Setup
            // this.scene.add(testPlane)

        })
    }
resize () {
    if (this.galery) {
        this.galery.resize()
    }
}
    update()
    {
        if (this.galery) {
            this.galery.update()
        }

    }
}