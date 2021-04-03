import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Table } from "./stories/Table";

function App() {
  const [tableType, setType] = useState("holdings");
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [error, setError] = useState("");

  const formatAmount = ({ value }) => {
    if (value == null) {
      return "";
    } else {
      const svalue = JSON.stringify(value) || "";
      return (
        svalue.split(".")[0].replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,") +
        (svalue.split(".")[1]
          ? "." +
            svalue.split(".")[1].slice(0, 2 || svalue.split(".")[1].length)
          : "")
      );
    }
  };
  const formatFloat = ({ value }) => {
    if (value == null) {
      return "";
    } else {
      const svalue = JSON.stringify(value) || "";
      return (
        svalue.split(".")[0] +
        (svalue.split(".")[1]
          ? "." +
            svalue.split(".")[1].slice(0, 2 || svalue.split(".")[1].length)
          : "")
      );
    }
  };
  const formatDate = ({ value }) => {
    if (value == null) {
      return "";
    } else {
      return value.replaceAll("-", "/");
    }
  };
  const sortAmount = (row1, row2, accessor, desc) => {
    if (!row1.values[accessor] || !row2.values[accessor]) {
      return !row1.values[accessor] ? -1 : 1;
    } else {
      return row1.values[accessor] > row2.values[accessor] ? 1 : -1;
    }
  };
  const sortDate = (row1, row2, accessor, desc) =>
    row1.values[accessor] > row2.values[accessor] ? 1 : -1;
  const getData = async (url, setData) => {
    await fetch(url)
      .then(async (res) => {
        await res.json().then((r) => {
          if (r.payload || r.transactions) {
            setData(tableType === "holdings" ? r.payload : r.transactions);
          }
        });
      })
      .catch((e) => {
        console.log(e);
        setError("Failed to get contents. ");
      });
  };

  const columns1 = useMemo(
    () => [
      { Header: "Name of the holding", accessor: "name" },
      { Header: "Ticker", accessor: "ticker" },
      { Header: "Asset Class", accessor: "asset_class" },
      {
        Header: "Average price",
        accessor: "avg_price",
        Cell: formatAmount,
        sortType: sortAmount,
      },
      {
        Header: "Market Price",
        accessor: "market_price",
        Cell: formatAmount,
        sortType: sortAmount,
      },
      {
        Header: "Latest change percentage",
        accessor: "latest_chg_pct",
        Cell: formatFloat,
        sortType: sortAmount,
      },
      {
        Header: "Market Value in Base CCY",
        accessor: "market_value_ccy",
        Cell: formatFloat,
        sortType: sortAmount,
      },
    ],
    []
  );
  const columns2 = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Ticket Ref", accessor: "ticketref" },
      { Header: "Trade Date", accessor: "traded_on", Cell: formatDate },
      {
        Header: "QTY",
        accessor: "quantity",
        Cell: formatAmount,
        sortType: sortAmount,
      },
      { Header: "CCY", accessor: "currency" },
      {
        Header: "Settlement Amount",
        accessor: "settlement_amount",
        Cell: formatAmount,
        sortType: sortAmount,
      },
    ],
    []
  );

  useEffect(() => {
    if (tableType === "holdings" && data1 && data1.length === 0) {
      getData(`https://canopy-frontend-task.now.sh/api/holdings`, setData1);
    }
    if (tableType === "transactions" && data2 && data2.length === 0) {
      getData(`https://canopy-frontend-task.now.sh/api/transactions`, setData2);
    }
  }, [tableType]);

  return (
    <div className="App">
      <div className="tableContainer">
        <h4>
          Change View:{" "}
          <button
            onClick={() =>
              setType(tableType === "holdings" ? "transactions" : "holdings")
            }
          >
            {error !== ""
              ? error + "Click to retry"
              : tableType === "holdings"
              ? "View Transactions"
              : "View Holdings"}
          </button>
        </h4>
        {(data1 && data1.length > 0) || (data2 && data2.length > 0) ? (
          <Table
            data={
              tableType === "holdings"
                ? {
                    columns: [...columns1.map((item) => item.accessor)],
                    payload: data1,
                  }
                : {
                    columns: [...columns2.map((item) => item.accessor)],
                    payload: data2,
                  }
            }
            columns={tableType === "holdings" ? columns1 : columns2}
          />
        ) : (
          "Loading Table"
        )}
      </div>
    </div>
  );
}

export default App;
