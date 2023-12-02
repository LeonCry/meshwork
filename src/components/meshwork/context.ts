import { defineStore } from "pinia";
import {ref, watch} from "vue";
import dayjs from "dayjs";
import isLeapYear from 'dayjs/plugin/isLeapYear';
dayjs.extend(isLeapYear)
export const useMeshWorkStore = defineStore("meshwork", () => {

    //显示前后总共10年的时间节点
    const MAXYEARS = 11;
    const HARFYEAR = Math.floor(MAXYEARS/2);
    const TOYEAR = dayjs().get("year");
    const STARTYEAR = TOYEAR - HARFYEAR;
    //假设是从2018 - 2028年
    const STARTTIME = dayjs(`${TOYEAR - HARFYEAR}-01-01`);
    const ENDTIME = dayjs(`${TOYEAR + HARFYEAR}-12-31`);
    //获取这10年的所有天数
    const ALLDAYS = ENDTIME.diff(STARTTIME, "day") + 1;
    // 获取这10年里每一年每个月的天数
    const YEARMONTHLYDAY: number[][] = Array(MAXYEARS);
    const YEARDAYS: number[] = Array(MAXYEARS);
    for (let i = TOYEAR - HARFYEAR; i <= TOYEAR + HARFYEAR; i++) {
        YEARMONTHLYDAY[i - TOYEAR + HARFYEAR] = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        YEARDAYS[i - TOYEAR + HARFYEAR] = 365;
        if (dayjs(`${i}-01-01`).isLeapYear()) {
            YEARMONTHLYDAY[i - TOYEAR + HARFYEAR] = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            YEARDAYS[i - TOYEAR + HARFYEAR] = 366;
        }
    }
    //获取屏幕宽度
    const SCREEN = window.screen.width;
    //获取container的宽度
    const baseWidth = ref(SCREEN);
    //slider最大宽
    const MAXSLIDER = 120;
    //slider最小宽
    const MINSLIDER = 0;
    const sliderValue = ref<number>(MINSLIDER);
    //需要展示的块的宽度
    const upWidth = ref<number[]>([]);
    const downWidth = ref<number[]>([]);
    const totalWidth = ref(0);
    //需要展示的每个块的文本信息
    const upText = ref<string[]>([]);
    const downText = ref<string[]>([]);

    //up down文本的显示
    const blockShowText = (isUpYear:boolean,gap:number) => {
        let upText :string[];
        let downText :string[];
        gap = Math.ceil(gap);
        if (isUpYear) {
            upText = Array.from({length:MAXYEARS},(_,i)=>STARTYEAR + i +'年');
            downText = Array.from({length:MAXYEARS * 12 / gap },(_,i)=>dayjs(STARTTIME).month(i*gap).format("M月"));
        }
        else {
            upText = Array.from({length:MAXYEARS * 12},(_,i)=> dayjs(STARTTIME).month(i).format("YYYY年M月"));
            downText = Array.from({length:ALLDAYS / gap },(_,i)=>dayjs(STARTTIME).day(i*gap + 1).format("D日"));
        }
        return [upText,downText];
    }
    //获取间隔gap
    const getGap = (slider:number) => {
        if ( slider >= 0 && slider < 30 ) {
            return  3 - slider / 15;
        }
        if (slider >= 30 && slider < 60 ) {
            //原gap = 1，此为特殊gap，用来拉伸up-width
            return 30 / slider;
        }
        if (slider >= 60 && slider < 90) {
            return 3 + (90 - slider) / 10;
        }
        else {
            return 1 + (120 - slider) / 15;
        }
    }
    //获取块文本
    const getBlockText = (slider:number, gap:number) => {
        if (slider >= 30 && slider < 60) {
            return blockShowText(true,1);
        }
        if (slider >= 0 && slider < 30) {
            return blockShowText(true,gap);
        }
        return blockShowText(false,gap);
    }

    //上年下月时的宽度
    const handleWidthYearMonthCompose = (slider:number, gap:number) => {
        //获得总宽度
        const totalWidth = ( baseWidth.value * MAXYEARS ) / gap;
        //获得每一天的宽度
        const dayWidth = totalWidth / ALLDAYS;
        //获得upWidth每个格子的宽度
        const upBlockWidth = upText.value.map((_,i) => YEARDAYS[i] * dayWidth);
        //获得down每个格子的宽度
        const downBlockWidth = downText.value.map((_,i)=>{
            //如果是年 -> 半年过渡，则
            if (slider >= 30 && slider < 60 ) gap = 1;
            // 如果gap还不是整数的时候
            if (gap % 1 != 0 ) gap = Math.ceil(gap);
            const grap = 12 / gap;
            return upBlockWidth[Math.floor(i / grap)] / grap;
        });
        return [upBlockWidth,downBlockWidth,totalWidth];
    }
    //上月下年时的宽度
    const handleWidthMonthDayCompose = (gap:number) => {
        const roughMonthDay = 31;
        const totalWidth =  ALLDAYS * baseWidth.value / (gap * roughMonthDay);
        const dayWidth = totalWidth / ALLDAYS;
        const upBlockWidth = upText.value.map((_,i) => dayWidth * YEARMONTHLYDAY[Math.floor(i/12)][i%12]);
        const downBlockWidth = downText.value.map(()=>{
            if (gap % 1 != 0 ) gap = Math.ceil(gap);
            return gap * dayWidth;
        });
        return [upBlockWidth,downBlockWidth,totalWidth];
    }

    //对sliderValue进行监听
    watch(sliderValue,(slider)=>{
        const gap = getGap(slider);
        [upText.value,downText.value] = getBlockText(slider,gap);
        //更新宽度:上年下月的情况
        if ( slider >= 0 && slider < 60 ) {
            [upWidth.value,downWidth.value,totalWidth.value] = handleWidthYearMonthCompose(slider,gap) as [number[],number[],number];
        }
        //更新宽度:上月下天的情况
        else {
            [upWidth.value,downWidth.value,totalWidth.value] = handleWidthMonthDayCompose(gap) as [number[],number[],number];
        }

    },{immediate:true});
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
        upText,
        downText,
        upWidth,
        downWidth,
        totalWidth,
    }
})