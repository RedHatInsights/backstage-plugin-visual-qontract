 // This is essentially taken whole cloth from the Material UI documentation

import React from "react"

  // Seems like they should ship this as a component
  export const TabPanel = (props:any) => {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <React.Fragment>{children}</React.Fragment>}
      </div>
    );
  }