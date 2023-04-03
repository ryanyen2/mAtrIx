import { atom } from "recoil";

export const barChartData = atom({
    key: "barChartData",
    default: [12, 5, 6, 6, 9, 10],
});


// export const regretPlotParam = atom({
//     key: "regretPlotParam",
//     default: {
//         epsilon: 0.05,
//         c: 2,
//         m: 0,
//         nu: 1,
//         alpha: [1, 10],
//         beta: 1,
//         repeats: 100
//     }
// });


export const regretPlotData = atom({
    key: "regretPlotData",
    default: {
        times: [],
        regrets: [],
        current_time: 0,
        current_regret: {}
    }
});


export const allRegretPlotData = atom({
    key: "allRegretPlotData",
    default: {
        times: [],
        regrets: []
    }
});


export const currentAlgorithm = atom({
    key: "currentAlgorithm",
    default: {
        name: "ucb",
        code: "",
        math: "",
    }
});


export const currentStep = atom({
    key: "currentStep",
    default: {
        step: 0,
        regretPlotData: {},
        distributionPlotData: {},
        startCodeFlow: false,
        mathBlock: {},
    }
});

export const armTags = atom({
    key: "armTags",
    default: {
        cat: 0,
        dog: 1,
        panda: 2,
        alpaca: 3
    }
})

export const modelTypeID = atom({
    key: "modelTypeID",
    default: {
        egreedy: 0,
        ucb: 1,
        thompson: 2
    }
})

export const banditInfo = atom({
    key: "banditInfo",
    default: {
        model: null,
        model_name: "N/A",
        model_id: 2, //0 = EGreedy, 1 = UCB, 2 = Thompson Sampling
        n_arms: 0, // Number of Arms, we can set at init
        parameters: {},
        steps: [],
        cur_step: 0, // Index of current step
        cur_arm: 0, // Index tag of current arm
    }
})

export const allSettingsParam = atom({
    key: "allSettingsParam",
    default: {
        currentMode: "manual",  //manual, automatic, slow-demo
        currentAlgorithm: "thompson-sampling",  //ucb, thompson-sampling, epsilon-greedy
        regretPlotParam: {
            epsilon: 0.05,
            c: 2,
            m: 0,
            nu: 1,
            alpha: [1, 10],
            beta: 1,
            repeats: 100
        },
        targetProbability: {
            cat: 0.3,
            dog: 0.7,
            panda: 0.65,
            alpaca: 0.45
        }
    }
})