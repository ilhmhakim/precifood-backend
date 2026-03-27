// Round as per Nutrition precision (macros 1dp, some 2dp)
export const roundToOneDecimal = (n: number) => Math.ceil(n * 10) / 10;
export const roundToTwoDecimal = (n: number) => Math.ceil(n * 100) / 100;
