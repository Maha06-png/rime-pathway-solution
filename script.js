/* =========================================
   PATHWAY EXPLORER
   Interactive Synaptic Memory Simulation
========================================= */


/* =========================================
   DOM ELEMENTS
========================================= */

const activitySlider =
    document.getElementById("activitySlider");

const decaySlider =
    document.getElementById("decaySlider");

const activityValue =
    document.getElementById("activityValue");

const decayValue =
    document.getElementById("decayValue");

const runButton =
    document.getElementById("runExperiment");

const resetButton =
    document.getElementById("resetExperiment");

const exploreButton =
    document.getElementById("exploreBtn");

const startButton =
    document.getElementById("startBtn");

const challengeButton =
    document.getElementById("challengeBtn");

const learnButton =
    document.getElementById("learnBtn");


/* =========================================
   METRIC ELEMENTS
========================================= */

const memoryValue =
    document.getElementById("memoryValue");

const connectionValue =
    document.getElementById("connectionValue");

const stabilityValue =
    document.getElementById("stabilityValue");

const memoryProgress =
    document.getElementById("memoryProgress");

const connectionProgress =
    document.getElementById("connectionProgress");

const stabilityProgress =
    document.getElementById("stabilityProgress");

const expectedValue =
    document.getElementById("expectedValue");

const simulatedValue =
    document.getElementById("simulatedValue");

const gapValue =
    document.getElementById("gapValue");

const resultPercent =
    document.getElementById("resultPercent");

const resultTitle =
    document.getElementById("resultTitle");

const resultText =
    document.getElementById("resultText");

const timeValue =
    document.getElementById("timeValue");

const heroMemory =
    document.getElementById("heroMemory");

const activeUnits =
    document.getElementById("activeUnits");


/* =========================================
   CANVAS
========================================= */

const heroCanvas =
    document.getElementById("heroCanvas");

const heroCtx =
    heroCanvas.getContext("2d");

const simulationCanvas =
    document.getElementById("simulationCanvas");

const simulationCtx =
    simulationCanvas.getContext("2d");


/* =========================================
   NETWORK
========================================= */

let heroNodes = [];
let simulationNodes = [];

let simulationRunning = false;

let simulationTime = 0;


/* =========================================
   CANVAS RESIZE
========================================= */

function resizeCanvas(canvas) {

    const rect =
        canvas.getBoundingClientRect();

    const ratio =
        window.devicePixelRatio || 1;

    canvas.width =
        rect.width * ratio;

    canvas.height =
        rect.height * ratio;

    const ctx =
        canvas.getContext("2d");

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );
}


function resizeAll() {

    resizeCanvas(heroCanvas);
    resizeCanvas(simulationCanvas);

    createHeroNetwork();
    createSimulationNetwork();
}


window.addEventListener(
    "resize",
    resizeAll
);


/* =========================================
   CREATE HERO NETWORK
========================================= */

function createHeroNetwork() {

    const width =
        heroCanvas.clientWidth;

    const height =
        heroCanvas.clientHeight;

    heroNodes = [];

    const count = 28;

    for (let i = 0; i < count; i++) {

        heroNodes.push({

            x: Math.random() * width,

            y: Math.random() * height,

            radius: 2 + Math.random() * 3,

            speedX:
                (Math.random() - 0.5) * 0.25,

            speedY:
                (Math.random() - 0.5) * 0.25,

            strength:
                0.2 + Math.random() * 0.8

        });

    }
}


/* =========================================
   DRAW HERO NETWORK
========================================= */

function drawHeroNetwork() {

    const width =
        heroCanvas.clientWidth;

    const height =
        heroCanvas.clientHeight;

    heroCtx.clearRect(
        0,
        0,
        width,
        height
    );


    /* Connections */

    for (let i = 0; i < heroNodes.length; i++) {

        for (
            let j = i + 1;
            j < heroNodes.length;
            j++
        ) {

            const a =
                heroNodes[i];

            const b =
                heroNodes[j];

            const dx =
                a.x - b.x;

            const dy =
                a.y - b.y;

            const distance =
                Math.sqrt(
                    dx * dx + dy * dy
                );

            if (distance < 145) {

                const alpha =
                    (1 - distance / 145)
                    * 0.28
                    * ((a.strength + b.strength) / 2);

                heroCtx.beginPath();

                heroCtx.moveTo(
                    a.x,
                    a.y
                );

                heroCtx.lineTo(
                    b.x,
                    b.y
                );

                heroCtx.strokeStyle =
                    `rgba(140,145,255,${alpha})`;

                heroCtx.lineWidth =
                    1 + a.strength * 1.3;

                heroCtx.stroke();
            }
        }
    }


    /* Nodes */

    heroNodes.forEach(node => {

        node.x += node.speedX;
        node.y += node.speedY;

        if (
            node.x < 0 ||
            node.x > width
        ) {
            node.speedX *= -1;
        }

        if (
            node.y < 0 ||
            node.y > height
        ) {
            node.speedY *= -1;
        }


        heroCtx.beginPath();

        heroCtx.arc(
            node.x,
            node.y,
            node.radius,
            0,
            Math.PI * 2
        );

        heroCtx.fillStyle =
            `rgba(150,155,255,${0.4 + node.strength * 0.6})`;

        heroCtx.shadowBlur =
            15 * node.strength;

        heroCtx.shadowColor =
            "rgba(130,135,255,0.8)";

        heroCtx.fill();

        heroCtx.shadowBlur = 0;

    });


    requestAnimationFrame(
        drawHeroNetwork
    );
}


