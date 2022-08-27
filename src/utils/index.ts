import { ChangeEvent, Dispatch, SetStateAction } from "react";

export const dayPartKeys = ["morning", "day", "night"];
export const dayKeys = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

export const dateToDateId = (date: Date): number => {
  const year = date.getFullYear() * 10000
  const month = (date.getMonth() + 1) * 100
  const day = date.getDate()

  return year + month + day
}

export const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);


export const checkedToValueMapper = (values: any[]) => {
  return function(b: boolean, i: number) {
    if (b) {
      return values[i];
    }
  }
} 

export const dateOnly = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export const dateEquals = (a: Date, b: Date) => {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}

export const setCheckboxArray = (
    e: ChangeEvent<HTMLInputElement>,
    arr: boolean[],
    updateIndex: number,
    setter: Dispatch<SetStateAction<boolean[]>>
  ) => {
    const updatedArr = [...arr];
    updatedArr[updateIndex] = !updatedArr[updateIndex];
    setter(updatedArr);
};

export const setStateArrayAt = <T>(
    value: T,
    arr: T[],
    updateIndex: number,
    setter: Dispatch<SetStateAction<T[]>>
) => {
  const updatedArr = [...arr]
  updatedArr[updateIndex] = value 
  setter(updatedArr)
}