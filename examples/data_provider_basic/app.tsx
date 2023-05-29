import {
  DataTable,
  DataTableColumn,
  getDataProvider,
} from "@canva/data-provider";
import styles from "styles/components.css";
import React from "react";
import { tokens } from "styles/tokens";

const pokemonDataTable: DataTable = {
  name: "Pokemon",
  columns: [
    {
      type: "string",
      name: "Name",
      values: ["Pikachu", "Squirtle", "Bulbasaur", "Charmander"],
    },
    {
      type: "string",
      name: "Type",
      values: ["Electric", "Water", "Grass", "Fire"],
    },
    { type: "number", name: "Level", values: [42, 29, 32, 9] },
    { type: "boolean", name: "isCaptured", values: [true, true, false, true] },
  ],
};

// The number of rows is the length of the longest column
const numRows = pokemonDataTable.columns.sort(
  (a, b) => b.values.length - a.values.length
)[0].values.length;

// An app that uses the Data Provider capability to return a single data table to a consumer (e.g. Bulk Create)
export const App = () => {
  const dataProvider = getDataProvider();

  React.useEffect(() => {
    // This callback runs when Bulk Create wants to receive data
    dataProvider.onSelectDataTable(async (opts) => {
      // This callback returns the single data table to Bulk Create
      opts.selectDataTable(pokemonDataTable);
    });
  }, [dataProvider]);

  return (
    <div className={styles.scrollContainer}>
      <div className={styles.header}>Drag and Drop</div>

      <p className={styles.paragaph}>
        Here's a preview of the data this app provides. To use this data:
      </p>
      <br />
      <ul>
        <li className={styles.listItem}>
          Go to "Bulk Create" via the "More" tab.
        </li>
        <li className={styles.listItem}>Select "more data sources".</li>
        <li className={styles.listItem}>Select this app.</li>
      </ul>
      <br />
      <div className={styles.header}>Pokemon Data table</div>
      <table>
        <tr>
          {pokemonDataTable.columns.map(({ name }) => (
            <th style={{ textAlign: "left", padding: tokens.gridBaseline }}>
              {formatColumnName(name)}
            </th>
          ))}
        </tr>
        <tbody>
          {[...Array(numRows).keys()].map((r) => (
            <tr>
              {pokemonDataTable.columns.map((column) => (
                <td
                  style={{
                    padding: tokens.gridBaseline,
                    textAlign: column.type === "boolean" ? "center" : "start",
                  }}
                >
                  {formatColumn(column)[r]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

function formatColumnName(name: string) {
  switch (name) {
    case "Name":
      return name;
    case "Type":
      return name;
    case "isCaptured":
      return "Captured?";
    case "Level":
      return name;
    default:
      return name;
  }
}

function formatColumn(column: DataTableColumn) {
  switch (column.type) {
    case "boolean":
      return column.values.map((v) => (v ? "Y" : "N"));
    case "date":
      return column.values.map((v) => (v ? v.toDateString() : ""));
    case "number":
      return column.values.map((v) => (v ? v.toString() : ""));
    case "string":
      return column.values.map((v) => (v ? v : ""));
  }
}
