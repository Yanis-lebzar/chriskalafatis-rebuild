import Lenis from "@studio-freight/lenis";
import EventEmitter from "./EventEmitter.js";
import Sizes from "./Sizes.js";
import Time from "./Time.js";


export default class Scroll extends EventEmitter {

    constructor() {

        super()
this.time = new Time()
        this.lenis = new Lenis({

            duration: 2.5,

      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),

      direction: 'vertical', // vertical, horizontal

      gestureDirection: 'vertical', // vertical, horizontal, both

      smooth: true,

      mouseMultiplier: 1,

      smoothTouch: false,

      touchMultiplier: 2,

      infinite: false
          })
      
          this.scroll = {
            progress: 0,
            velocity: 0,
            current: 0,
            scroll: 0,
            direction: -1,
            target: 0
          }
          
          this.lenis.on('scroll', (e) => {
            // console.log(e)
            // this.scroll.current = e.actualScroll
            // this.scroll.target = e.targetScroll
            // this.scroll.scroll = e.scroll
            // this.scroll.velocity = e.velocity
            // this.scroll.progress = e.progress
            // this.scroll.direction = e.direction
                  })

                

    }

    raf(time) {
        this.lenis.raf(time)
      }
      
}