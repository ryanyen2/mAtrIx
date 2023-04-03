import {selector} from 'recoil';
import {barChartData} from './atoms';
import {regretPlotParam} from './atoms';

export const barChartDataSelector = selector({
    key: 'barChartDataSelector',
    get: ({get}) => {
        const data = get(barChartData);
        return data;
    }
});

export const regretPlotParamSelector = selector({
    key: 'regretPlotParamSelector',
    get: ({get}) => {
        const data = get(regretPlotParam);
        return data;
    }
});