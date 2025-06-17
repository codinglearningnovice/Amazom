import React from 'react'


   export const formatCurrency = (value) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "NGN",
      }).format(value);
    };

    
