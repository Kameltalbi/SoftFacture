import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { companyAPI, authAPI, taxAPI, invoiceSettingsAPI, currencyAPI } from "../../../services/api";

const initialState = {
  company: null,
  taxes: [],
  currencies: [],
  invoiceNumbering: {
    prefix: "INV-",
    suffix: "",
    numberOfDigits: 4,
    nextNumber: 1,
    resetPeriod: "annual", // or "monthly"
  },
  isLoading: false,
  error: null,
};

// Async thunks for company operations
export const fetchCompanyInfo = createAsyncThunk(
  "settings/fetchCompanyInfo",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get user data from Redux state
      const { user } = getState().auth;
      console.log('User data from Redux state:', user);
      
      if (!user) {
        console.error('No user data in Redux state');
        return rejectWithValue('No user data available');
      }

      // Get company ID from user data
      const companyId = user.company_id || user.company?.id;
      console.log('Company ID from user data:', companyId);
      
      if (!companyId) {
        console.error('Company ID not found in user data:', user);
        return rejectWithValue('No company ID found in user data');
      }

      // Fetch company details using the company_id
      console.log('Fetching company data for ID:', companyId);
      const companyResponse = await companyAPI.get(companyId);
      console.log('Raw company response:', companyResponse);
      
      // Extract company data from response
      const companyData = companyResponse.data.data || companyResponse.data;
      console.log('Processed company data:', companyData);

      // Map the API response to our form fields
      const mappedCompanyData = {
        name: companyData.name || companyData.company_name,
        vatNumber: companyData.vat_number || companyData.vatNumber,
        email: companyData.email,
        phone: companyData.phone,
        address: companyData.address,
      };
      
      console.log('Mapped company data for form:', mappedCompanyData);
      return mappedCompanyData;
    } catch (error) {
      console.error('Error fetching company info:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch company info');
    }
  }
);

export const updateCompanyInfo = createAsyncThunk(
  "settings/updateCompanyInfo",
  async (companyData, { getState, rejectWithValue }) => {
    try {
      // Get user data from Redux state
      const { user } = getState().auth;
      
      if (!user) {
        return rejectWithValue('No user data available');
      }

      // Get company ID from user data
      const companyId = user.company_id || user.company?.id;
      
      if (!companyId) {
        return rejectWithValue('No company ID found in user data');
      }

      // Map form data to API format
      const apiCompanyData = {
        company_id: companyId,
        name: companyData.name,
        vat_number: companyData.vatNumber,
        email: companyData.email,
        phone: companyData.phone,
        address: companyData.address,
      };

      // Update company using the company_id
      const response = await companyAPI.update(apiCompanyData);
      console.log('Update response:', response);
      
      // Map the response back to form format
      const updatedCompanyData = {
        name: response.data.data.name || response.data.data.company_name,
        vatNumber: response.data.data.vat_number || response.data.data.vatNumber,
        email: response.data.data.email,
        phone: response.data.data.phone,
        address: response.data.data.address,
      };
      
      return updatedCompanyData;
    } catch (error) {
      console.error('Error updating company info:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to update company info');
    }
  }
);

// Tax operations
export const fetchTaxes = createAsyncThunk(
  "settings/fetchTaxes",
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching taxes...');
      const response = await taxAPI.getAll();
      console.log('Taxes response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching taxes:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch taxes');
    }
  }
);

export const createTax = createAsyncThunk(
  "settings/createTax",
  async (taxData, { getState, rejectWithValue }) => {
    try {
      // Get user data from Redux state to get company_id
      const { user } = getState().auth;
      if (!user) {
        return rejectWithValue('No user data available');
      }

      const companyId = user.company_id || user.company?.id;
      if (!companyId) {
        return rejectWithValue('No company ID found in user data');
      }

      console.log('Creating tax with data:', taxData);
      // Map form data to API format
      const apiTaxData = {
        company_id: companyId,
        name: taxData.name,
        taux: parseFloat(taxData.value),
        type: taxData.type ? 'Pourcentage (%)' : 'Valeur fixe (€)'
      };
      
      console.log('Mapped tax data for API:', apiTaxData);
      const response = await taxAPI.create(apiTaxData);
      console.log('Create tax response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error creating tax:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(', '));
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to create tax');
    }
  }
);

export const updateTax = createAsyncThunk(
  "settings/updateTax",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      // Get user data from Redux state to get company_id
      const { user } = getState().auth;
      if (!user) {
        return rejectWithValue('No user data available');
      }

      const companyId = user.company_id || user.company?.id;
      if (!companyId) {
        return rejectWithValue('No company ID found in user data');
      }

      console.log('Updating tax:', { id, data });
      // Map form data to API format
      const apiTaxData = {
        company_id: companyId,
        name: data.name,
        taux: parseFloat(data.value),
        type: data.type ? 'Pourcentage (%)' : 'Valeur fixe (€)'
      };
      
      console.log('Mapped tax data for API:', apiTaxData);
      const response = await taxAPI.update(id, apiTaxData);
      console.log('Update tax response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating tax:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(', '));
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to update tax');
    }
  }
);

