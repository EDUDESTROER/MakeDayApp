function loadSvg(){

    fetch('./../img/Index_Background.svg')
    .then((response) => {return response.text();})
    .then((svg) =>{
        document.getElementById('bg-florest').innerHTML = svg;
        document.getElementById('Cloud').style.opacity = 0;
        document.getElementById('WhiteGround').style.opacity = 0;
        document.getElementById('Cloud').style.transform = 'translateY(330px)';
        document.querySelector('#bg-florest svg').setAttribute("preserveAspectRatio", "xMidYMax slice");
        document.querySelector('#bg-florest').setAttribute("preserveAspectRatio", "xMidYMax slice");
        setAnimationScroll();
    })
    .catch((err)=>{

        console.error(err);

    });


}

loadSvg();

changeOrder();

function setAnimationScroll(){

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({

        trigger: ".typewrite-animation-t1",
        start: "top 90%",
        onEnter: () => resetTyping(document.querySelector(".typewrite-animation-t1"), "typewrite-animation-t1"),
        onEnterBack: () => resetTyping(document.querySelector(".typewrite-animation-t1"), "typewrite-animation-t1")

    });

    ScrollTrigger.create({

        trigger: ".typewrite-animation-t2",
        start: "top 90%",
        onEnter: () => resetTyping(document.querySelector(".typewrite-animation-t2"), "typewrite-animation-t2"),
        onEnterBack: () => resetTyping(document.querySelector(".typewrite-animation-t2"), "typewrite-animation-t2")

    });

    ScrollTrigger.create({

        trigger: ".typewrite-animation-t3",
        start: "top 90%",
        onEnter: () => resetTyping(document.querySelector(".typewrite-animation-t3"), "typewrite-animation-t3"),
        onEnterBack: () => resetTyping(document.querySelector(".typewrite-animation-t3"), "typewrite-animation-t3")

    });

    let runAnimation = gsap.timeline({

        scrollTrigger: {

            trigger: "#bg-florest",
            start: "top top",
            end: "+=800",
            scrub: true,
            pin: true,
            pinSpacing: false,
            onEnterBack: () => { resetTyping(document.querySelector(".typewrite-animation-v1"), "typewrite-animation-v1");}

        }

    });

    runAnimation.add([
        gsap.to("#bg-florest svg", 4, {
            scale: 1.2
        })
    ])
    .add([
        gsap.to("#BackTrees", 4, {
            y: -70
        }),
        gsap.to("#Trees", 4, {
            y: -150
        }),
        gsap.to("#Grounds", 4, {
            y: -200
        }),
        gsap.to("#FrontMontains", 4, {
            y: -260
        }),
        gsap.to("#Cloud", 5, {
            y: 0,
            opacity: 100,
            zIndex: 200
        }),
        gsap.to("#WhiteGround", 5, {
            y: -50,
            opacity: 100
        })
    ]);

}

function resetTyping(el, className) {

    let textEl = el;

    textEl.classList.remove(className);

    void textEl.offsetWidth;

    textEl.classList.add(className);

}

function changeOrder(){

    let topEl = document.querySelectorAll('.top-list');
    let mainEl = document.querySelectorAll('.main-list');
    let bottomEl = document.querySelectorAll('.bottom-list');

    let elList1 = [topEl[0], mainEl[0], bottomEl[0]];
    let elList2 = [topEl[1], mainEl[1], bottomEl[1]];

    //console.log('Change order List: ', elList);

    setInterval(()=>{

        elList1.forEach(el=>{

            //console.log('el: ', el);

            void el.offsetWidth;

            if (el.classList.contains("top-list")) {

                el.classList.remove("top-list");
                el.classList.add("main-list");

            } else if (el.classList.contains("main-list")) {

                el.classList.remove("main-list");
                el.classList.add("bottom-list");

            } else if (el.classList.contains("bottom-list")) {

                el.classList.remove("bottom-list");
                el.classList.add("top-list");

            }

        });

    }, 5000);

    setInterval(()=>{

        elList2.forEach(el=>{

            //console.log('el: ', el);

            void el.offsetWidth;

            if (el.classList.contains("top-list")) {

                el.classList.remove("top-list");
                el.classList.add("main-list");

            } else if (el.classList.contains("main-list")) {

                el.classList.remove("main-list");
                el.classList.add("bottom-list");

            } else if (el.classList.contains("bottom-list")) {

                el.classList.remove("bottom-list");
                el.classList.add("top-list");

            }

        });

    }, 5000);

}