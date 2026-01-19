function loadSvg(){

    fetch('./../icons/Error.svg')
    .then((response) => {return response.text();})
    .then((svg) =>{
        document.getElementById('svg-wrapper').innerHTML = svg;
        setAnimationScroll();
    })
    .catch((err)=>{

        console.error(err);

    });


}

function setAnimationScroll(){

    gsap.registerPlugin(ScrollTrigger);

    
    let runAnimation = gsap.timeline();

    runAnimation.add([
        gsap.to("#svg-wrapper", 4, {
            scale: 0.9
        })
    ])
    .add([
        gsap.to("#P2", 4, {
            rotation: 360,
            duration: 3,
            transformOrigin: "50% 50%",
            repeat: -1,
            ease: "none"
        })
    ]);

}

loadSvg();