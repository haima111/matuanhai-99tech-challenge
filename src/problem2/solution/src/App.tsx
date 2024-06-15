import { zodResolver } from "@hookform/resolvers/zod";
import { Orbit, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./App.css";
import { Button } from "./components/ui/button";
import { ComboBox } from "./components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./components/ui/form";
import { InputNumber } from "./components/ui/input";
import { Separator } from "./components/ui/separator";
import currencyData from "./mock/currency.json";

type TCurrency = {
  price: number;
  date: string;
  currency: string;
  label: string;
  value: string;
};

const formSchema = z.object({
  fromCurrency: z.string().min(1, { message: "From currency is required" }),
  toCurrency: z.string().min(1, { message: "To currency is required" }),
  value: z.number().refine((value) => Number(value) > 0, {
    message: "Value is required and greater than 0",
  }),
});

type TFormExchange = z.infer<typeof formSchema>;

const defaultValuesForm = {
  fromCurrency: "",
  toCurrency: "",
  value: 0,
};

const defaultOptions: TCurrency[] = currencyData.map((item) => ({
  ...item,
  label: item.currency,
  value: item.currency,
}));

const App = () => {
  const [finalResult, setFinalResult] = useState<string>();
  const methods = useForm<TFormExchange>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValuesForm,
  });

  const onSubmit = (payload: TFormExchange) => {
    const { fromCurrency, toCurrency, value } = payload;
    if (fromCurrency !== toCurrency) {
      const fromCurrObject = currencyData.find(
        (curr) => curr.currency === fromCurrency
      );
      const toCurrObject = currencyData.find(
        (curr) => curr.currency === toCurrency
      );

      if (fromCurrObject && toCurrObject && fromCurrObject !== toCurrObject) {
        const exchangeValue =
          (fromCurrObject.price / toCurrObject.price) * value;
        setFinalResult(
          `Exchange ${value} ${fromCurrency} to ${toCurrency} equal ${exchangeValue}`
        );
      }
    } else {
      setFinalResult("Must be select two different currency to exchange");
    }
  };

  return (
    <div className="bg-[url(./assets/background.png)] h-screen w-screen bg-no-repeat bg-center bg-cover flex flex-col justify-center items-center">
      <div className="rounded-md shadow-lg bg-white p-4 md:p-6 md:w-96">
        <p className="font-bold text-xl text-blue-800 text-center">
          {"Exchange currency service".toUpperCase()}
        </p>
        <Separator className="my-2" />
        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <FormField
              control={methods.control}
              name="fromCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Currency</FormLabel>
                  <FormControl>
                    <ComboBox<TCurrency> {...field} options={defaultOptions} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="toCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To Currency</FormLabel>
                  <FormControl>
                    <ComboBox<TCurrency> {...field} options={defaultOptions} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <InputNumber placeholder="Type value exchange" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="my-5" />
            {finalResult && (
              <div className="mb-2">
                <p className="text-orange-600 font-bold text-base">
                  {finalResult}
                </p>
              </div>
            )}
            <div className="flex flex-col md:flex-row gap-2">
              <Button
                className="bg-slate-600 hover:bg-slate-500 gap-2 flex-1"
                onClick={() => {
                  setFinalResult("");
                  methods.reset();
                }}
              >
                <RefreshCcw />
                <span>Reset</span>
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-500 gap-2 flex-1"
                type="submit"
              >
                <Orbit />
                <span>Exchange</span>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default App;