/* =========================================
   SIMULATION NETWORK
========================================= */

function createSimulationNetwork() {

    const width =
        simulationCanvas.clientWidth;

    const height =
        simulationCanvas.clientHeight;

    simulationNodes = [];

    const count = 22;

    for (let i = 0; i < count; i++) {

        simulationNodes.push({

            x:
                40 +
                Math.random() *
                (width - 80),

            y:
                40 +
                Math.random() *
                (height - 80),

            radius:
                3 + Math.random() * 3,

            strength:
                Math.random(),

            pulse:
                Math.random() * Math.PI * 2

        });

    }
}


/* =========================================
   DRAW SIMULATION
========================================= */

function drawSimulation() {

    const width =
        simulationCanvas.clientWidth;

    const height =
        simulationCanvas.clientHeight;

    simulationCtx.clearRect(
        0,
        0,
        width,
        height
    );


    /* subtle grid */

    simulationCtx.strokeStyle =
        "rgba(255,255,255,0.025)";

    simulationCtx.lineWidth = 1;

    const gridSize = 45;

    for (
        let x = 0;
        x < width;
        x += gridSize
    ) {

        simulationCtx.beginPath();

        simulationCtx.moveTo(x, 0);
        simulationCtx.lineTo(x, height);

        simulationCtx.stroke();

    }


    for (
        let y = 0;
        y < height;
        y += gridSize
    ) {

        simulationCtx.beginPath();

        simulationCtx.moveTo(0, y);
        simulationCtx.lineTo(width, y);

        simulationCtx.stroke();

    }


    /* Connections */

    for (
        let i = 0;
        i < simulationNodes.length;
        i++
    ) {

        for (
            let j = i + 1;
            j < simulationNodes.length;
            j++
        ) {

            const a =
                simulationNodes[i];

            const b =
                simulationNodes[j];

            const dx =
                a.x - b.x;

            const dy =
                a.y - b.y;

            const distance =
                Math.sqrt(
                    dx * dx + dy * dy
                );


            if (distance < 135) {

                const strength =
                    (a.strength + b.strength)
                    / 2;

                const alpha =
                    (1 - distance / 135)
                    * (0.08 + strength * 0.35);

                simulationCtx.beginPath();

                simulationCtx.moveTo(
                    a.x,
                    a.y
                );

                simulationCtx.lineTo(
                    b.x,
                    b.y
                );

                simulationCtx.strokeStyle =
                    `rgba(130,135,255,${alpha})`;

                simulationCtx.lineWidth =
                    0.5 + strength * 2.2;

                simulationCtx.stroke();
            }
        }
    }


    /* Nodes */

    simulationNodes.forEach(node => {

        node.pulse += 0.025;

        const pulse =
            Math.sin(node.pulse) * 0.5 + 0.5;

        simulationCtx.beginPath();

        simulationCtx.arc(
            node.x,
            node.y,
            node.radius + pulse * 1.5,
            0,
            Math.PI * 2
        );

        simulationCtx.fillStyle =
            `rgba(145,150,255,${0.3 + node.strength * 0.7})`;

        simulationCtx.shadowBlur =
            node.strength * 20;

        simulationCtx.shadowColor =
            "rgba(130,135,255,0.7)";

        simulationCtx.fill();

        simulationCtx.shadowBlur = 0;

    });


    requestAnimationFrame(
        drawSimulation
    );
}


/* =========================================
   CALCULATE EXPERIMENT
========================================= */

function calculateExperiment() {

    const activity =
        Number(activitySlider.value);

    const decay =
        Number(decaySlider.value);


    /*
        Educational toy model:

        Memory increases with activity.

        Memory decreases with decay.

        We deliberately keep the calculation
        simple enough for the learner to inspect.
    */

    let memory =
        activity * 0.82
        + (100 - decay) * 0.18;


    memory =
        Math.max(
            0,
            Math.min(
                100,
                memory
            )
        );


    const connection =
        activity * 0.7
        + memory * 0.3;


    const stability =
        100
        - decay * 0.55
        + activity * 0.15;


    const expected =
        Math.round(
            activity * 0.75
            + (100 - decay) * 0.25
        );


    const simulated =
        Math.round(memory);


    const gap =
        Math.abs(
            expected - simulated
        );


    return {

        memory:
            Math.round(memory),

        connection:
            Math.round(
                Math.min(100, connection)
            ),

        stability:
            Math.round(
                Math.max(
                    0,
                    Math.min(100, stability)
                )
            ),

        expected,

        simulated,

        gap

    };
}


