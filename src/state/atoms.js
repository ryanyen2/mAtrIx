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


// export const currentAlgorithm = atom({
//     key: "currentAlgorithm",
//     default: {
//         name: "ucb",
//         code: "",
//         math: "",
//     }
// });


// export const currentStep = atom({
//     key: "currentStep",
//     default: {
//         step: 0,
//         regretPlotData: {},
//         distributionPlotData: {},
//         startCodeFlow: false,
//         mathBlock: {},
//     }
// });

export const armTags = atom({
    key: "armTags",
    default: {
        cat: 0,
        dog: 1,
        panda: 2,
        alpaca: 3
    }
})

export const armTagNames = atom({
    key: "armTagNames",
    default: [
        "cat",
        "dog",
        "panda",
        "alpaca"
    ]
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
        // model: null,
        model_name: "N/A",
        model_id: 2, //0 = EGreedy, 1 = UCB, 2 = Thompson Sampling
        n_arms: 0, // Number of Arms, we can set at init
        parameters: {},
        steps: [],
        cur_step: 0, // Index of current step
        cur_arm: 0, // Index tag of current arm
        regret_t: [],
    }, 
    // I don't like this but oh well
    dangerouslyAllowMutability: true
})

export const allSettingsParam = atom({
    key: "allSettingsParam",
    default: {
        currentMode: "manual",  //manual, automatic, demo
        play: false,
        resetCount: 0, // set this as a number that increases, not a toggle to avoid double triggling when setting reset back to false in useEffect
        currentAlgorithm: "thompson",  //ucb, thompson-sampling, epsilon-greedy
        regretPlotParam: {
            epsilon: 0.05,
            c: 2,
            ma: 0,
            va: 1,
            alpha: 1,
            beta: 1,
            repeats: 100
        },
        targetProbability: {
            cat: 0.34,
            dog: 0.79,
            panda: 0.645,
            alpaca: 0.458
        }
    }
})

export const triggerBanditRecord = atom({
    key: "triggerBanditRecord",
    default: {
        trigger: false,
        rewardToPass: -1
    }
})

// export const nextArmReady = atom({
//     key: "triggerBanditRecord",
//     default: false
// })