import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(ScrollTrigger)

let scrollContainer = document.querySelector('.scroll-container') as HTMLElement
let image = document.querySelector('.image-size-wrap img') as HTMLElement
let points = [...document.querySelectorAll<HTMLElement>('.point')]
let scrollItems = [...document.querySelectorAll<HTMLElement>('.scroll-item')]

type Step = {
    // pos: { left: number; top: number }
    pos: [number, number]
    offset?: [number, number]
    el?: HTMLElement
    pointTl?: gsap.core.Timeline
    scale: number
    scroll: HTMLElement
}

let steps: Step[] = [
    {
        pos: [50, 50],
        scale: 1,
        scroll: scrollItems[0],
    },
    {
        pos: [23, 63],
        offset: [20, -20],
        el: points[0],
        scale: 2,
        scroll: scrollItems[1],
    },

    {
        pos: [32.5, 45],
        el: points[1],
        scale: 3.5,
        offset: [25, 0],
        scroll: scrollItems[2],
    },
    {
        pos: [55.5, 38],
        el: points[2],
        scale: 2,
        scroll: scrollItems[3],
    },
    {
        pos: [75, 10],
        el: points[3],
        scale: 1,
        scroll: scrollItems[4],
    },
]

if (points.length < steps.length - 1 || scrollItems.length < steps.length) {
    throw new Error('Mismatch in number of points, steps, and scroll items')
}

const animPointIn = (point: HTMLElement) => {
    let isLeft = point.classList.contains('point-left')
    let s = gsap.utils.selector(point)
    return gsap
        .timeline({ paused: true, defaults: { ease: 'power3.out' } })
        .fromTo(s('.point-circle'), { scale: 0 }, { scale: 1, duration: 0.2 }, '<')
        .to(
            s('.circle-outer'),
            {
                keyframes: {
                    opacity: [0, 1, 0.5],
                    scale: [0.3, 1],
                },
                duration: 0.7,
            },
            '<'
        )
        .fromTo(
            s('.point-line'),
            { scaleX: 0, transformOrigin: isLeft ? 'right center' : 'left center' },
            { scaleX: 1, duration: 0.3 },
            '<'
        )

        .fromTo(
            s('.point-text'),
            { opacity: 0, x: isLeft ? 20 : -20 },
            { opacity: 1, x: 0, duration: 0.3 },
            '<+0.3'
        )
}

steps.forEach((step, i) => {
    let offset = step.offset || [0, 0]
    if (step.el) {
        gsap.set(step.el, {
            left: `${step.pos[0] + offset[0]}%`,
            top: `${step.pos[1] + offset[1]}%`,
        })
        step.pointTl = animPointIn(step.el)
    }
})

const animStep = (step: Step) => {
    let offset = step.offset || [0, 0]
    new ScrollTrigger({
        // markers: true,
        trigger: step.scroll,
        start: 'top center',
        end: 'bottom center',
        onToggle: () => {
            gsap.to(image, {
                scale: step.scale,
                xPercent: (50 - step.pos[0]) * (step.scale - 1) + offset[0],
                yPercent: (50 - step.pos[1]) * (step.scale - 1) + offset[1],
                overwrite: 'auto',
            })
        },
        onEnter: () => {
            step.pointTl && gsap.delayedCall(0.3, () => step.pointTl!.timeScale(1).play())
        },
        onEnterBack: () => {
            step.pointTl && gsap.delayedCall(0.3, () => step.pointTl!.timeScale(1).play())
        },
        onLeave: () => {
            step.pointTl?.timeScale(2).reverse()
        },
        onLeaveBack: () => {
            step.pointTl?.timeScale(2).reverse()
        },
    })
}

animStep(steps[0])
animStep(steps[1])
animStep(steps[2])
animStep(steps[3])
animStep(steps[4])

// const config = { scale: 2, origin: [0.8, 0.4] }
// const vars: { [key: string]: any } = { transformOrigin: '0px 0px', ...config },
//     { scale, origin } = config,
//     clamp = gsap.utils.clamp(-100 * (scale - 1), 0)
// delete vars.origin
// vars.xPercent = clamp((0.5 - origin[0] * scale) * 100)
// vars.yPercent = clamp((0.5 - origin[1] * scale) * 100)
// vars.overwrite = 'auto'
// console.log(vars)