export const deleteTax = createAsyncThunk(
  "settings/deleteTax",
  async (id, { rejectWithValue }) => {
    try {
      console.log('Deleting tax:', id);
      await taxAPI.delete(id);
      return id;
    } catch (error) {
      console.error('Error deleting tax:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete tax');
    }
  }
);

// Invoice Numbering operations
export const fetchInvoiceNumbering = createAsyncThunk(
  "settings/fetchInvoiceNumbering",
  async (_, { getState, rejectWithValue }) => {
    try {
      // Get user data from Redux state to get company_id
      const { user } = getState().auth;
      if (!user) {
        return rejectWithValue('No user data available');
      }

      const companyId = user.company_id || user.company?.id;
      if (!companyId) {
        return rejectWithValue('No company ID found in user data');
      }

      console.log('Fetching invoice numbering settings for company:', companyId);
      const response = await invoiceSettingsAPI.get();
      console.log('Invoice numbering response:', response.data);
      
      // Map the response to our format
      const mappedData = {
        prefix: response.data.data.prefix,
        suffix: response.data.data.suffix,
        numberOfDigits: response.data.data.padding_digits,
        nextNumber: response.data.data.last_number + 1,
        resetPeriod: response.data.data.reset_period,
      };
      
      return mappedData;
    } catch (error) {
      console.error('Error fetching invoice numbering:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch invoice numbering settings');
    }
  }
);

export const updateInvoiceNumbering = createAsyncThunk(
  "settings/updateInvoiceNumbering",
  async (numberingData, { getState, rejectWithValue }) => {
    try {
      // Get user data from Redux state to get company_id
      const { user } = getState().auth;
      if (!user) {
        return rejectWithValue('No user data available');
      }

      const companyId = user.company_id || user.company?.id;
      if (!companyId) {
        return rejectWithValue('No company ID found in user data');
      }

      console.log('Updating invoice numbering with form data:', numberingData);
      // Map form data to API format
      const apiNumberingData = {
        company_id: companyId,
        prefix: numberingData.prefix,
        suffix: numberingData.suffix,
        padding_digits: parseInt(numberingData.numberOfDigits, 10),
        last_number: parseInt(numberingData.nextNumber, 10) - 1, // Convert to last number
        reset_period: numberingData.resetPeriod,
      };
      
      console.log('Mapped invoice numbering data for API:', apiNumberingData);
      const response = await invoiceSettingsAPI.update(apiNumberingData);
      console.log('Update invoice numbering response:', response.data);
      
      // Map the response back to our format
      const mappedResponse = {
        prefix: response.data.data.prefix,
        suffix: response.data.data.suffix,
        numberOfDigits: response.data.data.padding_digits,
        nextNumber: response.data.data.last_number + 1,
        resetPeriod: response.data.data.reset_period,
      };
      
      return mappedResponse;
    } catch (error) {
      console.error('Error updating invoice numbering:', error);
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(', '));
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to update invoice numbering settings');
    }
  }
);

// Currency operations
export const fetchCurrencies = createAsyncThunk(
  "settings/fetchCurrencies",
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching currencies...');
      const response = await currencyAPI.getAll();
      console.log('Currencies response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch currencies');
    }
  }
);