/* =========================================
   UPDATE UI
========================================= */

function updateExperimentUI() {

    const result =
        calculateExperiment();


    activityValue.textContent =
        `${activitySlider.value}%`;

    decayValue.textContent =
        `${decaySlider.value}%`;


    memoryValue.textContent =
        `${result.memory}%`;

    connectionValue.textContent =
        `${result.connection}%`;

    stabilityValue.textContent =
        `${result.stability}%`;


    memoryProgress.style.width =
        `${result.memory}%`;

    connectionProgress.style.width =
        `${result.connection}%`;

    stabilityProgress.style.width =
        `${result.stability}%`;


    expectedValue.textContent =
        `${result.expected}%`;

    simulatedValue.textContent =
        `${result.simulated}%`;

    gapValue.textContent =
        `${result.gap}%`;


    resultPercent.textContent =
        result.simulated;


    heroMemory.textContent =
        `${result.memory}%`;


    if (result.memory >= 70) {

        resultTitle.textContent =
            "The network remembered.";

        resultText.textContent =
            "Recent activity strongly modified the network state. " +
            "Several connections now carry information about what " +
            "happened earlier.";

    }

    else if (result.memory >= 40) {

        resultTitle.textContent =
            "The network partially remembered.";

        resultText.textContent =
            "Some of the recent signal survives in the network, " +
            "but decay and interference have reduced the memory.";

    }

    else {

        resultTitle.textContent =
            "The network forgot.";

        resultText.textContent =
            "Decay is strong enough that most of the recent signal " +
            "has disappeared from the current network state.";

    }


    if (result.gap <= 5) {

        document.getElementById(
            "gapText"
        ).textContent =
            "The simulated state closely follows the reference.";

    } else {

        document.getElementById(
            "gapText"
        ).textContent =
            "The difference shows how the simplified network " +
            "departs from the reference expectation.";

    }
}


/* =========================================
   SLIDER EVENTS
========================================= */

activitySlider.addEventListener(
    "input",
    updateExperimentUI
);

decaySlider.addEventListener(
    "input",
    updateExperimentUI
);


/* =========================================
   RUN EXPERIMENT
========================================= */

runButton.addEventListener(
    "click",
    () => {

        simulationRunning = true;

        simulationTime = 0;

        timeValue.textContent = "0";

        const result =
            calculateExperiment();


        simulationNodes.forEach(node => {

            node.strength =
                Math.random()
                *
                (result.memory / 100);

        });


        updateExperimentUI();


        let current =
            0;

        const interval =
            setInterval(
                () => {

                    current++;

                    simulationTime =
                        current;

                    timeValue.textContent =
                        current;


                    simulationNodes.forEach(node => {

                        const activity =
                            Number(
                                activitySlider.value
                            ) / 100;

                        const decay =
                            Number(
                                decaySlider.value
                            ) / 100;


                        node.strength +=
                            activity *
                            0.008;

                        node.strength -=
                            decay *
                            0.004;


                        node.strength =
                            Math.max(
                                0.05,
                                Math.min(
                                    1,
                                    node.strength
                                )
                            );

                    });


                    if (current >= 100) {

                        clearInterval(
                            interval
                        );

                        simulationRunning =
                            false;
                    }

                },
                40
            );

    }
);


/* =========================================
   RESET
========================================= */

resetButton.addEventListener(
    "click",
    () => {

        activitySlider.value = 60;

        decaySlider.value = 30;

        simulationTime = 0;

        timeValue.textContent = "0";

        createSimulationNetwork();

        updateExperimentUI();

    }
);


/* =========================================
   SCROLL BUTTONS
========================================= */

exploreButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("experiment")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


startButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("concept")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


learnButton.addEventListener(
    "click",
    () => {

        document
            .getElementById("concept")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================
   CHALLENGE
========================================= */

challengeButton.addEventListener(
    "click",
    () => {

        activitySlider.value = 85;

        decaySlider.value = 90;

        updateExperimentUI();

        document
            .getElementById("experiment")
            .scrollIntoView({
                behavior: "smooth"
            });

    }
);


/* =========================================
   HERO NETWORK STATS
========================================= */

function updateHeroStats() {

    if (!heroNodes.length) {
        return;
    }

    const active =
        heroNodes.filter(
            node => node.strength > 0.55
        ).length;

    activeUnits.textContent =
        String(active).padStart(2, "0");

    heroMemory.textContent =
        `${calculateExperiment().memory}%`;

}


setInterval(
    updateHeroStats,
    1000
);


/* =========================================
   INITIALIZE
========================================= */

function initialize() {

    resizeAll();

    updateExperimentUI();

    drawHeroNetwork();

    drawSimulation();

}


initialize();
