"use client";
import { useState } from "react";
import { FaCalculator } from "react-icons/fa";

// --- Constants ---
const PAPER_SIZES = ["B5", "A4", "B4", "A3", "B3", "A2", "Poster"];

const PAPER_PRICES: Record<string, number> = {
  B5: 2500,
  A4: 5000,
  B4: 7500,
  A3: 9000,
  B3: 11500,
  A2: 17000,
  Poster: 21300,
};

const PAPER_DIMENSIONS: Record<string, { width: number; height: number }> = {
  B5: { width: 176, height: 250 },
  A4: { width: 210, height: 297 },
  B4: { width: 250, height: 353 },
  A3: { width: 297, height: 420 },
  B3: { width: 353, height: 500 },
  A2: { width: 420, height: 594 },
  Poster: { width: 450, height: 600 },
};

const EMULSION_PRICES_BY_COLOR_TIERS: Record<string, number> = {
  "1-2": 50838,
  "3-4": 101676,
  "5-6": 152514,
  "7-8": 203352,
  "9+": 254190,
};

const FIXED_COSTS = {
  materialBasePrice: 83826,
  production: 369262,
  overhead: 123090,
  labor: 7200,
};

const COLOR_PRICE = 23418;
const MATERIAL_COLOR_SURCHARGE = 92500;
const PROFIT_MARGIN_MULTIPLIER = 3.8;
const MINIMUM_PRINT_RUN = 15;

// --- New Constants for Quantity Tiers and Discounts ---
const QUANTITY_TIERS: { threshold: number; fixedCostScale: number }[] = [
  { threshold: 50, fixedCostScale: 1.0 },
  { threshold: 100, fixedCostScale: 1.8 },
  { threshold: 250, fixedCostScale: 2.2 },
  { threshold: 500, fixedCostScale: 2.4 },
  { threshold: Infinity, fixedCostScale: 2.6 },
];

const COLOR_PRICE_SCALE_THRESHOLD = 45; // Sheet count at which color price scaling starts
const COLOR_PRICE_SCALE_FACTOR = 1.25; // Increase color price to 125%

