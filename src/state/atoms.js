import { atom } from "recoil";

export const barChartData = atom({
    key: "barChartData",
    default: [12, 5, 6, 6, 9, 10],
});


export const regretPlotParam = atom({
    key: "regretPlotParam",
    default: {
        epsilon: 0.05,
        c: 2,
        m: 0,
        nu: 1,
        alpha: [1, 10],
        beta: 1,
        repeats: 100
    }
});


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

