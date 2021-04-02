import { useEffect, useMemo, useState } from "react";
import "./App.css";
import { Table } from "./stories/Table";

function App() {
  const [tableType, setType] = useState("holdings");
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [error, setError] = useState("");

  const columns1 = useMemo(
    () => [
      { Header: "Name of the holding", accessor: "name" },
      { Header: "Ticker", accessor: "ticker" },
      { Header: "Asset Class", accessor: "asset_class" },
      { Header: "Average price", accessor: "avg_price" },
      { Header: "Market Price", accessor: "market_price" },
      { Header: "Latest change percentage", accessor: "latest_chg_pct" },
      { Header: "Market Value in Base CCY", accessor: "market_value_ccy" },
    ],
    []
  );
  const columns2 = useMemo(
    () => [
      { Header: "Name", accessor: "name" },
      { Header: "Ticket Ref", accessor: "ticketref" },
      { Header: "Trade Date", accessor: "traded_on" },
      { Header: "QTY", accessor: "quantity" },
      { Header: "CCY", accessor: "currency" },
      { Header: "Settlement Amount", accessor: "settlement_amount" },
    ],
    []
  );

  const getData = async (url, setData) => {
    await fetch(url)
      .then(async (res) => {
        await res.json().then((r) => {
          if(r.payload || r.transactions){
            setData(tableType === "holdings" ? r.payload : r.transactions);
          }
        });
      })
      .catch((e) => {
        console.log(e);
        setError("Failed to get contents. ");
      });
  };

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
        {(data1 && data1.length > 0) || (data2 && data2.length > 0) ? (
          <Table
            data={tableType === "holdings" ? data1 : data2}
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
