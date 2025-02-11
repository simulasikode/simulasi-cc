"use client";
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

const PAPER_DIMENSIONS: Record<string, { width: number; height: number }> = {
  B5: { width: 176, height: 250 }, // Dimensions in mm
  A4: { width: 210, height: 297 },
  B4: { width: 250, height: 353 },
  A3: { width: 297, height: 420 },
  B3: { width: 353, height: 500 },
  A2: { width: 420, height: 594 },
  Poster: { width: 450, height: 600 }, // Example poster size
};

const ScreenPrintingCalculator = () => {
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

  const [paperSizeIndex, setPaperSizeIndex] = useState(0); // Current paper size index
  const paperSize = PAPER_SIZES[paperSizeIndex]; // Current paper size

  // Function to handle the slider change
  const handlePaperSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newIndex = parseInt(event.target.value);
    setPaperSizeIndex(newIndex);
  };

  const calculateCosts = () => {
    setErrorMessage("");
    setLoading(true);

    setTimeout(() => {
      if (totalPrint < 0 || !paperSize || colorCount < 0) {
        // Correct condition
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
        (totalPrint === 0 ? 1 : totalPrint); // Prevent division by zero
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

  const dimensions = PAPER_DIMENSIONS[paperSize];
  //const aspectRatio = dimensions.height / dimensions.width;

  // Use the displaySize directly, assuming it's in mm now
  const displayWidth = dimensions.width;
  const displayHeight = dimensions.height;

  return (
    <div className="mt-16">
      <div className="relative mx-auto mb-16 flex flex-col items-center">
        <h1 className="relative text-5xl md:text-[75px] font-bold text-center mb-2 uppercase leading-[82%] tracking-tighter">
          PressPrice
        </h1>
        <p className="text-[22.5px] text-center uppercase m-2 leading-[82%]">
          easily estimate the costs of the screen printing projects
        </p>
        <p className="text-sm text-center max-w-lg leading-[92%]">
          The Screen Printing Calculator is a user-friendly tool designed to
          estimate the costs associated with hand-pulled screen printing on
          paper. It offers real-time price calculations based on user-defined
          parameters such as paper size and the number of colors.
        </p>
      </div>
      <div className="w-[100vw] border-y border-primary -ml-[10px] pl-[10px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative border-r border-primary pr-4 h-[100vh] ">
            <div className="p-8">
              <p className="mb-2">
                We offer hand-pulled screen printing on paper using water-based
                ink. Our standard paper is Fedrigoni ARENA 300gsm, or you can
                request custom paper.
              </p>
              <p className="mb-2">
                Use the calculator to estimate printing costs based on your
                chosen size.
              </p>
              <p>
                <a
                  href="https://forms.fillout.com/t/pFE4XxyiXGus"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline hover:scale-110 hover:origin-center transition-transform duration-200 ease-in-out"
                >
                  Request a Quote here
                </a>
              </p>

              <div className="mt-8 flex flex-col gap-4 items-start max-w-80">
                <div className="w-full">
                  {/* Paper Size Slider - Now controls both paper size and display size */}
                  <label className="block text-sm font-medium">
                    Paper Size: {paperSize}
                  </label>
                  <input
                    type="range"
                    id="sizeSlider"
                    min="0" // The index of the first paper size
                    max={PAPER_SIZES.length - 1} // The index of the last paper size
                    step="1" // Integer steps only
                    value={paperSizeIndex}
                    onChange={handlePaperSizeChange}
                    className="mt-2 w-full appearance-none bg-foreground cursor-pointer h-0.5"
                  />
                  <div className="mt-2 flex justify-between">
                    {PAPER_SIZES.map((size) => (
                      <div key={size} className="text-sm relative">
                        <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1">
                          {size}
                        </span>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-2 w-[1px] bg-foreground"></div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full mt-6">
                  <label className="block text-sm font-medium ">
                    Number of Colors
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full py-2 px-3 border border-primary bg-gray-200 dark:bg-gray-900 focus:outline-none focus:opacity-80 sm:text-sm"
                    value={colorCount}
                    onChange={(e) =>
                      setColorCount(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    placeholder="Enter number of colors"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-sm font-medium">
                    Total Prints
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full py-2 px-3 border border-primary bg-gray-200 dark:bg-gray-900 focus:outline-none focus:opacity-80 sm:text-sm"
                    value={totalPrint}
                    onChange={(e) =>
                      setTotalPrint(Math.max(0, parseInt(e.target.value) || 0))
                    }
                  />
                </div>

                <button
                  onClick={calculateCosts}
                  className="mb-4 bg-background hover:bg-primary border border-primary dark:bg-gray-900 dark:text-primary font-bold py-2 px-4 flex items-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
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
            </div>
            <div>
              {/* Display results even when initial state is zero */}
              <table className="mt-4 mx-6 border-b border-primary w-[85vw] sm:w-[40vw]">
                <thead>
                  <tr>
                    <th className="border-b border-primary p-2 text-left">
                      Item
                    </th>
                    <th className="border-b border-primary p-2 text-left">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border-b border-primary p-2">Paper Size</td>
                    <td className="border-b border-primary p-2">{paperSize}</td>
                  </tr>
                  <tr>
                    <td className="border-b border-primary p-2">
                      Number of Colors
                    </td>
                    <td className="border-b border-primary p-2">
                      {colorCount}
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-primary p-2 font-bold">
                      Cost per Sheet
                    </td>
                    <td className="border-b border-primary p-2 font-bold">
                      {formatCurrency(costPerSheet)}
                    </td>
                  </tr>
                  <tr>
                    <td className="border-b border-primary p-2 font-bold">
                      Total Cost for {totalPrint} Prints
                    </td>
                    <td className="border-b border-primary p-2 font-bold">
                      {formatCurrency(totalCost)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {totalPrint < 15 && (
              <p className="text-gray-600 mt-2 mx-6 text-sm ">
                Minimum print run is 15 sheets.
              </p>
            )}
          </div>

          <div
            className="flex flex-col items-center justify-center mx-auto my-6 px-4"
            aria-label={`Paper Size: ${paperSize}`}
          >
            <div
              className="border border-black flex flex-col justify-center items-start box-border mt-24 sm:mt-0 "
              style={{
                width: displayWidth,
                height: displayHeight,
                maxWidth: "100vw",
                maxHeight: "100vh",
              }}
            >
              <span className="font-bold text-2xl ml-4">{paperSize}</span>
              <span className="text-sm ml-4">
                {displayWidth}mm x {displayHeight}mm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenPrintingCalculator;