export const createCurrency = createAsyncThunk(
  "settings/createCurrency",
  async (currencyData, { getState, rejectWithValue }) => {
    try {
      // Get user data from Redux state to get company_id
      const { user } = getState().auth;
      if (!user) {
        return rejectWithValue('No user data available');
      }

      const companyId = user.company_id || user.company?.id;
      if (!companyId) {
        return rejectWithValue('No company ID found in user data');
      }

      console.log('Creating currency with data:', currencyData);
      const apiCurrencyData = {
        ...currencyData,
        company_id: companyId,
      };
      
      console.log('Mapped currency data for API:', apiCurrencyData);
      const response = await currencyAPI.create(apiCurrencyData);
      console.log('Create currency response:', response.data);
      
      return response.data.data;
    } catch (error) {
      console.error('Error creating currency:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(', '));
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to create currency');
    }
  }
);

export const updateCurrency = createAsyncThunk(
  "settings/updateCurrency",
  async ({ id, currencyData }, { rejectWithValue }) => {
    try {
      console.log('Updating currency:', id, currencyData);
      const response = await currencyAPI.update(id, currencyData);
      console.log('Update currency response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error updating currency:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat();
        return rejectWithValue(errorMessages.join(', '));
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to update currency');
    }
  }
);

export const deleteCurrency = createAsyncThunk(
  "settings/deleteCurrency",
  async (id, { rejectWithValue }) => {
    try {
      console.log('Deleting currency:', id);
      await currencyAPI.delete(id);
      return id;
    } catch (error) {
      console.error('Error deleting currency:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to delete currency');
    }
  }
);

export const setDefaultCurrency = createAsyncThunk(
  "settings/setDefaultCurrency",
  async (id, { rejectWithValue }) => {
    try {
      console.log('Setting default currency:', id);
      const response = await currencyAPI.setDefault(id);
      console.log('Set default currency response:', response.data);
      return response.data.data;
    } catch (error) {
      console.error('Error setting default currency:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to set default currency');
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    // Company
    setCompanyInfo: (state, action) => {
      const { name, vatNumber, email, phone, address } = action.payload;
      state.company = { name, vatNumber, email, phone, address };
    },

    // Taxes
    setTaxes(state, action) {
      state.taxes = action.payload;
    },
    addTaxLocal(state, action) {
      state.taxes.push(action.payload);
    },
    updateTaxLocal(state, action) {
      const index = state.taxes.findIndex(
        (tax) => tax.key === action.payload.key
      );
      if (index !== -1) {
        state.taxes[index] = action.payload;
      }
    },
    deleteTaxLocal(state, action) {
      state.taxes = state.taxes.filter((tax) => tax.key !== action.payload);
    },

    // Currencies
    setCurrencies(state, action) {
      state.currencies = action.payload;
    },
    addCurrencyLocal(state, action) {
      state.currencies.push(action.payload);
    },
    updateCurrencyLocal(state, action) {
      const index = state.currencies.findIndex(
        (currency) => currency.key === action.payload.key
      );
      if (index !== -1) {
        state.currencies[index] = action.payload;
      }
    },
    deleteCurrencyLocal(state, action) {
      state.currencies = state.currencies.filter(
        (currency) => currency.key !== action.payload
      );
    },

    // Invoice Numbering
    setInvoiceNumberingLocal: (state, action) => {
      state.invoiceNumbering = action.payload;
    },

    // Loading/Error
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Company Info
      .addCase(fetchCompanyInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCompanyInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
        state.error = null;
      })
      .addCase(fetchCompanyInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Company Info
      .addCase(updateCompanyInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCompanyInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.company = action.payload;
        state.error = null;
      })
      .addCase(updateCompanyInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Tax operations
      .addCase(fetchTaxes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTaxes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taxes = action.payload;
        state.error = null;
      })
      .addCase(fetchTaxes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTax.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taxes.push(action.payload);
        state.error = null;
      })
      .addCase(createTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateTax.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.taxes.findIndex(tax => tax.id === action.payload.id);
        if (index !== -1) {
          state.taxes[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteTax.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteTax.fulfilled, (state, action) => {
        state.isLoading = false;
        state.taxes = state.taxes.filter(tax => tax.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTax.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Invoice Numbering operations
      .addCase(fetchInvoiceNumbering.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceNumbering.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoiceNumbering = {
          prefix: action.payload.prefix || '',
          suffix: action.payload.suffix || '',
          numberOfDigits: action.payload.number_of_digits || 4,
          nextNumber: action.payload.next_number || 1,
          resetPeriod: action.payload.reset_period || 'annually',
        };
        state.error = null;
      })
      .addCase(fetchInvoiceNumbering.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateInvoiceNumbering.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateInvoiceNumbering.fulfilled, (state, action) => {
        state.isLoading = false;
        state.invoiceNumbering = {
          prefix: action.payload.prefix || '',
          suffix: action.payload.suffix || '',
          numberOfDigits: action.payload.number_of_digits || 4,
          nextNumber: action.payload.next_number || 1,
          resetPeriod: action.payload.reset_period || 'annually',
        };
        state.error = null;
      })
      .addCase(updateInvoiceNumbering.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Currency operations
      .addCase(fetchCurrencies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrencies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currencies = action.payload;
        state.error = null;
      })
      .addCase(fetchCurrencies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createCurrency.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currencies.push(action.payload);
        state.error = null;
      })
      .addCase(createCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateCurrency.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.currencies.findIndex(currency => currency.id === action.payload.id);
        if (index !== -1) {
          state.currencies[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteCurrency.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currencies = state.currencies.filter(currency => currency.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(setDefaultCurrency.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(setDefaultCurrency.fulfilled, (state, action) => {
        state.isLoading = false;
        // Update all currencies to set the new default
        state.currencies = state.currencies.map(currency => ({
          ...currency,
          default: currency.id === action.payload.id
        }));
        state.error = null;
      })
      .addCase(setDefaultCurrency.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setCompanyInfo,
  setTaxes,
  addTaxLocal,
  updateTaxLocal,
  deleteTaxLocal,
  setCurrencies,
  addCurrencyLocal,
  updateCurrencyLocal,
  deleteCurrencyLocal,
  setInvoiceNumberingLocal,
  setLoading,
  setError,
  clearError,
} = settingsSlice.actions;

export const selectCompanyInfo = (state) => state.settings.company;
export const selectTaxes = (state) => state.settings.taxes;
export const selectCurrencies = (state) => state.settings.currencies;
export const selectInvoiceNumbering = (state) => state.settings.invoiceNumbering;
export const selectLoading = (state) => state.settings.isLoading;
export const selectError = (state) => state.settings.error;

export default settingsSlice.reducer;
