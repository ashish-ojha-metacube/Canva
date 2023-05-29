import { DataTable, getDataProvider } from "@canva/data-provider";
import { tokens } from "styles/tokens";
import React from "react";
import styles from "styles/components.css";

const properties = {
  sydney: {
    name: "Sydney",
    columns: [
      {
        type: "string",
        name: "address",
        values: ["110 Kippax Street", "105 Kippax Street", "5 Lacey Street"],
      },
      { type: "number", name: "price", values: [3000000, 1000000, 2000000] },
      {
        type: "date",
        name: "soldAt",
        values: [new Date(), new Date(), undefined],
      },
    ],
  },
  brisbane: {
    name: "Brisbane",
    columns: [
      {
        type: "string",
        name: "address",
        values: ["110 Kippax Street", "105 Kippax Street", "5 Lacey Street"],
      },
      { type: "number", name: "price", values: [3000000, 1000000, 2000000] },
      {
        type: "date",
        name: "soldAt",
        values: [new Date(), new Date(), undefined],
      },
    ],
  },
  melbourne: {
    name: "Melbourne",
    columns: [
      {
        type: "string",
        name: "address",
        values: ["110 Kippax Street", "105 Kippax Street", "5 Lacey Street"],
      },
      { type: "number", name: "price", values: [3000000, 1000000, 2000000] },
      {
        type: "date",
        name: "soldAt",
        values: [new Date(), new Date(), undefined],
      },
    ],
  },
};

type State = {
  selectDataTable?: (dataTable: DataTable) => void;
};

// An app that exposes multiple data tables, allows users to select a data table, and returns the selected data table to a consumer (e.g. Bulk Create)
export const App = () => {
  const dataProvider = getDataProvider();
  const [state, setState] = React.useState<State>({});

  React.useEffect(() => {
    // This callback runs when Bulk Create wants to receive data
    dataProvider.onSelectDataTable(async (opts) => {
      setState((prevState) => {
        return {
          ...prevState,
          ...opts,
        };
      });
    });
  }, [dataProvider]);

  if (!state.selectDataTable) {
    return (
      <div>
        <div className={styles.header}>To use the data this app provides:</div>
        <ul>
          <li className={styles.listItem}>
            Go to "Bulk Create" via the "More" tab.
          </li>
          <li className={styles.listItem}>Select "more data sources".</li>
          <li className={styles.listItem}>Select this app.</li>
          <li className={styles.listItem}>
            Select which city's data you'd like to consume.
          </li>
        </ul>
      </div>
    );
  }

  // Displaying a UI, allowing users to select from a range of data tables
  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Choose a location</div>
      <div>
        {Object.entries(properties).map(([key, value]) => {
          return (
            <div key={key} style={{ paddingTop: tokens.gridBaseline }}>
              <button
                className={styles.button}
                onClick={() => {
                  if (!state?.selectDataTable) {
                    return;
                  }

                  const dataTable = properties[key];

                  state.selectDataTable(dataTable);
                }}
              >
                {value.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
