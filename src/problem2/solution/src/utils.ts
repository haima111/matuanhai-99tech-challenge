import { DEFAULT_DECIMAL_SCALE } from "./const";

export const realNumberDecimalFormat = (
  inputNumber: string,
  decimalLim = DEFAULT_DECIMAL_SCALE
): string => {
  // Check if the input is empty or undefined, and return an empty string.
  if (!inputNumber) {
    return "";
  }

  // Convert the input number to a string for consistency.
  let numberStr = inputNumber.toString();

  // Find the index of the decimal point in the string.
  const dotIndex = numberStr.indexOf(".");

  const lastIndexOfMinus = numberStr.lastIndexOf("-");
  if (lastIndexOfMinus > 1) {
    numberStr =
      numberStr[0] +
      numberStr.substring(1, numberStr.length).replaceAll("-", "");
  }

  // Regular expression to match thousands separators.
  const commonMatch = new RegExp(/\B(?=(\d{3})+(?!\d))/g);

  // If there is no decimal point in the input number, format the integer part only.
  if (dotIndex === -1) {
    return numberStr.replace(commonMatch, ",");
  }

  // Calculate the number of decimal places in the input number.
  const numLengthAfterDecimalPoint = numberStr.length - dotIndex - 1;
  let result = inputNumber;

  // If the number of decimal places exceeds the specified limit, round and limit it.
  if (numLengthAfterDecimalPoint >= decimalLim) {
    const powLim = Math.pow(10, decimalLim);
    result = String(Math.round(Number(inputNumber) * powLim) / powLim);
  }

  // Split the result into the integer and decimal parts.
  const [numberPart, decimalPart] = result.toString().split(".");

  // If no decimal places are required, return the integer part with thousands separators.
  if (decimalLim === 0 || decimalPart === undefined) {
    return numberPart.replace(commonMatch, ",");
  }

  // Return the formatted number with thousands separators and the specified decimal precision.
  return numberPart.replace(commonMatch, ",") + "." + decimalPart;
};

export const normalizeNumeric = (inputString: string) => {
  let number = inputString.replace(/[^\d.-]/g, "");
  // number with type text -> 10000 -> 10,000
  const lastIndexOfMinus = number.lastIndexOf("-");
  const firstIndexOfDot = number.indexOf(".");
  const dotCount = (number.match(/\./g) || []).length;

  if (lastIndexOfMinus > 0) {
    number = number[0] + number.substring(1, number.length).replaceAll("-", "");
  }

  if (dotCount > 1) {
    number =
      number.substring(0, firstIndexOfDot + 1) +
      number.substring(firstIndexOfDot).replaceAll(".", "");
  }

  return number;
};

export const getCommasNumbers = (string: string) =>
  string.split(",").length - 1;
