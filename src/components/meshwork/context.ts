
import { defineStore } from "pinia";
import {ref, watch} from "vue";
import dayjs from "dayjs";
import isLeapYear from 'dayjs/plugin/isLeapYear';
dayjs.extend(isLeapYear)
export const useMeshWorkStore = defineStore("meshwork", () => {

    //显示前后总共10年的时间节点
    const MAXYEARS = 10;
    const TOYEAR = dayjs().get("year");
    //假设是从2018 - 2028年
    const STARTTIME = dayjs(`${TOYEAR - 5}-01-01`);
    const ENDTIME = dayjs(`${TOYEAR + 5}-12-31`);
    //获取这10年的所有天数
    const ALLDAYS = ENDTIME.diff(STARTTIME, "day");
    // 获取这10年里每一年每个月的天数
    const YEARMONTHLYDAY: number[][] = Array(MAXYEARS);
    for (let i = TOYEAR - MAXYEARS/2; i < TOYEAR + MAXYEARS/2; i++) {
        YEARMONTHLYDAY[i - TOYEAR + MAXYEARS/2] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (dayjs(`${i}-01-01`).isLeapYear()) {
            YEARMONTHLYDAY[i - TOYEAR + MAXYEARS/2] = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        }
    }
    //获取屏幕宽度
    const SCREEN = window.screen.width;
    //slider最大宽
    const MAXSLIDER = 120;
    //slider最小宽
    const MINSLIDER = 10;
    const MARKARR = [10,30,60,90,120];
    const sliderValue = ref<number>(MINSLIDER);
    
    //对sliderValue进行监听
    watch(sliderValue,(newVal)=>{
        const reverseVal = MAXSLIDER + MINSLIDER -  newVal;
        console.log(reverseVal)
    });

    //上年下月时的宽度
    const handleWidthYearMonthCompose = (curSlider:number) => {
        if (curSlider === 120) {

        }
        if (curSlider >= 90 && curSlider < 120) {
            const delta = MAXSLIDER - curSlider;
            const factor = 0.1 * delta;

        }
    }
    //上月下年时的宽度
    const handleWidthMonthDayCompose = (curSlider:number) => {

    }


    return {
        TOYEAR,
        STARTTIME,
        ENDTIME,
        ALLDAYS,
        YEARMONTHLYDAY,
        SCREEN,
        MAXSLIDER,
        MINSLIDER,
        sliderValue,
    }
})