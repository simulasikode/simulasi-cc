"use client";
import { useState, useEffect, useCallback } from "react";
import convert from "color-convert";
import { FaInfoCircle, FaCalculator, FaSyncAlt } from "react-icons/fa";

// Tailwind CSS Classes
const containerClasses = "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8";
const sectionClasses = "mb-8";
const headingClasses =
  "text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-8 mb-4";
const cardClasses = "border border-primary p-6";
const labelClasses = "block text-sm font-bold text-foreground mb-1";
const inputClasses =
  "focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-primary bg-gray-100 dark:bg-gray-900 py-2 px-3";
const buttonClasses =
  "bg-foreground hover:bg-primary text-background font-bold py-2 px-4  focus:outline-none";
const gridClasses = "grid grid-cols-12 gap-6";
const gridItemClasses = "col-span-12 md:col-span-5"; // Adjust based on desired layout
const colorBoxClasses = "w-full overflow-hidden relative";
const colorValueClasses =
  "absolute bottom-0 left-0 right-0 backdrop-blur-sm p-4";
const resultsClasses = "pt-4 border-t border-primary";

const ICC_PROFILES = [
  { name: "sRGB", path: "/icc/sRGB_v4_ICC_preference.icc" },
  { name: "Adobe RGB", path: "/icc/AdobeRGB1998.icc" },
  { name: "CMYK Coated", path: "/icc/CoatedFOGRA39.icc" },
  { name: "CMYK Uncoated", path: "/icc/UncoatedFOGRA29.icc" },
];

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface CMYK {
  c: number;
  m: number;
  y: number;
  k: number;
}
const useColorManagement = () => {
  const [selectedProfile, setSelectedProfile] = useState<string>("CMYK Coated");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const applyProfileAdjustment = (
    r: number,
    g: number,
    b: number,
    profile: string,
  ): RGB => {
    let adjustedRGB: RGB = { r, g, b };

    switch (profile) {
      case "CMYK Coated":
        adjustedRGB = {
          r: Math.min(255, r * 1.1),
          g: Math.min(255, g * 1.1),
          b: Math.min(255, b * 1.1),
        };
        break;
      case "CMYK Uncoated":
        adjustedRGB = {
          r: r * 0.9,
          g: g * 0.9,
          b: b * 0.9,
        };
        break;
      case "Adobe RGB":
        adjustedRGB = {
          r: Math.min(255, r * 1.2),
          g: Math.min(255, g * 1.15),
          b: Math.min(255, b * 1.15),
        };
        break;
      default:
        break;
    }

    return adjustedRGB;
  };

  const convertWithProfile = async (
    c: number,
    m: number,
    y: number,
    k: number,
    profile: string = "CMYK Coated",
  ): Promise<RGB> => {
    try {
      setIsLoading(true);

      // Pass c, m, y, and k as separate arguments
      const [r, g, b] = convert.cmyk.rgb(c, m, y, k);

      // Apply profile-specific adjustments
      const adjustedRGB = applyProfileAdjustment(r, g, b, profile);

      return {
        r: Math.round(adjustedRGB.r),
        g: Math.round(adjustedRGB.g),
        b: Math.round(adjustedRGB.b),
      };
    } catch (error: unknown) {
      console.error("Color conversion error:", error);

      // Check if the error is an instance of Error before accessing its message
      if (error instanceof Error) {
        console.error("Error message:", error.message);
      }

      return basicCMYKtoRGB(c, m, y, k);
    } finally {
      setIsLoading(false);
    }
  };

  const basicCMYKtoRGB = (c: number, m: number, y: number, k: number): RGB => {
    const C: number = c / 100;
    const M: number = m / 100;
    const Y: number = y / 100;
    const K: number = k / 100;

    const r: number = 255 * (1 - C) * (1 - K);
    const g: number = 255 * (1 - M) * (1 - K);
    const b: number = 255 * (1 - Y) * (1 - K);

    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
  };

  return {
    convertWithProfile,
    selectedProfile,
    setSelectedProfile,
    isLoading,
    availableProfiles: ICC_PROFILES.map((p) => p.name),
  };
};

