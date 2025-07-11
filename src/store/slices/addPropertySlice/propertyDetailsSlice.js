import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uniquePropertyId: "",
  propertyName: "",
  userId: "",
  expiryDate: "",
  propertyType: "",
  subType: "",
  propertyFor: "",
  unitFlatHouseNo: "",
  stateId: "",
  cityId: "",
  locationId: "",
  street: "",
  address: "",
  zipcode: "",
  latitude: "",
  longitude: "",
  bedrooms: "",
  builtupArea: "",
  builtupUnit: "",
  additionalAmount: "",
  propertyCost: "",
  bathroom: "",
  balconies: "",
  propertyIn: "",
  facing: "",
  carParking: "",
  bikeParking: "",
  facilities: [],
  floors: "",
  furnishedStatus: "",
  transactionType: "",
  ownerName: "",
  mobile: "",
  whatsapp: "",
  landline: "",
  email: "",
  occupancy: "",
  description: "",
  videoLink: "",
  propertyStatus: 0,
  adminApprovedStatus: "",
  postedBy: 1,
  paidDetails: "",
  otherInfo: "",
  createdDate: "",
  createdTime: "",
  updatedDate: "",
  updatedTime: "",
  adminApprovalDate: "",
  image: "",
  googleAddress: "",
  userType: "",
  totalFloors: "",
  openParking: "",
  carpetArea: "",
  underConstruction: "",
  readyToMove: "",
  updatedFrom: "",
  propertyAge: "",
  types: "",
  availableFrom: "",
  monthlyRent: "",
  securityDeposit: "",
  maintenance: "",
  lockIn: "",
  brokerageCharge: "",
  plotArea: "",
  ownershipType: "",
  lengthArea: "",
  widthArea: "",
  zoneTypes: "",
  businessTypes: "",
  reraApproved: "",
  passengerLifts: "",
  serviceLifts: "",
  stairCases: "",
  privateParking: "",
  publicParking: "",
  privateWashrooms: "",
  publicWashrooms: "",
  areaUnits: "",
  pentHouse: "",
  servantRoom: "",
  possessionStatus: "",
  builderPlot: "",
  investorProperty: "",
  loanFacility: "",
  plotNumber: "",
  pantryRoom: "",
  totalProjectArea: "",
  uploadedFromSellerPanel: "No",
  featuredProperty: "No",
  totalProjectAreaType: "",
  landSubType: "",
  unitCostType: "",
  propertyCostType: "",
};

const propertySlice = createSlice({
  name: "propertyDetails",
  initialState,
  reducers: {
    updatePropertyDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetPropertyDetails: () => initialState,
    setPropertyIn: (state, action) => {
      state.propertyIn = action.payload;
    },
    setPropertyFor: (state, action) => {
      state.propertyFor = action.payload;
    },
    setTransactionType: (state, action) => {
      state.transactionType = action.payload;
    },
    setPropertyDetails: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const {
  updatePropertyDetails,
  resetPropertyDetails,
  setPropertyIn,
  setPropertyFor,
  setTransactionType,
  setPropertyDetails,
} = propertySlice.actions;

export default propertySlice.reducer;
