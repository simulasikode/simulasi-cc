"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import convert from "color-convert";
import { FaInfoCircle, FaCalculator, FaSyncAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoCheckmarkOutline, IoChevronDown } from "react-icons/io5";

// Tailwind CSS Classes
const containerClasses = "relative w-[100vw]";
const sectionClasses = "relative  m-16 flex flex-col  items-center ";
const headingClasses =
  "text-4xl sm:text-5xl lg:text-[75px] uppercase leading-[82%] tracking-tighter font-bold -ml-[10px] pl-[10px]";
const cardClasses = "p-8";
const labelClasses = "block text-sm font-bold text-foreground mb-2";
const inputClasses =
  "focus:outline-none block w-full sm:text-sm border border-primary bg-gray-50 dark:bg-[#161616] py-[10px] px-4";
const buttonClasses =
  "bg-foreground hover:bg-primary text-background text-xs text-left px-4 py-4 w-full  focus:outline-none cursor-pointer";
const gridClasses = "grid grid-cols-12 -ml-[10px] border-y border-primary";
const gridItemClasses = "col-span-12 md:col-span-4"; // Adjust based on desired layout
const colorBoxClasses = "w-full overflow-hidden relative";
const colorValueClasses =
  "absolute bottom-0 left-0 right-0 backdrop-blur-sm p-4";