const useColorSpaceConversion = () => {
  const cmykToRgb = (c: number, m: number, y: number, k: number): RGB => {
    const C: number = c / 100;
    const M: number = m / 100;
    const Y: number = y / 100;
    const K: number = k / 100;

    const r: number = 255 * (1 - C) * (1 - K);
    const g: number = 255 * (1 - M) * (1 - K);
    const b: number = 255 * (1 - Y) * (1 - K);

    const gammaCorrect = (value: number): number => {
      const v: number = value / 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };

    return {
      r: Math.round(gammaCorrect(r) * 255),
      g: Math.round(gammaCorrect(g) * 255),
      b: Math.round(gammaCorrect(b) * 255),
    };
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (n: number): string => {
      const hex: string = Math.round(n).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const getDisplayColor = (
    c: number,
    m: number,
    y: number,
    k: number,
  ): string => {
    const rgb: RGB = cmykToRgb(c, m, y, k);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  };

  return { cmykToRgb, rgbToHex, getDisplayColor };
};

const useHsbToCmyk = () => {
  const convertHsbToCmyk = (h: number, s: number, b: number): CMYK => {
    const [r, g, b_] = convert.hsv.rgb(h, s / 100, b / 100);
    //const rgb: number[] = convert.hsv.rgb(h, s, b); //color-convert will return an array
    const cmyk = convert.rgb.cmyk(r, g, b_);
    //const cmyk: number[] = convert.rgb.cmyk(rgb); //color-convert will return an array

    return {
      c: Math.round(cmyk[0]),
      m: Math.round(cmyk[1]),
      y: Math.round(cmyk[2]),
      k: Math.round(cmyk[3]),
    };
  };

  return { convertHsbToCmyk };
};

const ColorCalculator = () => {
  const [medium, setMedium] = useState(0);
  const { convertWithProfile, selectedProfile, setSelectedProfile } =
    useColorManagement();
  const { convertHsbToCmyk } = useHsbToCmyk();
  const { rgbToHex } = useColorSpaceConversion();

  const [cyan, setCyan] = useState(0);
  const [magenta, setMagenta] = useState(0);
  const [yellow, setYellow] = useState(0);
  const [black, setBlack] = useState(0);
  const [hue, setHue] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [brightness, setBrightness] = useState(100);
  const [colorValues, setColorValues] = useState({
    hex: "#FFFFFF",
    rgb: { r: 255, g: 255, b: 255 },
    cmyk: { c: 0, m: 0, y: 0, k: 0 },
  });

  const [results, setResults] = useState({
    Cyan: 0,
    Magenta: 0,
    Yellow: 0,
    Black: 0,
    Medium: 0,
    Retarder: 0,
    TotalWeight: 0,
  });

  // Implement better toast handling (replace with actual toast library integration)
  const showToast = (
    title: string,
    description: string,
    status: string,
  ): void => {
    alert(`${title}: ${description} (${status})`);
  };

  useEffect(() => {
    const calculateMixture = async () => {
      // Calculate total weight and total color
      const totalInput = cyan + magenta + yellow + black + medium;

      if (totalInput === 0) {
        return;
      }
    };

    calculateMixture();
  }, [cyan, magenta, yellow, black, medium]);

  const updateColors = useCallback(async () => {
    const rgb = await convertWithProfile(
      cyan,
      magenta,
      yellow,
      black,
      selectedProfile,
    );

    const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);

    setColorValues((prevColorValues) => {
      if (
        prevColorValues.hex !== hexColor ||
        prevColorValues.rgb.r !== rgb.r ||
        prevColorValues.rgb.g !== rgb.g ||
        prevColorValues.rgb.b !== rgb.b ||
        prevColorValues.cmyk.c !== cyan ||
        prevColorValues.cmyk.m !== magenta ||
        prevColorValues.cmyk.y !== yellow ||
        prevColorValues.cmyk.k !== black
      ) {
        return {
          hex: hexColor,
          rgb: rgb,
          cmyk: { c: cyan, m: magenta, y: yellow, k: black },
        };
      }

      return prevColorValues;
    });
  }, [
    cyan,
    magenta,
    yellow,
    black,
    selectedProfile,
    convertWithProfile,
    rgbToHex,
  ]);

  useEffect(() => {
    updateColors();
  }, [cyan, magenta, yellow, black, selectedProfile, updateColors]);

  const handleHsbCorrection = () => {
    const cmykValues = convertHsbToCmyk(hue, saturation, brightness);
    setCyan(cmykValues.c);
    setMagenta(cmykValues.m);
    setYellow(cmykValues.y);
    setBlack(cmykValues.k);

    showToast(
      "CMYK Updated",
      "CMYK values have been updated from HSB values.",
      "success",
    );
  };

  const handleHueChange = (newHue: number): void => {
    setHue(newHue);
    const [newR, newG, newB] = convert.hsv.rgb(newHue, saturation, brightness);
    const rgb = { r: newR, g: newG, b: newB };
    const hexColor = rgbToHex(rgb.r, rgb.g, rgb.b);
    setColorValues({
      hex: hexColor,
      rgb: { r: newR, g: newG, b: newB },
      cmyk: { c: cyan, m: magenta, y: yellow, k: black },
    });
  };

  const handleMediumChange = (
    value: string,
    setter: (value: number) => void,
  ): void => {
    const sanitizedValue = value.replace(/[^\d.]/g, "");
    const numValue = Math.min(
      Math.max(parseFloat(sanitizedValue) || 0, 0),
      100,
    );
    const roundedValue = Math.round(numValue * 100) / 100;
    setter(roundedValue);
  };

  const handleReset = () => {
    setCyan(0);
    setMagenta(0);
    setYellow(0);
    setBlack(0);
    setMedium(0);
    setHue(0);
    setSaturation(0);
    setBrightness(0);
    setColorValues({
      hex: "#000000",
      rgb: { r: 0, g: 0, b: 0 },
      cmyk: { c: 0, m: 0, y: 0, k: 0 },
    });
  };

  const handleCalculate = () => {
    const totalInput = cyan + magenta + yellow + black + medium;

    if (totalInput === 0) {
      showToast(
        "Invalid Input",
        "Please provide at least one non-zero percentage.",
        "error",
      );
      return;
    }

    const totalColor = cyan + magenta + yellow + black;
    const retarder = totalColor * 0.3;

    const weights = {
      Cyan: (cyan / totalInput) * 100,
      Magenta: (magenta / totalInput) * 100,
      Yellow: (yellow / totalInput) * 100,
      Black: (black / totalInput) * 100,
      Medium: (medium / totalInput) * 100,
      Retarder: retarder,
      TotalWeight: totalInput,
    };

    setResults(weights);
    showToast(
      "Calculation Complete",
      "Your color mixture has been calculated successfully.",
      "success",
    );
  };

  return (
    <div className={containerClasses}>
      <div className={sectionClasses}>
        <h1 className={headingClasses}>Process Color Calculator</h1>
      </div>

      <div className={gridClasses}>
        <div className={gridItemClasses}>
          <div className={cardClasses}>
            <div className={colorBoxClasses}>
              <div
                className="w-full h-64 sm:h-72"
                style={{ backgroundColor: colorValues.hex }}
              ></div>
              <div className={colorValueClasses}>
                <p className="font-semibold text-lg">
                  {colorValues.hex.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div>
                  <p className={labelClasses}>RGB</p>
                  <div>
                    <p className="text-sm">R: {colorValues.rgb.r}</p>
                    <p className="text-sm">G: {colorValues.rgb.g}</p>
                    <p className="text-sm">B: {colorValues.rgb.b}</p>
                  </div>
                </div>
                <div>
                  <p className={labelClasses}>HSB</p>
                  <div>
                    <p className="text-sm">H: {hue}°</p>
                    <p className="text-sm">S: {saturation}%</p>
                    <p className="text-sm">B: {brightness}%</p>
                  </div>
                </div>
                <div>
                  <p className={labelClasses}>CMYK</p>
                  <div>
                    <p className="text-sm">C: {cyan}%</p>
                    <p className="text-sm">M: {magenta}%</p>
                    <p className="text-sm">Y: {yellow}%</p>
                    <p className="text-sm">K: {black}%</p>
                  </div>
                </div>
              </div>

              {results && (
                <div className={resultsClasses}>
                  <p className="mb-2 font-bold">Results</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className={labelClasses}>Components</p>
                      <div>
                        <p className="text-sm">
                          Cyan: {results.Cyan.toFixed(1)} grams
                        </p>
                        <p className="text-sm">
                          Magenta: {results.Magenta.toFixed(1)} grams
                        </p>
                        <p className="text-sm">
                          Yellow: {results.Yellow.toFixed(1)} grams
                        </p>
                        <p className="text-sm">
                          Black: {results.Black.toFixed(1)} grams
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className={labelClasses}>Additives</p>
                      <div>
                        <p className="text-sm">
                          Medium: {results.Medium.toFixed(1)} grams
                        </p>
                        <p className="text-sm">
                          Retarder: {results.Retarder.toFixed(1)} grams
                        </p>
                        <p className="text-sm font-medium mt-1">
                          Total: {results.TotalWeight.toFixed(1)} grams
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4">
            <div className="flex space-x-4">
              <button className={buttonClasses} onClick={handleReset}>
                <FaInfoCircle className="inline-block mr-2" />
                Reset
              </button>
              <button className={buttonClasses} onClick={handleCalculate}>
                <FaCalculator className="inline-block mr-2" />
                Calculate
              </button>
            </div>
          </div>
        </div>

        <div className="col-span-12 md:col-span-7">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={cardClasses}>
              <h2 className="text-lg font-semibold mb-4">ICC Profile</h2>
              <div>
                <label htmlFor="profile" className={labelClasses}>
                  Select Color Profile:
                </label>
                <select
                  id="profile"
                  className={inputClasses}
                  value={selectedProfile}
                  onChange={(e) => setSelectedProfile(e.target.value)}
                >
                  {ICC_PROFILES.map((profile) => (
                    <option key={profile.path} value={profile.name}>
                      {profile.name}
                    </option>
                  ))}
                </select>
                <p className="text-gray-500 text-sm mt-2">
                  Select color profile for conversion
                </p>
              </div>
            </div>

            <div className={cardClasses}>
              <h2 className="text-lg font-semibold mb-4">Medium</h2>
              <div>
                <label htmlFor="medium" className={labelClasses}>
                  Medium:
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="medium"
                    className={inputClasses}
                    value={medium}
                    min={0}
                    max={100}
                    step={0.1}
                    onChange={(e) =>
                      handleMediumChange(e.target.value, setMedium)
                    }
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={cardClasses + " mt-6"}>
            <h2 className="text-lg font-semibold mb-4">HSB Color</h2>
            <div className="space-y-4">
              {[
                {
                  label: "Hue",
                  value: hue,
                  setter: setHue,
                  max: 360,
                  unit: "°",
                },
                {
                  label: "Saturation",
                  value: saturation,
                  setter: setSaturation,
                  max: 100,
                  unit: "%",
                },
                {
                  label: "Brightness",
                  value: brightness,
                  setter: setBrightness,
                  max: 100,
                  unit: "%",
                },
              ].map(({ label, value, setter, max, unit }) => (
                <div key={label}>
                  <label htmlFor={label.toLowerCase()} className={labelClasses}>
                    {label}:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id={label.toLowerCase()}
                      className={inputClasses}
                      value={value}
                      min={0}
                      max={max}
                      step={label === "Hue" ? 1 : 0.1}
                      onChange={(e) => {
                        const newValue = Math.min(
                          Math.max(parseFloat(e.target.value) || 0, 0),
                          max,
                        );
                        setter(newValue);
                        if (label === "Hue") handleHueChange(newValue);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">{unit}</span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="w-full mt-2">
                <div
                  className="relative h-5 cursor-pointer"
                  style={{
                    background:
                      "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)",
                  }}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = x / rect.width;
                    const newHue = Math.round(percentage * 360);
                    handleHueChange(Math.min(360, Math.max(0, newHue)));
                  }}
                >
                  <div
                    className="absolute left-0 top-[-2px] w-6 h-6 bg-white rounded-full border border-primary transform -translate-x-1/2"
                    style={{ left: `${(hue / 360) * 100}%` }}
                  />
                </div>
              </div>

              <button
                className={buttonClasses + " w-xs mt-4"}
                onClick={handleHsbCorrection}
              >
                <FaSyncAlt className="inline-block mr-2" />
                Update from HSB
              </button>
            </div>
          </div>

          <div className={cardClasses + " mt-6"}>
            <h2 className="text-lg font-semibold mb-4">CMYK Color</h2>
            <div className="space-y-4">
              {[
                { label: "Cyan", value: cyan, setter: setCyan },
                { label: "Magenta", value: magenta, setter: setMagenta },
                { label: "Yellow", value: yellow, setter: setYellow },
                { label: "Black", value: black, setter: setBlack },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label htmlFor={label.toLowerCase()} className={labelClasses}>
                    {label}:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id={label.toLowerCase()}
                      className={inputClasses}
                      value={value}
                      min={0}
                      max={100}
                      step={0.1}
                      onChange={(e) => {
                        const newValue = Math.min(
                          Math.max(parseFloat(e.target.value) || 0, 0),
                          100,
                        );
                        setter(newValue);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorCalculator;