// --- Helper Functions ---
const formatCurrency = (value: number): string => {
  try {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch (error) {
    console.error("Currency formatting error:", error);
    return "Rp. ???"; //Provide a graceful fallback
  }
};

// --- Component ---
const ScreenPrintingCalculator = () => {
  // --- State ---
  const [colorCount, setColorCount] = useState<number>(0);
  const [totalPrint, setTotalPrint] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [costPerSheet, setCostPerSheet] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [paperSizeIndex, setPaperSizeIndex] = useState<number>(0);
  const paperSize = PAPER_SIZES[paperSizeIndex];

  // --- Handlers ---
  const handlePaperSizeChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newIndex = parseInt(event.target.value, 10);
    if (newIndex >= 0 && newIndex < PAPER_SIZES.length) {
      setPaperSizeIndex(newIndex);
    } else {
      console.error("Invalid paper size index:", newIndex);
      setErrorMessage("Invalid paper size selected."); //Optional error message.
    }
  };

  const roundToNearestHundred = (value: number): number => {
    return Math.round(value / 100) * 100;
  };

  const calculateCosts = () => {
    setErrorMessage("");
    setLoading(true);

    setTimeout(() => {
      try {
        // --- Input Validation ---
        if (totalPrint < 0 || !paperSize || colorCount < 0) {
          throw new Error(
            "Please enter valid values for paper size, number of colors, and total prints.",
          );
        }

        const paperPrice = PAPER_PRICES[paperSize];
        if (paperPrice === undefined) {
          throw new Error("Invalid paper size selected.");
        }

        // --- Determine Quantity Tier ---
        const quantityTier = QUANTITY_TIERS.find(
          (tier) => totalPrint <= tier.threshold,
        );

        if (!quantityTier) {
          throw new Error("Could not determine quantity tier."); //Should never happen
        }

        const fixedCostScale = quantityTier.fixedCostScale;

        // --- Cost Calculation ---
        let materialCost = FIXED_COSTS.materialBasePrice;
        if (colorCount > 2) {
          materialCost += MATERIAL_COLOR_SURCHARGE;
        }

        // Apply scaling to fixed costs
        const scaledProduction = FIXED_COSTS.production * fixedCostScale;
        const scaledOverhead = FIXED_COSTS.overhead * fixedCostScale;
        const scaledLabor = FIXED_COSTS.labor * fixedCostScale;

        const totalFixedCosts =
          materialCost + scaledProduction + scaledOverhead + scaledLabor;

        // Scale the color price based on sheet count
        let scaledColorPrice = COLOR_PRICE;
        if (totalPrint > COLOR_PRICE_SCALE_THRESHOLD) {
          scaledColorPrice = COLOR_PRICE * COLOR_PRICE_SCALE_FACTOR;
        }
        const totalColorCost = scaledColorPrice * colorCount;

        let emulsionCost = 0;
        if (colorCount >= 1 && colorCount <= 2) {
          emulsionCost = EMULSION_PRICES_BY_COLOR_TIERS["1-2"];
        } else if (colorCount >= 3 && colorCount <= 4) {
          emulsionCost = EMULSION_PRICES_BY_COLOR_TIERS["3-4"];
        } else if (colorCount >= 5 && colorCount <= 6) {
          emulsionCost = EMULSION_PRICES_BY_COLOR_TIERS["5-6"];
        } else if (colorCount >= 7 && colorCount <= 8) {
          emulsionCost = EMULSION_PRICES_BY_COLOR_TIERS["7-8"];
        } else if (colorCount >= 9) {
          emulsionCost = EMULSION_PRICES_BY_COLOR_TIERS["9+"];
        }

        const totalCostBeforeProfit =
          totalFixedCosts + paperPrice + totalColorCost + emulsionCost;

        const calculatedCostPerSheet = roundToNearestHundred(
          (totalCostBeforeProfit * PROFIT_MARGIN_MULTIPLIER) /
            (totalPrint === 0 ? 1 : totalPrint),
        );

        const calculatedTotalCost = roundToNearestHundred(
          calculatedCostPerSheet * totalPrint,
        );

        // --- State Update ---
        setCostPerSheet(calculatedCostPerSheet);
        setTotalCost(calculatedTotalCost);
      } catch (error) {
        console.error("Calculation error:", (error as Error).message);
        setErrorMessage((error as Error).message);
        setTotalCost(0);
        setCostPerSheet(0);
      } finally {
        setLoading(false);
      }
    }, 1000);
  };

  // --- Derived Values ---
  const dimensions = PAPER_DIMENSIONS[paperSize];
  const displayWidth = dimensions?.width || 0;
  const displayHeight = dimensions?.height || 0;
  const shouldShowMinimumPrintMessage =
    totalPrint < MINIMUM_PRINT_RUN && totalPrint > 0;

  // --- Render ---
  return (
    <div className="mt-16">
      {/* Header */}
      <div className="relative mx-auto mb-16 flex flex-col items-center">
        <h1 className="relative text-5xl md:text-[75px] font-bold text-center mb-2 uppercase leading-[82%] tracking-tighter">
          PressPrice
        </h1>
        <p className="text-[22.5px] text-center uppercase m-2 leading-[82%]">
          Easily estimate the costs of screen printing projects
        </p>
        <p className="text-sm text-center max-w-lg leading-[92%]">
          The Screen Printing Calculator is a user-friendly tool designed to
          estimate the costs associated with hand-pulled screen printing on
          paper. It offers real-time price calculations based on user-defined
          parameters such as paper size and the number of colors.
        </p>
      </div>

      {/* Main Content */}
      <div className="w-[100vw] border-y border-primary -ml-[10px] pl-[10px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Input Section */}
          <div className="relative border-r border-primary pr-4 h-full">
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

              {/* Input Form */}
              <div className="mt-8 flex flex-col gap-4 items-start max-w-80">
                {/* Paper Size Slider */}
                <div className="w-full">
                  <label
                    htmlFor="sizeSlider"
                    className="block text-sm font-medium"
                  >
                    Paper Size: {paperSize}
                  </label>
                  <input
                    type="range"
                    id="sizeSlider"
                    min="0"
                    max={PAPER_SIZES.length - 1}
                    step="1"
                    value={paperSizeIndex}
                    onChange={handlePaperSizeChange}
                    className="mt-2 w-full appearance-none bg-foreground cursor-pointer h-0.5"
                    aria-label="Paper Size Selector"
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

                {/* Number of Colors Input */}
                <div className="w-full mt-6">
                  <label
                    htmlFor="colorCount"
                    className="block text-sm font-medium"
                  >
                    Number of Colors
                  </label>
                  <input
                    type="number"
                    id="colorCount"
                    className="mt-1 block w-full py-2 px-3 border border-primary bg-gray-200 dark:bg-gray-900 focus:outline-none focus:opacity-80 sm:text-sm"
                    value={colorCount}
                    onChange={(e) =>
                      setColorCount(
                        Math.max(0, parseInt(e.target.value, 10) || 0),
                      )
                    }
                    placeholder="Enter number of colors"
                    aria-label="Number of Colors"
                  />
                </div>

                {/* Total Prints Input */}
                <div className="w-full">
                  <label
                    htmlFor="totalPrints"
                    className="block text-sm font-medium"
                  >
                    Total Prints
                  </label>
                  <input
                    type="number"
                    id="totalPrints"
                    className="mt-1 block w-full py-2 px-3 border border-primary bg-gray-200 dark:bg-gray-900 focus:outline-none focus:opacity-80 sm:text-sm"
                    value={totalPrint}
                    onChange={(e) =>
                      setTotalPrint(
                        Math.max(0, parseInt(e.target.value, 10) || 0),
                      )
                    }
                    aria-label="Total Prints"
                  />
                </div>

                {/* Calculate Button */}
                <button
                  onClick={calculateCosts}
                  className="mb-4 bg-background hover:bg-primary border border-primary dark:bg-gray-900 dark:text-primary font-bold py-2 px-4 flex items-center"
                  disabled={loading}
                  aria-label="Calculate Costs"
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

              {/* Error Message */}
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

            {/* Results Table */}
            <div className="mb-[86px]">
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

            {/* Minimum Print Run Message */}
            {shouldShowMinimumPrintMessage && (
              <p className="text-gray-600 mt-2 mx-6 text-sm ">
                Minimum print run is {MINIMUM_PRINT_RUN} sheets.
              </p>
            )}
          </div>

          {/* Paper Size Display */}
          <div
            className="flex flex-col items-center justify-center mx-auto my-6 px-4"
            aria-label={`Paper Size: ${paperSize} Dimensions: ${displayWidth}mm x ${displayHeight}mm`}
          >
            <div
              className="border border-black flex flex-col justify-center items-start box-border mt-24 sm:mt-0 "
              style={{
                width: displayWidth,
                height: displayHeight,
                maxWidth: "100%",
                maxHeight: "80vh",
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
