"use client";
import Image from "next/image";
import { useState } from "react";
import { FaCalculator } from "react-icons/fa";

const PAPER_SIZES = ["B5", "A4", "B4", "A3", "B3", "A2", "Poster"];
const PAPER_PRICES: Record<string, number> = {
  B5: 2500,
  A4: 3000,
  B4: 5000,
  A3: 6000,
  B3: 10000,
  A2: 12000,
  Poster: 15000,
};

const ScreenPrintingCalculator = () => {
  const [paperSize, setPaperSize] = useState("");
  const [colorCount, setColorCount] = useState(0);
  const [totalPrint, setTotalPrint] = useState(0);
  const [totalCost, setTotalCost] = useState(0);
  const [costPerSheet, setCostPerSheet] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const material = 66863;
  const production = 369262;
  const overhead = 123090;
  const labor = 7200;
  const colorPrice = 12325;
  const emulsionBasePrice = 50828;

  const handlePaperSizeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setPaperSize(event.target.value);
    setErrorMessage("");
  };

  const calculateCosts = () => {
    setErrorMessage("");
    setLoading(true);

    setTimeout(() => {
      if (totalPrint < 15 || !paperSize || colorCount <= 0) {
        setTotalCost(0);
        setCostPerSheet(0);
        setLoading(false);
        setErrorMessage("Please ensure all inputs are valid.");
        return;
      }

      const paperPrice = PAPER_PRICES[paperSize];
      if (paperPrice === undefined) {
        setLoading(false);
        setErrorMessage("Invalid paper size selected.");
        return;
      }

      const totalFixedCosts = material + production + overhead + labor;
      const totalColorCost = colorPrice * colorCount;
      const totalEmulsionCost = emulsionBasePrice * colorCount;

      const calculatedCostPerSheet =
        ((totalFixedCosts + paperPrice + totalColorCost + totalEmulsionCost) *
          3.8) /
        totalPrint;
      const calculatedTotalCost = calculatedCostPerSheet * totalPrint;

      setCostPerSheet(calculatedCostPerSheet);
      setTotalCost(calculatedTotalCost);
      setLoading(false);
    }, 1000); // Simulate calculation delay
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "IDR",
    });
  };

  const imageSrc = "/images/papersize.svg"; // Default image

  return (
    <div className="px-4 md:px-16 py-16">
      <h1 className="text-5xl md:text-7xl mb-4 font-bold">Estimated Price</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
        <div>
          <p className="mb-2">
            We offer hand-pulled screen printing on paper using water-based ink.
            Our standard paper is Fedrigoni ARENA 300gsm, or you can request
            custom paper.
          </p>
          <p className="mb-2">
            Use the calculator to estimate printing costs based on your chosen
            size.
          </p>
          <p>
            <a
              href="https://forms.fillout.com/t/pFE4XxyiXGus"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline hover:scale-110 hover:origin-center transition-transform duration-200 ease-in-out"
            >
              Request a Quote here
            </a>
          </p>
          <div className="mt-8 flex flex-col gap-4 items-start max-w-80">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Paper Size
              </label>
              <select
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={paperSize}
                onChange={handlePaperSizeChange}
              >
                <option value="">Select paper size</option>
                {PAPER_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-sm text-gray-500">
                Standard paper: Fedrigoni 300 GSM
              </p>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Number of Colors
              </label>
              <input
                type="number"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={colorCount}
                onChange={(e) =>
                  setColorCount(Math.max(0, parseInt(e.target.value) || 0))
                }
                placeholder="Enter number of colors"
              />
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700">
                Total Prints
              </label>
              <input
                type="number"
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                value={totalPrint}
                onChange={(e) =>
                  setTotalPrint(Math.max(0, parseInt(e.target.value) || 0))
                }
              />
            </div>
            <button
              onClick={calculateCosts}
              className={`mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center ${
                totalPrint < 15 || !paperSize || colorCount <= 0
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={totalPrint < 15 || !paperSize || colorCount <= 0}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaCalculator className="mr-2" />
                  Calculate
                </>
              )}
            </button>
          </div>
          {errorMessage && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
              role="alert"
            >
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline">{errorMessage}</span>
            </div>
          )}
          {totalCost > 0 && !loading && (
            <table className="mt-4">
              <tbody>
                <tr>
                  <td>Paper Size: {paperSize}</td>
                </tr>
                <tr>
                  <td>Number of Colors: {colorCount}</td>
                </tr>
                <tr>
                  <td className="font-bold">
                    Cost per Sheet: {formatCurrency(costPerSheet)}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold">
                    Total Cost for {totalPrint} Prints:{" "}
                    {formatCurrency(totalCost)}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
          {totalPrint < 15 && (
            <p className="text-blue-500 mt-4">
              Minimum print run is 15 sheets.
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Image
            src={imageSrc}
            alt="Screen Printing"
            width={500}
            height={200}
            className="w-full md:w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default ScreenPrintingCalculator;
