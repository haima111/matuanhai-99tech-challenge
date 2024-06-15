import * as React from "react";

import { cn } from "@/lib/utils";
import {
  getCommasNumbers,
  normalizeNumeric,
  realNumberDecimalFormat,
} from "@/utils";
import { DEFAULT_DECIMAL_SCALE } from "@/const";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputNumber = ({
  className,
  decimal = DEFAULT_DECIMAL_SCALE,
  ...props
}: Omit<InputProps, "onChange"> & {
  onChange?: (
    value: number | undefined
  ) => void | React.ChangeEventHandler<HTMLInputElement>;
  decimal?: number;
}) => {
  // We need to keep and update the state of the cell normally
  const [value, setValue] = React.useState<string>();
  const [number, setNumber] = React.useState<string>();

  /**
   * Ref to properly handle the case when user changes the index of selection cursor
   */
  const selectionStartRef = React.useRef<number | null>(null);
  const commasNumbers = React.useRef<number | null>(null);

  const setState = React.useCallback(
    (value: string) => {
      const number = normalizeNumeric(value);
      const text = realNumberDecimalFormat(number, decimal);

      setValue(text);
      setNumber(number);

      return [text, number];
    },
    [decimal]
  );

  // If the initialValue is changed external, sync it up with our state
  React.useEffect(() => {
    if (props.value !== undefined || props.value !== null) {
      setState(String(props.value));
    }
  }, [props.value, setState]);

  // When the input is blurred, we'll call our table meta's updateData function
  const onBlur = () => {
    props.onChange?.(Number(number));
  };

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const { value, selectionStart } = event.target;
    const [text, number] = setState(!value.length ? "0" : value);

    props?.onChange?.(number as unknown as number);

    let currentSelectionStart = selectionStart || 0;

    const prevCommasNumbers = commasNumbers.current;
    const currentCommasNumbers = getCommasNumbers(text);

    if (prevCommasNumbers! < currentCommasNumbers) {
      currentSelectionStart += 1;
    }

    selectionStartRef.current = currentSelectionStart;
    commasNumbers.current = currentCommasNumbers;

    setTimeout(() => {
      event.target.setSelectionRange(
        currentSelectionStart,
        currentSelectionStart
      );
    }, 0);
  };

  return (
    <Input
      {...props}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      className={cn(className, "text-right")}
    />
  );
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600  disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input, InputNumber };
