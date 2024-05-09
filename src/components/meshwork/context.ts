import { defineStore } from "pinia";
import { ref, watch } from "vue";
import dayjs from "dayjs";
import isLeapYear from "dayjs/plugin/isLeapYear";
dayjs.extend(isLeapYear);
export const useMeshWorkStore = defineStore("meshwork", () => {
  //显示前后总共10年的时间节点
  const MAX_YEARS = 11;
  const HALF_YEAR = Math.floor(MAX_YEARS / 2);
  const TO_YEAR = dayjs().get("year");
  const START_YEAR = TO_YEAR - HALF_YEAR;
  const START_TIME = dayjs(`${TO_YEAR - HALF_YEAR}-01-01`);
  const END_TIME = dayjs(`${TO_YEAR + HALF_YEAR}-12-31`);
  //获取这10年的所有天数
  const ALL_DAYS = END_TIME.diff(START_TIME, "day") + 1;
  // 获取这10年里每一年每个月的天数
  const YEAR_MONTHLY_DAY: number[][] = Array(MAX_YEARS);
  const YEAR_DAYS: number[] = Array(MAX_YEARS);
  for (let i = TO_YEAR - HALF_YEAR; i <= TO_YEAR + HALF_YEAR; i++) {
    YEAR_MONTHLY_DAY[i - TO_YEAR + HALF_YEAR] = [
      31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
    ];
    YEAR_DAYS[i - TO_YEAR + HALF_YEAR] = 365;
    if (dayjs(`${i}-01-01`).isLeapYear()) {
      YEAR_MONTHLY_DAY[i - TO_YEAR + HALF_YEAR] = [
        31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
      ];
      YEAR_DAYS[i - TO_YEAR + HALF_YEAR] = 366;
    }
  }
  //获取屏幕宽度
  const SCREEN = window.screen.width;
  //获取scrollTarget的宽度
  const baseWidth = ref(SCREEN - 450);
  //slider最大宽
  const MAX_SLIDER = 120;
  //slider最小宽
  const MIN_SLIDER = 0;
  const allSliders = ref<number[]>(
    Array.from({ length: MAX_SLIDER + 1 }, (_, i) => i),
  );
  const allDayWidths = ref<number[]>([]);
  const sliderValue = ref<number>(0);
  //需要展示的块的宽度
  const upWidth = ref<number[]>([]);
  const downWidth = ref<number[]>([]);
  const totalWidth = ref(0);
  //需要展示的每个块的文本信息
  const upText = ref<string[]>([]);
  const downText = ref<string[]>([]);
  //每一天的宽度，用来同步图中的位移
  const dayWidth = ref(0);

  //up down文本的显示
  const blockShowText = (isUpYear: boolean, gap: number) => {
    let upText: string[];
    let downText: string[];
    gap = Math.ceil(gap);
    if (isUpYear) {
      upText = Array.from(
        { length: MAX_YEARS },
        (_, i) => START_YEAR + i + "年",
      );
      downText = Array.from({ length: (MAX_YEARS * 12) / gap }, (_, i) =>
        dayjs(START_TIME)
          .month(i * gap)
          .format("M月"),
      );
    } else {
      upText = Array.from({ length: MAX_YEARS * 12 }, (_, i) =>
        dayjs(START_TIME).month(i).format("YYYY年M月"),
      );
      downText = Array.from({ length: Math.ceil(ALL_DAYS / gap) }, (_, i) =>
        dayjs(START_TIME)
          .date(i * gap + 1)
          .format("D"),
      );
    }
    return [upText, downText];
  };
  //获取间隔gap
  const getGap = (slider: number) => {
    if (slider >= 0 && slider < 30) {
      return 3 - slider / 15;
    }
    if (slider >= 30 && slider < 60) {
      //原gap = 1，此为特殊gap，用来拉伸up-width
      return 30 / slider;
    }
    if (slider >= 60 && slider < 90) {
      return 3 + (90 - slider) / 10;
    } else {
      return 1 + (120 - slider) / 15;
    }
  };
  //获取块文本
  const getBlockText = (slider: number, gap: number) => {
    if (slider >= 30 && slider < 60) {
      return blockShowText(true, 1);
    }
    if (slider >= 0 && slider < 30) {
      return blockShowText(true, gap);
    }
    return blockShowText(false, gap);
  };

  //上年下月时的宽度
  const handleWidthYearMonthCompose = (
    slider: number,
    gap: number,
    upText: string[],
    downText: string[],
  ) => {
    //获得总宽度
    const totalWidth = (baseWidth.value * MAX_YEARS) / gap;
    //获得每一天的宽度
    const dayWidth = totalWidth / ALL_DAYS;
    //获得upWidth每个格子的宽度
    const upBlockWidth = upText.map((_, i) => YEAR_DAYS[i] * dayWidth);
    //获得down每个格子的宽度
    const downBlockWidth = downText.map((_, i) => {
      //如果是年 -> 半年过渡，则
      if (slider >= 30 && slider < 60) gap = 1;
      // 如果gap还不是整数的时候
      if (gap % 1 != 0) gap = Math.ceil(gap);
      const grap = 12 / gap;
      return upBlockWidth[Math.floor(i / grap)] / grap;
    });
    return [upBlockWidth, downBlockWidth, dayWidth, totalWidth];
  };
  //上月下日时的宽度
  const handleWidthMonthDayCompose = (
    gap: number,
    upText: string[],
    downText: string[],
  ) => {
    const roughMonthDay = 30;
    const totalWidth =
      ALL_DAYS * Math.floor(baseWidth.value / (gap * roughMonthDay));
    const dayWidth = totalWidth / ALL_DAYS;
    const upBlockWidth = upText.map(
      (_, i) => dayWidth * YEAR_MONTHLY_DAY[Math.floor(i / 12)][i % 12],
    );
    const downBlockWidth = downText.map((_, i) => {
      gap = Math.ceil(gap);
      //如果是所有块中的最后一个，可能代表的并不是gap天
      if (i === downText.length - 1) {
        return totalWidth - gap * dayWidth * i;
      }
      return gap * dayWidth;
    });
    return [upBlockWidth, downBlockWidth, dayWidth, totalWidth];
  };
  const refresh = (slider: number) => {
    const gap = getGap(slider);
    [upText.value, downText.value] = getBlockText(slider, gap);
    //更新宽度:上年下月的情况
    if (slider >= 0 && slider < 60) {
      [upWidth.value, downWidth.value, dayWidth.value, totalWidth.value] =
        handleWidthYearMonthCompose(
          slider,
          gap,
          upText.value,
          downText.value,
        ) as [number[], number[], number, number];
    }
    //更新宽度:上月下天的情况
    else {
      [upWidth.value, downWidth.value, dayWidth.value, totalWidth.value] =
        handleWidthMonthDayCompose(gap, upText.value, downText.value) as [
          number[],
          number[],
          number,
          number,
        ];
    }
  };

  //将所有的slider与dayWidth对应的数组先计算出来
  const getSliderCorrWidth = () => {
    allDayWidths.value = allSliders.value.map((v) => {
      let result = 0;
      const gap = getGap(v);
      const [upText, downText] = getBlockText(v, gap);
      //更新宽度:上年下月的情况
      if (v >= 0 && v < 60) {
        [, , result] = handleWidthYearMonthCompose(
          v,
          gap,
          upText,
          downText,
        ) as [number[], number[], number, number];
      }
      //更新宽度:上月下天的情况
      else {
        [, , result] = handleWidthMonthDayCompose(gap, upText, downText) as [
          number[],
          number[],
          number,
          number,
        ];
      }
      return result;
    });
  };
  //筛选时,需要将筛选结果开始-结束显示在整个页面上,通过改变slider
  const getSliderByMinMaxDate = (minMaxDate: Record<string, string>) => {
    const { minStartDate, maxEndDate } = minMaxDate;
    const betweenDays = dayjs(maxEndDate).diff(dayjs(minStartDate), "day");
    const dayWidth = baseWidth.value / betweenDays;
    let lastDiffValue = Infinity;
    const suitableSlider = allDayWidths.value.findIndex((v) => {
      const curDiffValue = Math.abs(v - dayWidth);
      lastDiffValue =
        curDiffValue < lastDiffValue ? curDiffValue : lastDiffValue;
      return curDiffValue > lastDiffValue;
    });
    return suitableSlider === MIN_SLIDER || suitableSlider === MAX_SLIDER
      ? suitableSlider
      : suitableSlider - 3;
  };

  //对sliderValue进行监听
  watch(sliderValue, (slider) => refresh(slider), { immediate: true });
  getSliderCorrWidth();
  return {
    TO_YEAR,
    START_TIME,
    END_TIME,
    ALL_DAYS,
    YEAR_MONTHLY_DAY,
    SCREEN,
    MAX_SLIDER,
    MIN_SLIDER,
    sliderValue,
    upText,
    downText,
    upWidth,
    downWidth,
    totalWidth,
    dayWidth,
    baseWidth,
    allDayWidths,
    getSliderByMinMaxDate,
  };
});