const resultsClasses = "pt-4 ";

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

      const [r, g, b] = convert.cmyk.rgb(c, m, y, k);

      const adjustedRGB = applyProfileAdjustment(r, g, b, profile);

      return {
        r: Math.round(adjustedRGB.r),
        g: Math.round(adjustedRGB.g),
        b: Math.round(adjustedRGB.b),
      };
    } catch (error: unknown) {
      // Use 'any' here or provide a more specific type
      console.error("Color conversion error:", error);

      if (typeof error === "object" && error !== null && "message" in error) {
        console.error("Error message:", (error as { message: string }).message); // Type assertion
      } else {
        console.error("Unknown error type:", error);
      }
      //Fallback to Basic Conversion
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
    const [r, g, blue] = convert.hsv.rgb(h, s, b);
    //const rgb: number[] = convert.hsv.rgb(h, s, b); //color-convert will return an array
    const cmyk = convert.rgb.cmyk(r, g, blue);
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

  type ResultItem = { label: string; value: number }; // Type alias
  const [results, setResults] = useState<ResultItem[]>([
    { label: "Cyan", value: 0 },
    { label: "Magenta", value: 0 },
    { label: "Yellow", value: 0 },
    { label: "Black", value: 0 },
    { label: "Medium", value: 0 },
    { label: "Retarder", value: 0 },
    { label: "TotalWeight", value: 0 },
  ]);

  const toastFunctions = {
    success: toast.success,
    error: toast.error,
    info: toast.info,
    warning: toast.warning,
    dark: toast.dark,
  } as const;

  type ToastFunctionKey = keyof typeof toastFunctions;
  type ToastFunction = (typeof toastFunctions)[ToastFunctionKey];

  const showToast = (
    title: string,
    description: string,
    status: ToastFunctionKey,
  ): void => {
    const toastFunction: ToastFunction = toastFunctions[status];

    toastFunction(`${title}: ${description}`, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
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
    const retarder = totalColor * 0.15;

    const weights = [
      { label: "Cyan", value: (cyan / totalInput) * 100 },
      { label: "Magenta", value: (magenta / totalInput) * 100 },
      { label: "Yellow", value: (yellow / totalInput) * 100 },
      { label: "Black", value: (black / totalInput) * 100 },
      { label: "Medium", value: (medium / totalInput) * 100 },
      { label: "Retarder", value: retarder },
      { label: "TotalWeight", value: totalInput },
    ];

    setResults(weights);
    showToast(
      "Calculation Complete",
      "Your color mixture has been calculated successfully.",
      "success",
    );
  };

  interface Profile {
    name: string;
    path: string;
  }

  interface CustomSelectProps {
    options: Profile[];
    selectedProfile: string;
    setSelectedProfile: (profileName: string) => void;
  }

  const CustomSelect: React.FC<CustomSelectProps> = ({
    options,
    selectedProfile,
    setSelectedProfile,
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef<HTMLDivElement>(null); // Correct: Initial value is null

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          // Clicked outside the select
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div className="relative w-full" ref={selectRef}>
        <button
          type="button"
          className="flex items-center justify-between w-full px-4 py-2 border border-primary bg-gray-50 dark:bg-[#161616] text-left cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          {selectedProfile}
          <span>
            <IoChevronDown size={16} />
          </span>{" "}
          {/* Down arrow */}
        </button>
        {isOpen && (
          <div className="absolute left-0 right-0 bg-background dark:bg-[#161616] border border-primary">
            {options.map((profile) => (
              <CustomOption
                key={profile.path}
                profile={profile}
                selectedProfile={selectedProfile}
                setSelectedProfile={setSelectedProfile}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  interface CustomOptionProps {
    profile: Profile;
    selectedProfile: string;
    setSelectedProfile: (profileName: string) => void;
  }

  const CustomOption: React.FC<CustomOptionProps> = ({
    profile,
    selectedProfile,
    setSelectedProfile,
  }) => {
    const isSelected = profile.name === selectedProfile;
    return (
      <div
        className={`flex items-center justify-between px-4 py-2 cursor-pointer hover:opacity-60 dark:hover:bg-[#161616] ${
          isSelected ? "bg-background dark:bg-[#161616]" : ""
        }`}
        onClick={() => setSelectedProfile(profile.name)}
      >
        <span>{profile.name}</span>
        {isSelected && (
          <span className="text-foreground">
            <IoCheckmarkOutline />{" "}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className={containerClasses}>
      <div className={sectionClasses}>
        <h1 className={headingClasses}>The Color Process</h1>
        <p className="text-[22.5px] uppercase m-4 max-w-2xl leading-[82%] text-center">
          Digital tools are designed to simplify the complex process of color
          mixing and conversion.
        </p>
        <p className="text-sm text-center max-w-lg">
          These tools allow users to input color values from various models,
          such as CMYK and HSB. The ICC color profiles ensure accuracy across
          different devices and media. In addition to basic color conversion,
          these tools include a mixing calculator that enables users to specify
          desired colors and mixing ratios. This feature helps achieve precise
          color formulations for printing and other applications.
        </p>
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
                <p className="font-semibold text-lg dark:text-gray-900">
                  {colorValues.hex.toUpperCase()}
                </p>
              </div>
            </div>

            <div>
              {results && Array.isArray(results) && (
                <div className={resultsClasses}>
                  <p className="mb-2 font-bold">Results</p>
                  <div className="grid grid-cols-1 gap-4">
                    {/* Mapping Colors */}
                    <div>
                      <p className={labelClasses}>Colors</p>
                      <div>
                        {results
                          .filter((r: ResultItem) =>
                            ["Cyan", "Magenta", "Yellow", "Black"].includes(
                              r.label,
                            ),
                          )
                          .map((result: ResultItem) => (
                            <div
                              className="text-sm flex justify-between align-baseline mb-2 pb-2 border-b border-primary"
                              key={result.label}
                            >
                              <p>{result.label}</p>{" "}
                              <span>{result.value.toFixed(1)} grams</span>
                            </div>
                          ))}
                      </div>
                    </div>

                    {/* Mapping Medium */}
                    <div>
                      <p className={labelClasses}>Medium</p>
                      <div>
                        {results
                          .filter((r: ResultItem) =>
                            ["Medium", "Retarder", "TotalWeight"].includes(
                              r.label,
                            ),
                          )
                          .map((result: ResultItem) => (
                            <div
                              className={`text-sm justify-between flex border-b border-primary mb-2 pb-2${
                                result.label === "TotalWeight"
                                  ? "font-bold mb-2 pb-2"
                                  : ""
                              }`}
                              key={result.label}
                            >
                              <p>{result.label}</p>{" "}
                              <span>{result.value.toFixed(1)} grams</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-8 py-6">
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

        <div className="col-span-12 md:col-span-4 border-x border-primary">
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2">
            <div className={cardClasses}>
              <h2 className="text-lg font-bold mb-2">ICC Profile</h2>
              <div>
                <label htmlFor="profile" className={labelClasses}>
                  Select Color Profile:
                </label>
                <CustomSelect
                  options={ICC_PROFILES}
                  selectedProfile={selectedProfile}
                  setSelectedProfile={setSelectedProfile}
                />
                <p className="text-gray-500 text-xs mb-2 mt-2">
                  Select color profile for conversion
                </p>
              </div>
            </div>

            <div className={cardClasses}>
              <h2 className="text-lg font-semibold mb-2">Medium</h2>
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
                    step={1}
                    onChange={(e) =>
                      handleMediumChange(e.target.value, setMedium)
                    }
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 mr-6">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-4 border-t border-primary mt-2">
            <div className={cardClasses}>
              <h2 className="text-lg font-semibold mb-6">CMYK Input</h2>
              <div className="space-y-5">
                {[
                  { label: "Cyan", value: cyan, setter: setCyan },
                  { label: "Magenta", value: magenta, setter: setMagenta },
                  { label: "Yellow", value: yellow, setter: setYellow },
                  { label: "Black", value: black, setter: setBlack },
                ].map(({ label, value, setter }) => (
                  <div key={label}>
                    <label
                      htmlFor={label.toLowerCase()}
                      className={labelClasses}
                    >
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
                        step={1}
                        onChange={(e) => {
                          const newValue = Math.min(
                            Math.max(parseFloat(e.target.value) || 0, 0),
                            100,
                          );
                          setter(newValue);
                        }}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 mr-6">%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4">
          <div className={cardClasses}>
            <h2 className="text-lg font-semibold mb-2">HSB Input</h2>
            <p className="text-sm mb-10">
              The HSB model, which stands for Hue, Saturation, and Brightness,
              describes colors based on three parameters: hue (the dominant
              color), saturation (the intensity or purity of the color), and
              brightness (how light or dark the color is). This model provides a
              more intuitive way to understand color for many people, as it
              closely aligns with human perception of color.{" "}
            </p>
            <div className="w-full mt-2">
              <div
                className="relative h-5 cursor-pointer mb-4"
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
                      step={label === "Hue" ? 1 : 1}
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
                      <span className="text-gray-500 mr-6">{unit}</span>
                    </div>
                  </div>
                </div>
              ))}

              <button className={buttonClasses} onClick={handleHsbCorrection}>
                <FaSyncAlt className="inline-block mr-2" />
                Update from HSB
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ColorCalculator;
