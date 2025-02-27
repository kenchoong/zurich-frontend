import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface BillingRecord {
  id: number;
  productId: string;
  location: string;
  premiumPaidAmount: number;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

interface BillingRecordResponse {
  id: number;
  productId: string;
  location: string;
  premiumPaidAmount: number;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateBillingRecord {
  productCode: string;
  location: string;
  premiumPaid: number;
  email: string;
  firstName: string;
  lastName: string;
  photo: string;
}

interface UpdateBillingRecord {
  location: string;
  premiumPaid: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  photo?: string;
}

interface BillingState {
  records: BillingRecord[];
  loading: boolean;
  error: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;
}

const initialState: BillingState = {
  records: [],
  loading: false,
  error: null,
  createError: null,
  updateError: null,
  deleteError: null,
};

// Async thunks for CRUD operations
export const fetchBillingRecords = createAsyncThunk<
  BillingRecordResponse[],
  { productCode?: string; location?: string } | undefined
>("billing/fetchRecords", async (filters) => {
  const params = new URLSearchParams();
  if (filters?.productCode) params.append("productCode", filters.productCode);
  if (filters?.location) params.append("location", filters.location);

  const accessToken = localStorage.getItem("accessToken");
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/billing-records?${params}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
  return response.data;
});

export const createBillingRecord = createAsyncThunk<
  BillingRecordResponse,
  CreateBillingRecord
>("billing/createRecord", async (record, { rejectWithValue }) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/billing-records`,
      {
        productId: record.productCode,
        location: record.location,
        premiumPaidAmount: record.premiumPaid * 100,
        email: record.email,
        firstName: record.firstName,
        lastName: record.lastName,
        photo: record.photo,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return { ...response.data, productId: record.productCode };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Please log in again");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
});

export const updateBillingRecord = createAsyncThunk<
  BillingRecordResponse,
  { id: number; data: UpdateBillingRecord }
>("billing/updateRecord", async ({ id, data }, { rejectWithValue }) => {
  const accessToken = localStorage.getItem("accessToken");
  try {
    console.log("Updating record with id:", id);
    console.log("Update data:", data);
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/billing-records?id=${id}`,
      {
        location: data.location,
        premiumPaidAmount: data.premiumPaid * 100,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        photo: data.photo,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized: Please log in again");
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
});

export const deleteBillingRecord = createAsyncThunk<number, number>(
  "billing/deleteRecord",
  async (id, { rejectWithValue }) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      console.log("Deleting record with id:", id);
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/billing-records?id=${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return rejectWithValue("Unauthorized: Please log in again");
        }
        return rejectWithValue(
          error.response?.data?.message || "An unexpected error occurred"
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const billingSlice = createSlice({
  name: "billing",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch records
      .addCase(fetchBillingRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingRecords.fulfilled, (state, action) => {
        state.loading = false;
        state.records = (action.payload as BillingRecordResponse[]).map(
          (record) => ({
            ...record,
            id: record.id,
            productId: record.productId.toString(),
            location: record.location,
            premiumPaidAmount: Number(record.premiumPaidAmount) / 100,
            email: record.email || "",
            firstName: record.firstName || "",
            lastName: record.lastName || "",
            photo: record.photo || "",
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          })
        );
      })
      .addCase(fetchBillingRecords.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.error.message === "string"
            ? action.error.message
            : "Failed to fetch records";
      })
      // Create record
      .addCase(createBillingRecord.fulfilled, (state, action) => {
        const newRecord = {
          ...action.payload,
          id: action.payload.id,
          productId: action.payload.productId.toString(),
          location: action.payload.location,
          premiumPaidAmount: Number(action.payload.premiumPaidAmount) / 100,
          email: action.payload.email || "",
          firstName: action.payload.firstName || "",
          lastName: action.payload.lastName || "",
          photo: action.payload.photo || "",
          createdAt: action.payload.createdAt,
          updatedAt: action.payload.updatedAt,
        };
        state.records.push(newRecord);
        state.createError = null;
      })
      .addCase(createBillingRecord.rejected, (state, action) => {
        state.createError =
          (action.payload as string) || "Failed to create record";
      })
      // Update record
      .addCase(updateBillingRecord.fulfilled, (state, action) => {
        const index = state.records.findIndex(
          (record) => record.id === action.payload.id
        );
        if (index !== -1) {
          state.records[index] = {
            ...action.payload,
            id: action.payload.id,
            productId: action.payload.productId.toString(),
            location: action.payload.location,
            premiumPaidAmount: Number(action.payload.premiumPaidAmount) / 100,
            email: action.payload.email || "",
            firstName: action.payload.firstName || "",
            lastName: action.payload.lastName || "",
            photo: action.payload.photo || "",
            createdAt: action.payload.createdAt,
            updatedAt: action.payload.updatedAt,
          };
        }
        state.updateError = null;
      })
      .addCase(updateBillingRecord.rejected, (state, action) => {
        state.updateError =
          (action.payload as string) || "Failed to update record";
      })
      // Delete record
      .addCase(deleteBillingRecord.fulfilled, (state, action) => {
        state.records = state.records.filter(
          (record) => record.id !== action.payload
        );
        state.deleteError = null;
      })
      .addCase(deleteBillingRecord.rejected, (state, action) => {
        state.deleteError =
          (action.payload as string) || "Failed to delete record";
      });
  },
});

export default billingSlice.reducer;
