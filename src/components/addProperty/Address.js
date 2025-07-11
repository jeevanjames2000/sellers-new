"use client";
import { useFormContext } from "react-hook-form";
import { useEffect, useState, useCallback, useId } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { debounce } from "lodash";
import {
  setCity,
  setLocality,
  setState,
} from "@/store/slices/addPropertySlice/addressSlice";
export default function Address({ property }) {
  const {
    register,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext();
  const dispatch = useDispatch();
  const {
    state: selectedState,
    city: selectedCity,
    locality: selectedLocality,
  } = useSelector((store) => store.address);
  const locality = watch("locality");
  const totalFloors = watch("total_floors");
  const subType = property?.sub_type;
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localitySuggestions, setLocalitySuggestions] = useState([]);
  const [localityInput, setLocalityInput] = useState("");
  const [openState, setOpenState] = useState(false);
  const [openCity, setOpenCity] = useState(false);
  const [openLocality, setOpenLocality] = useState(false);
  const [isInteracting, setIsInteracting] = useState({
    state_id: false,
    city_id: false,
    locality: false,
    property_name: false,
    builder_name: false,
    plot_number: false,
    villa_number: false,
    floors: false,
    total_floors: false,
  });
  const fetchStates = useCallback(async () => {
    try {
      const res = await fetch("https://api.meetowner.in/api/v1/getAllStates");
      const data = await res.json();
      setStates(data);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  }, []);
  const fetchCities = useCallback(async (state = null) => {
    try {
      const url = state
        ? `https://api.meetowner.in/api/v1/getAllCities?state=${encodeURIComponent(
            state
          )}`
        : `https://api.meetowner.in/api/v1/getAllCities`;
      const res = await fetch(url);
      const data = await res.json();
      const activeCities = data
        .filter((city) => city.status === "active")
        .reduce((acc, city) => {
          if (!acc.find((c) => c.city === city.city)) {
            acc.push(city);
          }
          return acc;
        }, []);
      setCities(activeCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      setCities([]);
    }
  }, []);
  const fetchDefaultLocalities = useCallback(
    async (city) => {
      if (!city) {
        setLocalitySuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://api.meetowner.in/api/v1/search?city=${encodeURIComponent(
            city
          )}`
        );
        const data = await res.json();
        const suggestions = data.slice(0, 10) || [];
        if (
          property?.location_id &&
          !suggestions.find((item) => item.locality === property.location_id)
        ) {
          suggestions.unshift({ locality: property.location_id });
        }
        setLocalitySuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching default localities:", error);
        setLocalitySuggestions([]);
      }
    },
    [property?.location_id]
  );
  const fetchLocalities = useCallback(
    debounce(async (city, query) => {
      if (!city) {
        setLocalitySuggestions([]);
        return;
      }
      if (query.length < 2) {
        return;
      }
      try {
        const res = await fetch(
          `https://api.meetowner.in/api/v1/search?city=${encodeURIComponent(
            city
          )}&query=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        const suggestions = data || [];
        if (
          property?.location_id &&
          !suggestions.find((item) => item.locality === property.location_id)
        ) {
          suggestions.unshift({ locality: property.location_id });
        }
        setLocalitySuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching localities:", error);
        setLocalitySuggestions([]);
      }
    }, 300),
    [property?.location_id]
  );
  useEffect(() => {
    fetchStates();
    if (property) {
      const fieldsToValidate = [];
      if (property.state_id) {
        dispatch(setState(property.state_id));
        setValue("state_id", property.state_id);
        fetchCities(property.state_id);
        fieldsToValidate.push("state_id");
      }
      if (property.city_id) {
        dispatch(setCity(property.city_id));
        setValue("city_id", property.city_id);
        fieldsToValidate.push("city_id");
        if (!property.location_id) {
          fetchDefaultLocalities(property.city_id);
        }
      }
      if (property.location_id) {
        dispatch(setLocality(property.location_id));
        setValue("locality", property.location_id);
        setLocalityInput(property.location_id);
        if (property.city_id) {
          fetchLocalities(property.city_id, property.location_id);
        }
        fieldsToValidate.push("locality");
      }
      if (property.property_name) {
        setValue("property_name", property.property_name);
        fieldsToValidate.push("property_name");
      }
      if (property.builder_name) {
        setValue("builder_name", property.builder_name);
        fieldsToValidate.push("builder_name");
      }
      if (
        property.floors &&
        [
          "Apartment",
          "Independent House",
          "Independent Villa",
          "Others",
        ].includes(subType)
      ) {
        setValue("floors", property.floors);
        fieldsToValidate.push("floors");
      }
      if (
        property.total_floors &&
        [
          "Apartment",
          "Independent House",
          "Independent Villa",
          "Others",
        ].includes(subType)
      ) {
        setValue("total_floors", property.total_floors);
        fieldsToValidate.push("total_floors");
      }
      if (property.plot_number && subType === "Plot") {
        setValue("plot_number", property.plot_number);
        fieldsToValidate.push("plot_number");
      }
      if (property.villa_number && subType === "Independent Villa") {
        const villaNumber = parseInt(property.villa_number);
        if (!isNaN(villaNumber) && villaNumber > 0) {
          setValue("villa_number", String(villaNumber));
          fieldsToValidate.push("villa_number");
        } else {
          console.warn(
            "Invalid villa_number in property:",
            property.villa_number
          );
        }
      }
      if (subType !== "Independent Villa") {
        setValue("villa_number", null);
      }
      if (fieldsToValidate.length > 0) {
        trigger(fieldsToValidate);
      }
    }
  }, [
    property,
    dispatch,
    setValue,
    trigger,
    fetchStates,
    fetchCities,
    fetchLocalities,
    fetchDefaultLocalities,
    subType,
  ]);
  useEffect(() => {
    if (selectedState) {
      fetchCities(selectedState);
      if (selectedState !== property?.state_id) {
        dispatch(setCity(""));
        setValue("city_id", "");
        dispatch(setLocality(""));
        setValue("locality", "");
        setLocalityInput("");
        setLocalitySuggestions([]);
        trigger(["city_id", "locality"]);
      }
    } else {
      fetchCities();
    }
  }, [
    selectedState,
    fetchCities,
    dispatch,
    setValue,
    trigger,
    property?.state_id,
  ]);
  useEffect(() => {
    if (selectedCity && selectedCity !== property?.city_id) {
      dispatch(setLocality(""));
      setValue("locality", "");
      setLocalityInput("");
      setLocalitySuggestions([]);
      trigger("locality");
      fetchDefaultLocalities(selectedCity);
    }
  }, [
    selectedCity,
    dispatch,
    setValue,
    trigger,
    property?.city_id,
    fetchDefaultLocalities,
  ]);
  const numberField = () => {
    switch (subType) {
      case "Plot":
        return {
          name: "plot_number",
          label: "Plot Number",
          placeholder: "Enter plot number",
        };
      case "Land":
        return {
          name: "plot_number",
          label: "Plot Number",
          placeholder: "Enter plot number",
        };
      case "Independent Villa":
        return {
          name: "villa_number",
          label: "Villa Number",
          placeholder: "Enter villa number",
        };
      default:
        return null;
    }
  };
  const showFloors = [
    "Apartment",
    "Office",
    "Retail Shop",
    "Show Room",
    "Warehouse",
    "Others",
  ].includes(subType);
  const showTotalFloors = [
    "Apartment",
    "Office",
    "Retail Shop",
    "Show Room",
    "Warehouse",
    "Others",
  ].includes(subType);
  const popoverId = useId();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>
          State <span className="text-red-500">*</span>
        </Label>
        <input
          type="hidden"
          {...register("state_id", {
            required: "Please select a state",
          })}
        />
        <Popover open={openState} onOpenChange={setOpenState} id={popoverId}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openState}
              className="w-full justify-between"
            >
              {selectedState || "Select State"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-[50vh]" align="start">
            <Command>
              <CommandInput placeholder="Search states…" />
              <CommandEmpty>No state found.</CommandEmpty>
              <CommandList>
                {states.map((state) => (
                  <CommandItem
                    key={state.state}
                    value={state.state}
                    onSelect={() => {
                      dispatch(setState(state.state));
                      setValue("state_id", state.state, {
                        shouldValidate: true,
                      });
                      setIsInteracting((prev) => ({
                        ...prev,
                        state_id: false,
                      }));
                      setOpenState(false);
                    }}
                  >
                    {state.state}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedState === state.state
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.state_id && !isInteracting.state_id && (
          <p className="text-red-500 text-sm">{errors.state_id.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>
          City <span className="text-red-500">*</span>
        </Label>
        <input
          type="hidden"
          {...register("city_id", {
            required: "Please select a city",
          })}
        />
        <Popover open={openCity} onOpenChange={setOpenCity}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCity}
              className="w-full justify-between"
            >
              {selectedCity || "Select City"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-[50vh]" align="start">
            <Command>
              <CommandInput placeholder="Search cities…" />
              <CommandEmpty>No city found.</CommandEmpty>
              <CommandList>
                {cities.map((city) => (
                  <CommandItem
                    key={city.city}
                    value={city.city}
                    onSelect={() => {
                      dispatch(setCity(city.city));
                      setValue("city_id", city.city, { shouldValidate: true });
                      setIsInteracting((prev) => ({ ...prev, city_id: false }));
                      setOpenCity(false);
                    }}
                  >
                    {city.city}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedCity === city.city ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.city_id && !isInteracting.city_id && (
          <p className="text-red-500 text-sm">{errors.city_id.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>
          Locality <span className="text-red-500">*</span>
        </Label>
        <input
          type="hidden"
          {...register("locality", {
            required: "Please select a locality",
          })}
        />
        <Popover
          open={openLocality}
          onOpenChange={(open) => {
            setOpenLocality(open);
            if (open) {
              setIsInteracting((prev) => ({ ...prev, locality: true }));
            } else {
              setIsInteracting((prev) => ({ ...prev, locality: false }));
              trigger("locality");
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openLocality}
              className="w-full justify-between"
            >
              {locality ||
                localityInput ||
                selectedLocality ||
                "Select Locality"}
              <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0 max-h-[50vh]" align="start">
            <Command>
              <CommandInput
                placeholder="Search localities"
                value={localityInput}
                onValueChange={(value) => {
                  setLocalityInput(value);
                  setIsInteracting((prev) => ({ ...prev, locality: true }));
                  if (selectedCity && value.length >= 2) {
                    fetchLocalities(selectedCity, value);
                  }
                }}
              />
              <CommandEmpty>No locality found.</CommandEmpty>
              <CommandList>
                {localitySuggestions.map((item) => (
                  <CommandItem
                    key={item.locality}
                    value={item.locality}
                    onSelect={() => {
                      if (item.locality !== selectedLocality) {
                        dispatch(setLocality(item.locality));
                        setValue("locality", item.locality, {
                          shouldValidate: true,
                        });
                        setLocalityInput(item.locality);
                      }
                      setIsInteracting((prev) => ({
                        ...prev,
                        locality: false,
                      }));
                      setOpenLocality(false);
                    }}
                  >
                    {item.locality}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        locality === item.locality ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.locality && !isInteracting.locality && (
          <p className="text-red-500 text-sm">{errors.locality.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>
          Property/Project Name <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("property_name", {
            required: "Property name is required",
            minLength: {
              value: 2,
              message: "Property name must be at least 2 characters",
            },
          })}
          placeholder="Enter property/project name"
          onFocus={() =>
            setIsInteracting((prev) => ({ ...prev, property_name: true }))
          }
          onBlur={() => {
            setIsInteracting((prev) => ({ ...prev, property_name: false }));
            trigger("property_name");
          }}
        />
        {errors.property_name && !isInteracting.property_name && (
          <p className="text-red-500 text-sm">{errors.property_name.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label>
          Builder Name <span className="text-red-500">*</span>
        </Label>
        <Input
          {...register("builder_name", {
            required: "Builder name is required",
            minLength: {
              value: 2,
              message: "Builder name must be at least 2 characters",
            },
          })}
          placeholder="Enter Builder name"
          onFocus={() =>
            setIsInteracting((prev) => ({ ...prev, builder_name: true }))
          }
          onBlur={() => {
            setIsInteracting((prev) => ({ ...prev, builder_name: false }));
            trigger("builder_name");
          }}
        />
        {errors.builder_name && !isInteracting.builder_name && (
          <p className="text-red-500 text-sm">{errors.builder_name.message}</p>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          {numberField() && (
            <div className="space-y-2">
              <Label>
                {numberField().label} <span className="text-red-500">*</span>
              </Label>
              <Input
                type={numberField().name === "villa_number" ? "number" : "text"}
                {...register(numberField().name, {
                  required: `${numberField().label} is required`,
                  validate:
                    numberField().name === "villa_number"
                      ? (value) => {
                          const intValue = parseInt(value);
                          return !isNaN(intValue) && intValue > 0
                            ? true
                            : `${
                                numberField().label
                              } must be a positive integer`;
                        }
                      : undefined,
                })}
                placeholder={numberField().placeholder}
                onFocus={() =>
                  setIsInteracting((prev) => ({
                    ...prev,
                    [numberField().name]: true,
                  }))
                }
                onBlur={() => {
                  setIsInteracting((prev) => ({
                    ...prev,
                    [numberField().name]: false,
                  }));
                  trigger(numberField().name);
                }}
              />
              {errors[numberField().name] &&
                !isInteracting[numberField().name] && (
                  <p className="text-red-500 text-sm">
                    {errors[numberField().name].message}
                  </p>
                )}
            </div>
          )}
          {showFloors && (
            <div className="space-y-2">
              <Label>
                Floor No. <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                {...register("floors", {
                  required: showFloors ? "Floor number is required" : false,
                  min: showFloors
                    ? { value: 0, message: "Floor number cannot be negative" }
                    : undefined,
                  max: showFloors
                    ? { value: 100, message: "Floor number cannot exceed 100" }
                    : undefined,
                  validate: (value) =>
                    !totalFloors ||
                    !showTotalFloors ||
                    parseInt(value) <= parseInt(totalFloors) ||
                    "Floor number cannot exceed total floors",
                })}
                placeholder="Enter floor number"
                onFocus={() =>
                  setIsInteracting((prev) => ({ ...prev, floors: true }))
                }
                onBlur={() => {
                  setIsInteracting((prev) => ({ ...prev, floors: false }));
                  trigger("floors");
                }}
              />
              {errors.floors && !isInteracting.floors && (
                <p className="text-red-500 text-sm">{errors.floors.message}</p>
              )}
            </div>
          )}
        </div>
        {showFloors && (
          <div className="space-y-2">
            <Label>
              Flat No. <span className="text-red-500">*</span>
            </Label>
            <Input
              {...register("unit_flat_house_no")}
              placeholder="Enter flat number"
            />
          </div>
        )}
      </div>
      {showTotalFloors && (
        <div className="space-y-2">
          <Label>
            Total Floors <span className="text-red-500">*</span>
          </Label>
          <Input
            type="number"
            {...register("total_floors", {
              required: showTotalFloors ? "Total floors is required" : false,
              min: showTotalFloors
                ? { value: 1, message: "Total floors must be at least 1" }
                : undefined,
              max: showTotalFloors
                ? { value: 100, message: "Total floors cannot exceed 100" }
                : undefined,
            })}
            placeholder="Enter total floors"
            onFocus={() =>
              setIsInteracting((prev) => ({ ...prev, total_floors: true }))
            }
            onBlur={() => {
              setIsInteracting((prev) => ({ ...prev, total_floors: false }));
              trigger("total_floors");
            }}
          />
          {errors.total_floors && !isInteracting.total_floors && (
            <p className="text-red-500 text-sm">
              {errors.total_floors.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
