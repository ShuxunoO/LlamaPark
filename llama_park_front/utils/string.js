import { addDays } from "date-fns";
import { format } from "date-fns-tz";
import BigNumber from "bignumber.js";
export function trimTrailingZeros(numberString) {
  try {
    const type = typeof numberString;
    if (type !== 'string') throw new Error();

    const number = Number(numberString);
    if (Number(number) !== number) throw new Error();

    return number.toString();
  } catch (e) {
    return '';
  }
}

export function addThousandsSeparator(number) {
  const parts = number.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

export function formatNumberToThousand(number = 0) {
  if (number < 1000) return number;
  return `${new BigNumber(number / 1000).toFixed(1, 1)}K`
}

export function formatWithdrawTime(time) {
  let updatedDate = format(
    new Date(addDays(Number(time), 10)),
    'MMM dd, yyyy hh:mm a'
  );
  try {
    const dateFormat = new Date().toLocaleDateString(undefined, {
      day: "2-digit",
      timeZoneName: "long",
    }).slice(4);

    updatedDate =
      updatedDate +
      " (" +
      dateFormat.split(" ")
        .map((item) => item[0])
        .join("") + ")";
  } catch (e) {
    updatedDate = format(
      new Date(addDays(Number(time) * 1000, 10)),
      "MMM dd, yyyy hh:mm a zzz"
    );
  }
  
  return updatedDate
}