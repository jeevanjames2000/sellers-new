"use client";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Building,
  Home,
  Building2,
  MapPin,
  Landmark,
  House,
  IndianRupee,
  Hotel,
  Store,
  Trees,
  Trash,
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCallback, useEffect, useMemo, useState } from "react";
import { formatCurrencyInWords } from "@/components/shared/formatCurrencyInWords";
import DatePicker from "@/components/ui/date-picker";
export default function PropertyDetails({
  property,
  setProperty,
  unique_property_id,
  places,
  setPlaces,
  fac,
  setFac,
}) {
  const {
    register,
    watch,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useFormContext();
  const formValues = watch();
  const propertySubtype = watch("sub_type");
  const isRent = formValues?.property_for === "Rent";
  const isSell = formValues?.property_for === "Sell";
  const isResidential = formValues?.property_in === "Residential";
  const isCommercial = formValues?.property_in === "Commercial";
  const [unit, setUnit] = useState("M");
  const [carCustomMode, setCarCustomMode] = useState(false);
  const [bikeCustomMode, setBikeCustomMode] = useState(false);
  const [openCustomMode, setOpenCustomMode] = useState(false);
  const [bathroomCustom, setBathroomCustom] = useState(false);
  const [balconyCustom, setBalconyCustom] = useState(false);
  const [bhkCustom, setBhkCustom] = useState(false);
  const [constructionEndDate, setConstructionEndDate] = useState(
    watch("under_construction") ? new Date(watch("under_construction")) : null
  );
  const [startDate, setStartDate] = useState(() => {
    if (property?.available_from) {
      const date = new Date(property.available_from);
      return !isNaN(date.getTime()) ? date : null;
    }
    const formDate = watch("available_from");
    if (formDate) {
      const date = new Date(formDate);
      return !isNaN(date.getTime()) ? date : null;
    }
    return null;
  });
  const handleConstructionEndDateChange = (selectedDates) => {
    const dateObj = selectedDates[0];
    let formatted = null;
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      formatted = `${year}-${month}-${day}`;
    }
    setConstructionEndDate(dateObj || null);
    setValue("under_construction", formatted, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };
  const handleStartDateChange = (selectedDates) => {
    const dateObj = selectedDates[0];
    let formatted = null;
    if (dateObj instanceof Date && !isNaN(dateObj)) {
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, "0");
      const day = String(dateObj.getDate()).padStart(2, "0");
      formatted = `${year}-${month}-${day}`;
    }
    setStartDate(dateObj || null);
    setValue("available_from", formatted, { shouldValidate: true });
    if (formatted) {
      setValue("possession_status", "Ready To Move In");
      setValue("occupancy", "Ready To Move In");
    }
  };
  const watchedFields = {
    security_deposit: watch("security_deposit"),
    under_construction: watch("under_construction"),
    lock_in: watch("lock_in"),
    land_sub_type: watch("land_sub_type"),
    brokerage_charge: watch("brokerage_charge"),
    property_cost: watch("property_cost"),
    monthly_rent: watch("monthly_rent"),
    types: watch("types"),
    occupancy: watch("occupancy"),
    pent_house: watch("pent_house"),
    loan_facility: watch("loan_facility"),
    investor_property: watch("investor_property"),
    servant_room: watch("servant_room"),
    facing: watch("facing"),
    car_parking: watch("car_parking"),
    bike_parking: watch("bike_parking"),
    open_parking: watch("open_parking"),
    bedrooms: watch("bedrooms"),
    bathroom: watch("bathroom"),
    balconies: watch("balconies"),
    furnished_status: watch("furnished_status"),
    possession_status: watch("possession_status"),
    facilities: watch("facilities") || [],
    area_units: watch("area_units"),
    nearbyPlace: watch("nearbyPlace"),
    distanceFromProperty: watch("distanceFromProperty"),
    rera_approved: watch("rera_approved"),
    ownership_type: watch("ownership_type"),
    property_age: watch("property_age"),
    passenger_lifts: watch("passenger_lifts"),
    service_lifts: watch("service_lifts"),
    stair_cases: watch("stair_cases"),
    private_parking: watch("private_parking"),
    public_parking: watch("public_parking"),
    private_washrooms: watch("private_washrooms"),
    public_washrooms: watch("public_washrooms"),
    unit_flat_house_no: watch("unit_flat_house_no"),
    plot_number: watch("plot_number"),
    zone_types: watch("zone_types"),
    suitable: watch("business_types"),
    pantry_room: watch("pantry_room"),
  };
  const formatFieldValue = (key, value) => {
    if (value === null || value === undefined || value === "") return "";
    switch (key) {
      case "brokerage_charge":
        const intVal = parseInt(value);
        return intVal === 30 ? "30 Days" : intVal === 15 ? "15 Days" : "None";
      case "security_deposit":
      case "lock_in":
        const months = parseInt(value);
        return isNaN(months)
          ? "0 Months"
          : `${months} Month${months > 1 ? "s" : ""}`;
      case "rera_approved":
        return value === 1 || value === "1" || value === true ? "Yes" : "No";
      case "bedrooms":
        const bhkMatch = value?.match(/^(\d+)/);
        const numericVal = bhkMatch ? bhkMatch[1] : parseInt(value) || 0;
        return numericVal === 0 ? "0" : `${numericVal} BHK`;
      case "bathroom":
      case "balconies":
      case "bike_parking":
      case "car_parking":
      case "open_parking":
        const num = parseInt(value);
        return !isNaN(num) ? `${num}` : 0;
      case "under_construction":
      case "available_from":
        if (value) {
          const date = new Date(value);
          if (!isNaN(date.getTime())) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
          }
        }
        return null;
      case "facilities":
        if (typeof value === "string") {
          return value
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        }
        return Array.isArray(value) ? value : [];
      case "property_age":
        const age = parseFloat(value);
        if (age <= 5) return "5.00";
        if (age <= 10) return "10.00";
        if (age <= 15) return "15.00";
        return "20.00";
      case "area_units":
        return normalizeAreaUnit(value);
      case "pent_house":
      case "servant_room":
      case "pantry_room":
      case "investor_property":
      case "loan_facility":
        return value;
      default:
        return `${value}`;
    }
  };
  
  useEffect(() => {
    if (property && property.id) {
      reset();
      const fields = [
        "sub_type",
        "property_for",
        "property_in",
        "land_sub_type",
        "rera_approved",
        "occupancy",
        "under_construction",
        "passenger_lifts",
        "service_lifts",
        "stair_cases",
        "private_parking",
        "public_parking",
        "private_washrooms",
        "public_washrooms",
        "bedrooms",
        "bathroom",
        "balconies",
        "furnished_status",
        "property_age",
        "available_from",
        "monthly_rent",
        "maintenance",
        "security_deposit",
        "lock_in",
        "brokerage_charge",
        "types",
        "area_units",
        "builtup_area",
        "carpet_area",
        "plot_area",
        "length_area",
        "width_area",
        "total_project_area",
        "total_project_area_type",
        "builtup_unit",
        "unit_cost_type",
        "property_cost",
        "property_cost_type",
        "pent_house",
        "facilities",
        "facing",
        "car_parking",
        "bike_parking",
        "open_parking",
        "unit_flat_house_no",
        "plot_number",
        "zone_types",
        "business_types",
        "pantry_room",
        "servant_room",
        "investor_property",
        "loan_facility",
        "possession_status",
        "ownership_type",
        "description",
      ];
      fields.forEach((key) => {
        if (key in property) {
          const formattedValue = formatFieldValue(key, property[key]);
          if (formattedValue !== null) {
            setValue(key, formattedValue, { shouldDirty: false });
          }
        }
      });
      if (property.under_construction) {
        const date = new Date(property.under_construction);
        if (!isNaN(date.getTime())) {
          setConstructionEndDate(date);
        }
      }
      if (property.available_from) {
        const date = new Date(property.available_from);
        if (!isNaN(date.getTime())) {
          setStartDate(date);
        }
      }
      if (property?.around_places?.length) {
        const mappedPlaces = property.around_places.map((place) => ({
          place_id: place.id,
          place: place.title?.trim() || "",
          distance: parseInt(place.distance) || 0,
        }));
        setPlaces(mappedPlaces);
      }
      if (property.facilities) {
        const cleanedFacilities = formatFieldValue(
          "facilities",
          property.facilities
        );
        setFac(cleanedFacilities);
        setValue("facilities", cleanedFacilities.join(", "), {
          shouldDirty: false,
        });
      }
    }
  }, [property, setValue, setPlaces, setFac, reset]);
  useEffect(() => {
    if (isCommercial && !propertySubtype && !property?.sub_type) {
      setValue("sub_type", "Office", { shouldValidate: true });
    }
    if (isResidential && isRent && ["Plot", "Land"].includes(propertySubtype)) {
      setValue("sub_type", "Apartment", { shouldValidate: true });
    }
  }, [
    isCommercial,
    isResidential,
    isRent,
    propertySubtype,
    property,
    setValue,
  ]);
  useEffect(() => {
    let defaultUnit;
    if (
      ["Apartment", "Independent Villa", "Independent House"].includes(
        propertySubtype
      )
    ) {
      defaultUnit = "Sq.ft";
    } else if (propertySubtype === "Plot") {
      defaultUnit = "Sq.yd";
    } else if (propertySubtype === "Land") {
      defaultUnit = "Acres";
    } else {
      defaultUnit = "Sq.ft";
    }
    if (!watchedFields.area_units) {
      setValue("area_units", defaultUnit, { shouldValidate: true });
    }
  }, [propertySubtype, setValue, watchedFields.area_units]);
  useEffect(() => {
    const config = [
      {
        value: watchedFields.car_parking,
        key: "car_parking",
        setCustom: setCarCustomMode,
        rawValue: property?.car_parking,
        options: parkingOptions,
        isBhk: false,
      },
      {
        value: watchedFields.bike_parking,
        key: "bike_parking",
        setCustom: setBikeCustomMode,
        rawValue: property?.bike_parking,
        options: parkingOptions,
        isBhk: false,
      },
      {
        value: watchedFields.open_parking,
        key: "open_parking",
        setCustom: setOpenCustomMode,
        rawValue: property?.open_parking,
        options: parkingOptions,
        isBhk: false,
      },
      {
        value: watchedFields.bedrooms,
        key: "bedrooms",
        setCustom: setBhkCustom,
        rawValue: property?.bedrooms,
        options: bhkOptions,
        isBhk: true,
      },
      {
        value: watchedFields.bathroom,
        key: "bathroom",
        setCustom: setBathroomCustom,
        rawValue: property?.bathroom,
        options: bathroomOptions,
        isBhk: false,
      },
      {
        value: watchedFields.balconies,
        key: "balconies",
        setCustom: setBalconyCustom,
        rawValue: property?.balconies,
        options: balconyOptions,
        isBhk: false,
      },
    ];
  
    config.forEach(({ key, setCustom, rawValue, options, isBhk }) => {
      const normalizedValue =
        rawValue == null || rawValue === "" || rawValue === "0"
          ? "0"
          : String(rawValue);
      const numericRawValue = parseInt(normalizedValue);
  
      if (!isNaN(numericRawValue) && numericRawValue > 4) {
        setCustom(true);
        setValue(key, normalizedValue, { shouldDirty: false, shouldValidate: false });
      } else if (options.includes(normalizedValue) || (isBhk && normalizedValue.match(/^\d+ BHK$/))) {
        setCustom(false);
        setValue(key, normalizedValue, { shouldDirty: false, shouldValidate: false });
      } else {
        setCustom(false);
        setValue(key, isBhk ? "1 BHK" : "0", { shouldDirty: false, shouldValidate: false });
      }
    });
  }, [property, setValue]); 
  const normalizeAreaUnit = (unit) => {
    const mapping = {
      "sq.ft": "Sq.ft",
      "sq.yd": "Sq.yd",
      acres: "Acres",
      sq: "Sq.ft",
    };
    return mapping[unit?.toLowerCase()] || "Sq.ft";
  };
  const fieldVisibility = useMemo(
    () => ({
      ...(isResidential &&
        isSell && {
          Apartment: {
            rera_approved: true,
            occupancy: true,
            bedrooms: true,
            bathroom: true,
            balconies: true,
            furnished_status: true,
            property_age: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            facilities: true,
            investor_property: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          "Independent House": {
            rera_approved: true,
            occupancy: true,
            bedrooms: true,
            bathroom: true,
            balconies: true,
            furnished_status: true,
            property_age: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            pent_house: true,
            property_cost: true,
            facilities: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          "Independent Villa": {
            rera_approved: true,
            occupancy: true,
            bathroom: true,
            balconies: true,
            furnished_status: true,
            property_age: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            pent_house: true,
            property_cost: true,
            facilities: true,
            investor_property: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          Plot: {
            rera_approved: true,
            property_age: true,
            area_units: true,
            length_area: true,
            builtup_unit: true,
            width_area: true,
            plot_area: true,
            total_project_area: true,
            property_cost: true,
            possession_status: true,
            investor_property: true,
            loan_facility: true,
            facing: true,
            around_places: true,
            description: true,
            plot_number: true,
          },
          Land: {
            rera_approved: true,
            area_units: true,
            length_area: true,
            builtup_unit: true,
            width_area: true,
            total_project_area: true,
            property_cost: true,
            possession_status: true,
            loan_facility: true,
            facing: true,
            around_places: true,
            description: true,
            plot_number: true,
            land_sub_type: true,
          },
        }),
      ...(isCommercial &&
        isSell && {
          Office: {
            rera_approved: true,
            occupancy: true,
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            facilities: true,
            unit_flat_house_no: true,
            zone_types: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
          "Retail Shop": {
            rera_approved: true,
            occupancy: true,
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            facilities: true,
            unit_flat_house_no: true,
            suitable: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            description: true,
          },
          "Show Room": {
            rera_approved: true,
            occupancy: true,
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            facilities: true,
            unit_flat_house_no: true,
            suitable: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
          Warehouse: {
            rera_approved: true,
            occupancy: true,
            area_units: true,
            plot_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            unit_flat_house_no: true,
            zone_types: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            description: true,
          },
          Plot: {
            rera_approved: true,
            area_units: true,
            length_area: true,
            width_area: true,
            plot_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            possession_status: true,
            ownership_type: true,
            unit_flat_house_no: true,
            suitable: true,
            investor_property: true,
            loan_facility: true,
            facing: true,
            around_places: true,
            description: true,
          },
          Others: {
            rera_approved: true,
            occupancy: true,
            area_units: true,
            plot_area: true,
            total_project_area: true,
            builtup_unit: true,
            property_cost: true,
            ownership_type: true,
            unit_flat_house_no: true,
            suitable: true,
            loan_facility: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
        }),
      ...(isResidential &&
        isRent && {
          Apartment: {
            bedrooms: true,
            bathroom: true,
            balconies: true,
            furnished_status: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            types: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            facilities: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          "Independent House": {
            bedrooms: true,
            furnished_status: true,
            available_from: true,
            bathroom: true,
            balconies: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            types: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            plot_area: true,
            total_project_area: true,
            pent_house: true,
            facilities: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
          "Independent Villa": {
            bedrooms: true,
            furnished_status: true,
            bathroom: true,
            balconies: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            types: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            plot_area: true,
            total_project_area: true,
            pent_house: true,
            facilities: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            servant_room: true,
            description: true,
            unit_flat_house_no: true,
          },
        }),
      ...(isCommercial &&
        isRent && {
          Office: {
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            facilities: true,
            unit_flat_house_no: true,
            zone_types: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
          "Retail Shop": {
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            facilities: true,
            unit_flat_house_no: true,
            suitable: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            description: true,
          },
          "Show Room": {
            passenger_lifts: true,
            service_lifts: true,
            stair_cases: true,
            private_parking: true,
            public_parking: true,
            private_washrooms: true,
            public_washrooms: true,
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            builtup_area: true,
            carpet_area: true,
            total_project_area: true,
            facilities: true,
            unit_flat_house_no: true,
            suitable: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
          Warehouse: {
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            plot_area: true,
            total_project_area: true,
            unit_flat_house_no: true,
            zone_types: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            description: true,
          },
          Plot: {
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            length_area: true,
            width_area: true,
            plot_area: true,
            total_project_area: true,
            unit_flat_house_no: true,
            suitable: true,
            facing: true,
            around_places: true,
            description: true,
          },
          Others: {
            available_from: true,
            monthly_rent: true,
            maintenance: true,
            security_deposit: true,
            lock_in: true,
            brokerage_charge: true,
            area_units: true,
            plot_area: true,
            total_project_area: true,
            unit_flat_house_no: true,
            suitable: true,
            facing: true,
            car_parking: true,
            bike_parking: true,
            open_parking: true,
            around_places: true,
            pantry_room: true,
            description: true,
          },
        }),
    }),
    [isResidential, isCommercial, isRent, isSell, propertySubtype]
  );
  const isFieldVisible = useCallback(
    (field) => fieldVisibility[propertySubtype]?.[field] || false,
    [fieldVisibility, propertySubtype]
  );
  const formatDistance = (meters) => {
    if (meters < 1000) return `${meters}m`;
    const km = meters / 1000;
    return km % 1 === 0 ? `${km}km` : `${km.toFixed(1)}km`;
  };
  const handleAdd = () => {
    const distNum = Number(watchedFields.distanceFromProperty);
    if (!watchedFields.nearbyPlace?.trim() || !distNum || isNaN(distNum))
      return;
    const distInMeters = unit === "KM" ? distNum * 1000 : distNum;
    setPlaces((prev) => [
      ...prev,
      { place: watchedFields.nearbyPlace.trim(), distance: distInMeters },
    ]);
    setValue("nearbyPlace", "");
    setValue("distanceFromProperty", "");
  };
  const handleDelete = async (placeid) => {
    if (placeid) {
      try {
        const res = await fetch(
          `https://api.meetowner.in/property/deleteplacesaroundproperty`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ placeid, unique_property_id }),
          }
        );
        if (!res.ok) {
          const data = await res.json();
          console.error("Failed to delete place:", data);
        }
      } catch (error) {
        console.error("Error deleting place:", error);
      }
    }
    const updatedPlaces = places.filter((p) => p.place_id !== placeid);
    setPlaces(updatedPlaces);
  };
  const handleFacilityChange = (facility, checked) => {
    setFac((prev) => {
      let updated = [...prev];
      if (facility === "None" && checked) return ["None"];
      updated = updated.filter((f) => f !== "None");
      if (checked && !updated.includes(facility)) updated.push(facility);
      else if (!checked) updated = updated.filter((f) => f !== facility);
      return updated;
    });
  };
  useEffect(() => {
    const cleanedString = fac.join(", ");
    setValue("facilities", cleanedString, { shouldDirty: true });
  }, [fac, setValue]);
  const propertySubtypes = [
    { id: "Apartment", label: "Apartment", icon: Building },
    { id: "Independent House", label: "Independent House", icon: Home },
    { id: "Independent Villa", label: "Independent Villa", icon: Building2 },
    { id: "Plot", label: "Plot", icon: MapPin },
    { id: "Land", label: "Land", icon: Landmark },
  ];
  const commercialSubTypes = [
    { id: "Office", label: "Office", icon: Building },
    { id: "Retail Shop", label: "Retail Shop", icon: Home },
    { id: "Show Room", label: "Showroom", icon: Building2 },
    { id: "Warehouse", label: "Warehouse", icon: Landmark },
    { id: "Plot", label: "Plot", icon: MapPin },
    { id: "Others", label: "Others", icon: MapPin },
  ];
  const landSubtypes = [
    { id: "Villa Development", label: "Villa Development", icon: House },
    {
      id: "Apartment Development",
      label: "Apartment development",
      icon: Hotel,
    },
    {
      id: "Commercial Development",
      label: "Commercial Development",
      icon: Store,
    },
    { id: "Out Rate Sale", label: "Out Rate Sale", icon: IndianRupee },
    { id: "Farm Land", label: "Farm Land", icon: Trees },
  ];
  const facilitiesOptions = [
    "Lift",
    "CCTV",
    "Gym",
    "Garden",
    "Club House",
    "Sports",
    "Swimming Pool",
    "Intercom",
    "Power Backup",
    "Gated Community",
    "Regular Water",
    "Community Hall",
    "Pet Allowed",
    "Entry / Exit",
    "Outdoor Fitness Station",
    "Half Basket Ball Court",
    "Gazebo",
    "Badminton Court",
    "Children Play area",
    "Ample Greenery",
    "Water Harvesting Pit",
    "Water Softener",
    "Solar Fencing",
    "Security Cabin",
    "Lawn",
    "Transformer Yard",
    "Amphitheatre",
    "Lawn with Stepping Stones",
    "None",
  ];
  const facingOptions = ["East", "West", "South", "North"];
  const parkingOptions = ["0", "1", "2", "3", "4", "4+"];
  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "4+ BHK"];
  const bathroomOptions = ["1", "2", "3", "4", "4+"];
  const balconyOptions = ["1", "2", "3", "4", "4+"];
  const furnishOptions = ["Fully", "Semi", "Unfurnished"];
  const ownershipOptions = [
    "Freehold",
    "Leasehold",
    "Cooperative society",
    "Power of attorney",
  ];
  const tenantTypeOptions = [
    "Anyone",
    "Family",
    "Bachelors",
    "Single Men",
    "Single Women",
  ];
  const zone_typesOptions = [
    "IT Park",
    "Industrial",
    "Commercial",
    "Special Economic Zone",
    "Open Spaces",
    "Agriculture Zone",
    "Others",
  ];
  const suitableOptions = [
    "Jewellery",
    "Gym",
    "Grocery",
    "Clinic",
    "Footwear",
    "Electronics",
    "Clothing",
    "Others",
  ];
  return (
    <div className="space-y-8 sm:space-y-2 gap-4">
      {!isCommercial && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-2">
            <Label>Property Sub Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {propertySubtypes
              .filter(
                (type) =>
                  !(
                    isResidential &&
                    isRent &&
                    ["Plot", "Land"].includes(type.id)
                  )
              )
              .map((type) => {
                const IconComponent = type.icon;
                const isSelected = propertySubtype === type.id;
                return (
                  <Button
                    key={type.id}
                    type="button"
                    onClick={() =>
                      setValue("sub_type", type.id, { shouldValidate: true })
                    }
                    className={`h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-xs ${
                      isSelected
                        ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                        : "bg-white text-black hover:bg-gray-100 border"
                    }`}
                  >
                    <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                    <span className="text-center leading-tight">
                      {type.label}
                    </span>
                  </Button>
                );
              })}
          </div>
          <input
            type="hidden"
            {...register("sub_type", {
              required: "Property Sub Type is required",
            })}
          />
          {errors.sub_type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.sub_type.message}
            </p>
          )}
        </div>
      )}
      {isCommercial && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center gap-2">
            <Label>Commercial Sub Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {commercialSubTypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = propertySubtype === type.id;
              return (
                <Button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setValue("sub_type", type.id, { shouldValidate: true })
                  }
                  className={`h-16 sm:h-20 flex flex-col items-center justify-center space-y-1 sm:space-y-2 text-xs ${
                    isSelected
                      ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="text-center leading-tight">
                    {type.label}
                  </span>
                </Button>
              );
            })}
          </div>
          <input
            type="hidden"
            {...register("sub_type", {
              required: "Commercial Sub Type is required",
            })}
          />
          {errors.sub_type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.sub_type.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("land_sub_type") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Land Sub Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {landSubtypes.map((type) => {
              const IconComponent = type.icon;
              const isSelected = watchedFields.land_sub_type === type.id;
              return (
                <Button
                  key={type.id}
                  type="button"
                  onClick={() =>
                    setValue("land_sub_type", type.id, { shouldValidate: true })
                  }
                  className={`h-16 sm:h-20 p-1 w-auto flex flex-col items-center justify-center space-y-1 text-xs text-center break-words ${
                    isSelected
                      ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="w-full truncate text-center leading-tight">
                    {type.label}
                  </span>
                </Button>
              );
            })}
          </div>
          <input
            type="hidden"
            {...register("land_sub_type", {
              required: "Land Sub Type is required",
            })}
          />
          {errors.land_sub_type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.land_sub_type.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("rera_approved") && (
        <div className="w-full sm:w-3/4 md:w-1/2 space-y-2">
          <div className="flex items-center gap-2">
            <Label>Rera Approved</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Yes", "No"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("rera_approved", val, { shouldValidate: true })
                }
                className={`px-6 sm:px-8 py-3 capitalize ${
                  watchedFields.rera_approved === val
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {val}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("rera_approved", {
              required: "Rera Approved is required",
            })}
          />
          {errors.rera_approved && (
            <p className="text-red-500 text-sm mt-1">
              {errors.rera_approved.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("occupancy") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Construction Status</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Ready to move", "Under Construction"].map((status) => (
              <Button
                key={status}
                type="button"
                onClick={() => {
                  setValue("occupancy", status, { shouldValidate: true });
                  if (status !== "Under Construction") {
                    setValue("under_construction", null);
                    setConstructionEndDate(null);
                  }
                }}
                className={`px-4 sm:px-6 py-3 ${
                  watchedFields.occupancy === status
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {status}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("occupancy", {
              required: "Construction Status is required",
            })}
          />
          {errors.occupancy && (
            <p className="text-red-500 text-sm mt-1">
              {errors.occupancy.message}
            </p>
          )}
          {watchedFields.occupancy === "Under Construction" && (
            <div className="space-y-2 mt-4">
              <div className="flex items-center gap-2">
                <Label>Possession End Date</Label>
                <span className="text-red-500">*</span>
              </div>
              <DatePicker
                id="constructionEndDate"
                onChange={handleConstructionEndDateChange}
                defaultDate={constructionEndDate}
                placeholder="Select possession end date"
              />
              <input
                type="hidden"
                {...register("under_construction", {
                  required:
                    watchedFields.occupancy === "Under Construction"
                      ? "Possession End Date is required"
                      : false,
                })}
              />
              {errors.under_construction && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.under_construction.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      {(isFieldVisible("passenger_lifts") ||
        isFieldVisible("service_lifts") ||
        isFieldVisible("stair_cases")) && (
        <>
          <Label className="text-base sm:text-lg font-medium mt-10">
            Lifts & Stair Cases
          </Label>
          <div className="grid grid-cols-1 lg:grid-cols-3 mb-4 gap-4 sm:gap-6">
            {isFieldVisible("passenger_lifts") && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Passenger Lifts</Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  {...register("passenger_lifts", {
                    required: "Passenger Lifts is required",
                  })}
                  placeholder="Enter Passenger lifts"
                  className="w-full"
                />
                {errors.passenger_lifts && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.passenger_lifts.message}
                  </p>
                )}
              </div>
            )}
            {isFieldVisible("service_lifts") && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Service Lifts</Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  {...register("service_lifts", {
                    required: "Service Lifts is required",
                  })}
                  placeholder="Enter Service lifts"
                  className="w-full"
                />
                {errors.service_lifts && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.service_lifts.message}
                  </p>
                )}
              </div>
            )}
            {isFieldVisible("stair_cases") && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Stair Cases</Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  {...register("stair_cases", {
                    required: "Stair Cases is required",
                  })}
                  placeholder="Enter Stair cases"
                  className="w-full"
                />
                {errors.stair_cases && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.stair_cases.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {(isFieldVisible("private_parking") ||
        isFieldVisible("public_parking")) && (
        <>
          <Label className="text-base sm:text-lg font-medium mt-10">
            Parking
          </Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 mb-4 gap-4 sm:gap-6">
            {isFieldVisible("private_parking") && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Private Parking</Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  {...register("private_parking", {
                    required: "Private Parking is required",
                  })}
                  placeholder="Enter Private parking"
                  className="w-full"
                />
                {errors.private_parking && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.private_parking.message}
                  </p>
                )}
              </div>
            )}
            {isFieldVisible("public_parking") && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Public Parking</Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  {...register("public_parking", {
                    required: "Public Parking is required",
                  })}
                  placeholder="Enter Public parking"
                  className="w-full"
                />
                {errors.public_parking && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.public_parking.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
      {(isFieldVisible("private_washrooms") ||
        isFieldVisible("public_washrooms")) && (
        <>
          <Label className="text-base sm:text-lg font-medium mt-10">
            Washrooms
          </Label>
          <div className="grid grid-cols-1 lg:grid-cols-2 mb-4 gap-4 sm:gap-6">
            {isFieldVisible("private_washrooms") && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Private Washrooms</Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  {...register("private_washrooms", {
                    required: "Private Washrooms is required",
                  })}
                  placeholder="Enter Private washrooms"
                  className="w-full"
                />
                {errors.private_washrooms && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.private_washrooms.message}
                  </p>
                )}
              </div>
            )}
            {isFieldVisible("public_washrooms") && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Label>Public Washrooms</Label>
                  <span className="text-red-500">*</span>
                </div>
                <Input
                  {...register("public_washrooms", {
                    required: "Public Washrooms is required",
                  })}
                  placeholder="Enter Public washrooms"
                  className="w-full"
                />
                {errors.public_washrooms && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.public_washrooms.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </>
      )}
{isFieldVisible("bedrooms") && (
  <div className="space-y-4">
    <Label>BHK</Label>
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
      {bhkOptions.map((option) => (
        <Button
          key={option}
          type="button"
          variant={
            watchedFields.bedrooms === option ||
            (bhkCustom && option === "4+ BHK")
              ? "default"
              : "outline"
          }
          onClick={() => {
            setBhkCustom(option === "4+ BHK");
            setValue("bedrooms", option === "4+ BHK" ? "" : option, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
            watchedFields.bedrooms === option ||
            (bhkCustom && option === "4+ BHK")
              ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
              : "bg-white text-black hover:bg-gray-100 border"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
    <input
      type="hidden"
      {...register("bedrooms", {
        required: "BHK is required",
      })}
    />
    {errors.bedrooms && (
      <p className="text-red-500 text-sm mt-1">{errors.bedrooms.message}</p>
    )}
    {bhkCustom && (
      <div className="flex items-center gap-2 mt-2">
        <Input
          type="number"
          placeholder="Enter custom BHK"
          className="w-full sm:w-1/2"
          value={watchedFields.bedrooms || ""}
          onChange={(e) =>
            setValue("bedrooms", e.target.value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setBhkCustom(false);
            setValue("bedrooms", "1 BHK", { shouldValidate: true, shouldDirty: true });
          }}
          className="text-sm"
        >
          Clear
        </Button>
      </div>
    )}
  </div>
)}
     {isFieldVisible("bathroom") && (
  <div className="space-y-4">
    <Label>Bathroom</Label>
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
      {bathroomOptions.map((option) => (
        <Button
          key={option}
          type="button"
          variant={
            watchedFields.bathroom === option ||
            (bathroomCustom && option === "4+")
              ? "default"
              : "outline"
          }
          onClick={() => {
            setBathroomCustom(option === "4+");
            setValue("bathroom", option === "4+" ? "" : option, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
            watchedFields.bathroom === option ||
            (bathroomCustom && option === "4+")
              ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
              : "bg-white text-black hover:bg-gray-100 border"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
    <input
      type="hidden"
      {...register("bathroom", {
        required: "Bathroom is required",
       
      })}
    />
    {errors.bathroom && (
      <p className="text-red-500 text-sm mt-1">{errors.bathroom.message}</p>
    )}
    {bathroomCustom && (
      <div className="flex items-center gap-2 mt-2">
        <Input
          type="number"
          placeholder="Enter custom bathroom"
          className="w-full sm:w-1/2"
          value={watchedFields.bathroom || ""}
          onChange={(e) =>
            setValue("bathroom", e.target.value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setBathroomCustom(false);
            setValue("bathroom", "0", { shouldValidate: true, shouldDirty: true });
          }}
          className="text-sm"
        >
          Clear
        </Button>
      </div>
    )}
  </div>
)}
     {isFieldVisible("balconies") && (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Label>Balcony</Label>
      <span className="text-red-500">*</span>
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-4">
      {balconyOptions.map((option) => (
        <Button
          key={option}
          type="button"
          variant={
            watchedFields.balconies === option ||
            (balconyCustom && option === "4+")
              ? "default"
              : "outline"
          }
          onClick={() => {
            setBalconyCustom(option === "4+");
            setValue("balconies", option === "4+" ? "" : option, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
            watchedFields.balconies === option ||
            (balconyCustom && option === "4+")
              ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
              : "bg-white text-black hover:bg-gray-100 border"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
    <input
      type="hidden"
      {...register("balconies", {
        required: "Balcony is required",
      })}
    />
    {errors.balconies && (
      <p className="text-red-500 text-sm mt-1">{errors.balconies.message}</p>
    )}
    {balconyCustom && (
      <div className="flex items-center gap-2 mt-2">
        <Input
          type="number"
          placeholder="Enter custom balcony"
          className="w-full sm:w-1/2"
          value={watchedFields.balconies || ""}
          onChange={(e) =>
            setValue("balconies", e.target.value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setBalconyCustom(false);
            setValue("balconies", "0", { shouldValidate: true, shouldDirty: true });
          }}
          className="text-sm"
        >
          Clear
        </Button>
      </div>
    )}
  </div>
)}
      {isFieldVisible("furnished_status") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Furnish Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {furnishOptions.map((option) => (
              <Button
                key={option}
                type="button"
                onClick={() =>
                  setValue("furnished_status", option, { shouldValidate: true })
                }
                className={`px-4 sm:px-6 py-3 ${
                  watchedFields.furnished_status === option
                    ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("furnished_status", {
              required: "Furnish Type is required",
            })}
          />
          {errors.furnished_status && (
            <p className="text-red-500 text-sm mt-1">
              {errors.furnished_status.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("property_age") && (
        <div className="space-y-2">
          <Label>Age of Property</Label>
          <Select
            value={watchedFields.property_age}
            onValueChange={(value) => setValue("property_age", value)}
            className="bg-white"
          >
            <SelectTrigger className="w-full sm:w-1/2 mb-2 bg-white">
              <SelectValue placeholder="0-5" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5.00">0-5 years</SelectItem>
              <SelectItem value="10.00">5-10 years</SelectItem>
              <SelectItem value="15.00">10-15 years</SelectItem>
              <SelectItem value="20.00">15+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
      {isFieldVisible("available_from") && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Available from</Label>
            <span className="text-red-500">*</span>
          </div>
          <DatePicker
            id="startDate"
            onChange={handleStartDateChange}
            defaultDate={startDate}
            placeholder="Select start date"
          />
          <input
            type="hidden"
            {...register("available_from", {
              required: "Available from is required",
            })}
          />
          {errors.available_from && (
            <p className="text-red-500 text-sm mt-1">
              {errors.available_from.message}
            </p>
          )}
        </div>
      )}
      {(isFieldVisible("monthly_rent") || isFieldVisible("maintenance")) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4 sm:gap-6">
          {isFieldVisible("monthly_rent") && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Monthly Rent</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                {...register("monthly_rent", {
                  required: "Monthly Rent is required",
                })}
                placeholder="Monthly Rent"
                className="w-full"
              />
              {errors.monthly_rent && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.monthly_rent.message}
                </p>
              )}
            </div>
          )}
          {isFieldVisible("maintenance") && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>Maintenance Charge (per Month)</Label>
                <span className="text-red-500">*</span>
              </div>
              <Input
                {...register("maintenance", {
                  required: "Maintenance Charge is required",
                })}
                placeholder="Maintenance Charge"
                className="w-full"
              />
              {errors.maintenance && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.maintenance.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 sm:gap-6">
        {isFieldVisible("area_units") && (
          <div className="space-y-2">
            <Label>Area units</Label>
            <Select
              value={normalizeAreaUnit(watchedFields.area_units)}
              onValueChange={(value) => setValue("area_units", value)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Sq.ft">Sq.ft</SelectItem>
                <SelectItem value="Sq.yd">Sq.yd</SelectItem>
                <SelectItem value="Acres">Acres</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {isFieldVisible("builtup_area") && (
          <div className="space-y-2">
            <div className="flex items-center gap-1">
              <Label>Built-up Area (Sq.ft)</Label>
              <span className="text-red-500">*</span>
            </div>
            <Input
              {...register("builtup_area", {
                required: "Built-up Area is required",
              })}
              placeholder="Built-up Area"
              className="w-full"
            />
            {errors.builtup_area && (
              <p className="text-red-500 text-sm mt-1">
                {errors.builtup_area.message}
              </p>
            )}
          </div>
        )}
        {isFieldVisible("carpet_area") && (
          <div className="space-y-2">
            <Label>Carpet Area (Sq.ft)</Label>
            <Input
              {...register("carpet_area")}
              placeholder="Carpet Area"
              className="bg-white w-full"
            />
          </div>
        )}
        {isFieldVisible("plot_area") && (
          <div className="space-y-2">
            <Label>Plot Area (Sq.yd)</Label>
            <Input
              {...register("plot_area")}
              placeholder="Plot Area"
              className="w-full"
            />
          </div>
        )}
        {isFieldVisible("length_area") && (
          <div className="space-y-2">
            <Label>Length Area (Sq.ft)</Label>
            <Input
              {...register("length_area")}
              placeholder="Length Area"
              className="w-full"
            />
          </div>
        )}
        {isFieldVisible("width_area") && (
          <div className="space-y-2">
            <Label>Width Area (Sq.ft)</Label>
            <Input
              {...register("width_area")}
              placeholder="Width Area"
              className="w-full"
            />
          </div>
        )}
        {isFieldVisible("total_project_area") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Total Project Area</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="flex items-center border rounded-md overflow-hidden">
              <Input
                {...register("total_project_area", {
                  required: "Total Project Area is required",
                })}
                placeholder="Enter Total Project Area"
                className="flex-1 border-none focus:ring-0 focus:outline-none px-3"
              />
              <Select
                value={watch("total_project_area_type")}
                onValueChange={(value) =>
                  setValue("total_project_area_type", value)
                }
              >
                <SelectTrigger className="border-l px-3 h-full w-24">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="acres">Acres</SelectItem>
                  <SelectItem value="sq.yd">Sq.yd</SelectItem>
                  <SelectItem value="sq.ft">Sq.ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.total_project_area && (
              <p className="text-red-500 text-sm mt-1">
                {errors.total_project_area.message}
              </p>
            )}
          </div>
        )}
        {isFieldVisible("builtup_unit") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Unit Cost (₹)</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="flex items-center border rounded-md overflow-hidden">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  ₹
                </span>
                <Input
                  {...register("builtup_unit", {
                    required: "Unit Cost is required",
                  })}
                  placeholder="Unit Cost"
                  className="pl-8 border-none focus:ring-0 focus:outline-none w-full"
                />
              </div>
              <Select
                value={watch("unit_cost_type")}
                onValueChange={(value) => setValue("unit_cost_type", value)}
              >
                <SelectTrigger className="border-l px-3 h-full w-28">
                  <SelectValue placeholder="Select price type" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="onwards">Onwards</SelectItem>
                  <SelectItem value="between">Between</SelectItem>
                  <SelectItem value="on-request">On Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.builtup_unit && (
              <p className="text-red-500 text-sm mt-1">
                {errors.builtup_unit.message}
              </p>
            )}
          </div>
        )}
        {isFieldVisible("property_cost") && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label>Property Cost</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="flex items-center border rounded-md overflow-hidden">
              <Input
                {...register("property_cost", {
                  required: "Property Cost is required",
                })}
                placeholder="Property Cost"
                className="flex-1 border-none focus:ring-0 focus:outline-none px-3"
              />
              <Select
                value={watch("property_cost_type")}
                onValueChange={(value) => setValue("property_cost_type", value)}
              >
                <SelectTrigger className="border-l px-3 h-full w-28">
                  <SelectValue placeholder="Onwards" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="onwards">Onwards</SelectItem>
                  <SelectItem value="between">Between</SelectItem>
                  <SelectItem value="on-request">On Request</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {errors.property_cost && (
              <p className="text-red-500 text-sm mt-1">
                {errors.property_cost.message}
              </p>
            )}
            {watchedFields.property_cost &&
              !isNaN(watchedFields.property_cost) && (
                <p className="text-sm text-gray-500 italic mt-1">
                  {formatCurrencyInWords(watchedFields.property_cost)}
                </p>
              )}
          </div>
        )}
        {isFieldVisible("pent_house") && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label>Pent House</Label>
              <span className="text-red-500">*</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              {["Yes", "No"].map((val) => (
                <Button
                  key={val}
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setValue("pent_house", val, { shouldValidate: true })
                  }
                  className={`px-6 sm:px-8 py-3 capitalize ${
                    watchedFields.pent_house === val
                      ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                      : "bg-white text-black hover:bg-gray-100 border"
                  }`}
                >
                  {val}
                </Button>
              ))}
            </div>
            <input
              type="hidden"
              {...register("pent_house", {
                required: "Pent House is required",
              })}
            />
            {errors.pent_house && (
              <p className="text-red-500 text-sm mt-1">
                {errors.pent_house.message}
              </p>
            )}
          </div>
        )}
      </div>
      {isFieldVisible("security_deposit") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Security Deposit</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {["1 Month", "2 Months", "3 Months"].map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("security_deposit", item, { shouldValidate: true })
                }
                className={`px-4 sm:px-6 py-3 capitalize ${
                  watchedFields.security_deposit === item
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("security_deposit", {
              required: "Security Deposit is required",
            })}
          />
          {errors.security_deposit && (
            <p className="text-red-500 text-sm mt-1">
              {errors.security_deposit.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("lock_in") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Lock in period</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {["1 Month", "2 Months", "3 Months"].map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("lock_in", item, { shouldValidate: true })
                }
                className={`px-4 sm:px-6 py-3 capitalize ${
                  watchedFields.lock_in === item
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("lock_in", {
              required: "Lock in period is required",
            })}
          />
          {errors.lock_in && (
            <p className="text-red-500 text-sm mt-1">
              {errors.lock_in.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("brokerage_charge") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Do you charge Brokerage</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
            {["None", "15 Days", "30 Days"].map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("brokerage_charge", item, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
                className={`px-4 sm:px-6 py-3 capitalize ${
                  watchedFields.brokerage_charge === item
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("brokerage_charge", {
              required: "Brokerage Charge is required",
            })}
          />
          {errors.brokerage_charge && (
            <p className="text-red-500 text-sm mt-1">
              {errors.brokerage_charge.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("types") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Preferred Tenant Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-4">
            {tenantTypeOptions.map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("types", item, { shouldValidate: true })
                }
                className={`px-3 sm:px-6 py-3 text-xs sm:text-sm capitalize ${
                  watchedFields.types === item
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("types", {
              required: "Preferred Tenant Type is required",
            })}
          />
          {errors.types && (
            <p className="text-red-500 text-sm mt-1">{errors.types.message}</p>
          )}
        </div>
      )}
      {isFieldVisible("ownership_type") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Ownership Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
            {ownershipOptions.map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("ownership_type", item, { shouldValidate: true })
                }
                className={`px-3 sm:px-6 py-3 text-xs sm:text-sm capitalize ${
                  watchedFields.ownership_type === item
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("ownership_type", {
              required: "Ownership Type is required",
            })}
          />
          {errors.ownership_type && (
            <p className="text-red-500 text-sm mt-1">
              {errors.ownership_type.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("facilities") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Facilities</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {facilitiesOptions.map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={facility}
                  checked={fac.includes(facility)}
                  onCheckedChange={(checked) =>
                    handleFacilityChange(facility, checked)
                  }
                />
                <label
                  htmlFor={facility}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {facility}
                </label>
              </div>
            ))}
          </div>
          <input
            type="hidden"
            {...register("facilities", {
              required: "At least one facility is required",
              validate: (value) =>
                value.trim() !== "" || "At least one facility is required",
            })}
          />
          {errors.facilities && (
            <p className="text-red-500 text-sm mt-1">
              {errors.facilities.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("facing") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Facing</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            {facingOptions.map((option) => (
              <Button
                key={option}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("facing", option, { shouldValidate: true })
                }
                className={`px-4 sm:px-6 py-3 capitalize ${
                  watchedFields.facing === option
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {option}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("facing", { required: "Facing is required" })}
          />
          {errors.facing && (
            <p className="text-red-500 text-sm mt-1">{errors.facing.message}</p>
          )}
        </div>
      )}
      {(isFieldVisible("car_parking") ||
        isFieldVisible("bike_parking") ||
        isFieldVisible("open_parking")) && (
        <div className="space-y-4">
          <Label>Parking</Label>
          <div className="space-y-6">
 {isFieldVisible("car_parking") && (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label>Car Parking</Label>
      <span className="text-red-500">*</span>
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-4">
      {parkingOptions.map((option) => (
        <Button
          key={option}
          type="button"
          variant={
            watchedFields.car_parking === option ||
            (carCustomMode && option === "4+")
              ? "default"
              : "outline"
          }
          onClick={() => {
            setCarCustomMode(option === "4+");
            setValue("car_parking", option === "4+" ? "" : option, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
            watchedFields.car_parking === option ||
            (carCustomMode && option === "4+")
              ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
              : "bg-white text-black hover:bg-gray-100 border"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
    <input
      type="hidden"
      {...register("car_parking", {
        required: "Car Parking is required",
       
      })}
    />
    {errors.car_parking && (
      <p className="text-red-500 text-sm mt-1">{errors.car_parking.message}</p>
    )}
    {carCustomMode && (
      <div className="flex items-center gap-2 mt-2">
        <Input
          type="number"
          placeholder="Enter custom car parking"
          className="w-full sm:w-1/2"
          value={watchedFields.car_parking || ""}
          onChange={(e) =>
            setValue("car_parking", e.target.value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setCarCustomMode(false);
            setValue("car_parking", "0", { shouldValidate: true, shouldDirty: true });
          }}
          className="text-sm"
        >
          Clear
        </Button>
      </div>
    )}
  </div>
)}
 {isFieldVisible("bike_parking") && (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label>Bike Parking</Label>
      <span className="text-red-500">*</span>
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-4">
      {parkingOptions.map((option) => (
        <Button
          key={option}
          type="button"
          variant={
            watchedFields.bike_parking === option ||
            (bikeCustomMode && option === "4+")
              ? "default"
              : "outline"
          }
          onClick={() => {
            setBikeCustomMode(option === "4+");
            setValue("bike_parking", option === "4+" ? "" : option, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
            watchedFields.bike_parking === option ||
            (bikeCustomMode && option === "4+")
              ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
              : "bg-white text-black hover:bg-gray-100 border"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
    <input
      type="hidden"
      {...register("bike_parking", {
        required: "Bike Parking is required",
      
      })}
    />
    {errors.bike_parking && (
      <p className="text-red-500 text-sm mt-1">{errors.bike_parking.message}</p>
    )}
    {bikeCustomMode && (
      <div className="flex items-center gap-2 mt-2">
        <Input
          type="number"
          placeholder="Enter custom bike parking"
          className="w-full sm:w-1/2"
          value={watchedFields.bike_parking || ""}
          onChange={(e) =>
            setValue("bike_parking", e.target.value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setBikeCustomMode(false);
            setValue("bike_parking", "0", { shouldValidate: true, shouldDirty: true });
          }}
          className="text-sm"
        >
          Clear
        </Button>
      </div>
    )}
  </div>
)}
{isFieldVisible("open_parking") && (
  <div className="space-y-2">
    <div className="flex items-center gap-2">
      <Label>Open Parking</Label>
      <span className="text-red-500">*</span>
    </div>
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-4">
      {parkingOptions.map((option) => (
        <Button
          key={option}
          type="button"
          variant={
            watchedFields.open_parking === option ||
            (openCustomMode && option === "4+")
              ? "default"
              : "outline"
          }
          onClick={() => {
            setOpenCustomMode(option === "4+");
            setValue("open_parking", option === "4+" ? "" : option, {
              shouldValidate: true,
              shouldDirty: true,
            });
          }}
          className={`w-12 sm:w-16 h-10 sm:h-12 text-xs sm:text-sm capitalize ${
            watchedFields.open_parking === option ||
            (openCustomMode && option === "4+")
              ? "bg-[#1D3A76] text-white hover:bg-[#1D3A76]"
              : "bg-white text-black hover:bg-gray-100 border"
          }`}
        >
          {option}
        </Button>
      ))}
    </div>
    <input
      type="hidden"
      {...register("open_parking", {
        required: "Open Parking is required",
      })}
    />
    {errors.open_parking && (
      <p className="text-red-500 text-sm mt-1">{errors.open_parking.message}</p>
    )}
    {openCustomMode && (
      <div className="flex items-center gap-2 mt-2">
        <Input
          type="number"
          placeholder="Enter custom open parking"
          className="w-full sm:w-1/2"
          value={watchedFields.open_parking || ""}
          onChange={(e) =>
            setValue("open_parking", e.target.value, {
              shouldDirty: true,
              shouldValidate: true,
            })
          }
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setOpenCustomMode(false);
            setValue("open_parking", "0", { shouldValidate: true, shouldDirty: true });
          }}
          className="text-sm"
        >
          Clear
        </Button>
      </div>
    )}
  </div>
)}
 </div>
        </div>
      )}
      {isFieldVisible("around_places") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Nearby Places</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="space-y-2">
              <Label>Place</Label>
              <Input
                {...register("nearbyPlace")}
                placeholder="Enter place"
                className="w-full"
              />
              {}
            </div>
            <div className="space-y-2">
              <Label>Distance from Property</Label>
              <div className="flex items-center border rounded-md overflow-hidden">
                <Input
                  {...register("distanceFromProperty")}
                  placeholder="Enter distance"
                  className="flex-1 border-none focus:ring-0 focus:outline-none px-3"
                />
                <Select
                  value={unit}
                  onValueChange={setUnit}
                  className="border-l px-3 h-full w-24"
                >
                  <SelectTrigger className="border-l px-3 h-full w-24">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M">Meters</SelectItem>
                    <SelectItem value="KM">Kilometers</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {}
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                onClick={handleAdd}
                className="w-full sm:w-auto bg-[#1D3A76] hover:bg-[#1D3A76]"
              >
                Add
              </Button>
            </div>
          </div>
          {places.length > 0 && (
            <div className="mt-4">
              <Label className="mb-4">Around this property</Label>
              <div className="space-y-2">
                {places.map((place, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border p-2 rounded-md"
                  >
                    <span>
                      {place.place} ({formatDistance(place.distance)})
                    </span>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(place.place_id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <input
            type="hidden"
            {...register("places", {
              validate: () =>
                places.length > 0 || "At least one nearby place is required",
            })}
          />
          {errors.places && (
            <p className="text-red-500 text-sm mt-1">{errors.places.message}</p>
          )}
        </div>
      )}
      {isFieldVisible("servant_room") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Servant Room</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Yes", "No"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("servant_room", val, { shouldValidate: true })
                }
                className={`px-6 sm:px-8 py-3 capitalize ${
                  watchedFields.servant_room === val
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {val}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("servant_room", {
              required: "Servant Room is required",
            })}
          />
          {errors.servant_room && (
            <p className="text-red-500 text-sm mt-1">
              {errors.servant_room.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("pantry_room") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Pantry Room</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Yes", "No"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("pantry_room", val, { shouldValidate: true })
                }
                className={`px-6 sm:px-8 py-3 capitalize ${
                  watchedFields.pantry_room === val
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {val}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("pantry_room", {
              required: "Pantry Room is required",
            })}
          />
          {errors.pantry_room && (
            <p className="text-red-500 text-sm mt-1">
              {errors.pantry_room.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("investor_property") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Investor Property</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Yes", "No"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("investor_property", val, { shouldValidate: true })
                }
                className={`px-6 sm:px-8 py-3 capitalize ${
                  watchedFields.investor_property === val
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {val}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("investor_property", {
              required: "Investor Property is required",
            })}
          />
          {errors.investor_property && (
            <p className="text-red-500 text-sm mt-1">
              {errors.investor_property.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("loan_facility") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Loan Facility</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Yes", "No"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("loan_facility", val, { shouldValidate: true })
                }
                className={`px-6 sm:px-8 py-3 capitalize ${
                  watchedFields.loan_facility === val
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {val}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("loan_facility", {
              required: "Loan Facility is required",
            })}
          />
          {errors.loan_facility && (
            <p className="text-red-500 text-sm mt-1">
              {errors.loan_facility.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("unit_flat_house_no") && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Unit/Flat/House No</Label>
            <span className="text-red-500">*</span>
          </div>
          <Input
            {...register("unit_flat_house_no", {
              required: "Unit/Flat/House No is required",
            })}
            placeholder="Enter Unit/Flat/House No"
            className="w-full"
          />
          {errors.unit_flat_house_no && (
            <p className="text-red-500 text-sm mt-1">
              {errors.unit_flat_house_no.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("plot_number") && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Plot Number</Label>
            <span className="text-red-500">*</span>
          </div>
          <Input
            {...register("plot_number", {
              required: "Plot Number is required",
            })}
            placeholder="Enter Plot Number"
            className="w-full"
          />
          {errors.plot_number && (
            <p className="text-red-500 text-sm mt-1">
              {errors.plot_number.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("zone_types") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Zone Type</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
            {zone_typesOptions.map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("zone_types", item, { shouldValidate: true })
                }
                className={`px-3 sm:px-6 py-3 text-xs sm:text-sm capitalize ${
                  watchedFields.zone_types === item
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("zone_types", { required: "Zone Type is required" })}
          />
          {errors.zone_types && (
            <p className="text-red-500 text-sm mt-1">
              {errors.zone_types.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("suitable") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Suitable For</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4">
            {suitableOptions.map((item) => (
              <Button
                key={item}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("business_types", item, { shouldValidate: true })
                }
                className={`px-3 sm:px-6 py-3 text-xs sm:text-sm capitalize ${
                  watchedFields.suitable === item
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {item}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("business_types", {
              required: "Suitable For is required",
            })}
          />
          {errors.suitable && (
            <p className="text-red-500 text-sm mt-1">
              {errors.suitable.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("possession_status") && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Label>Possession Status</Label>
            <span className="text-red-500">*</span>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {["Immediate", "Future"].map((val) => (
              <Button
                key={val}
                type="button"
                variant="outline"
                onClick={() =>
                  setValue("possession_status", val, { shouldValidate: true })
                }
                className={`px-6 sm:px-8 py-3 capitalize ${
                  watchedFields.possession_status === val
                    ? "bg-[#1D3A76] text-white hover:text-white hover:bg-[#1D3A76]"
                    : "bg-white text-black hover:bg-gray-100 border"
                }`}
              >
                {val}
              </Button>
            ))}
          </div>
          <input
            type="hidden"
            {...register("possession_status", {
              required: "Possession Status is required",
            })}
          />
          {errors.possession_status && (
            <p className="text-red-500 text-sm mt-1">
              {errors.possession_status.message}
            </p>
          )}
        </div>
      )}
      {isFieldVisible("description") && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label>Description</Label>
            <span className="text-red-500">*</span>
          </div>
          <Textarea
            {...register("description", {
              required: "Description is required",
            })}
            placeholder="Enter property description"
            className="w-full h-32"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
