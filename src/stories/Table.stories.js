import React from "react";
import { Table } from "./Table";

export default {
  title: "Table",
  component: Table,
};

const Template = (args) => <Table {...args} />;

export const Standard = Template.bind({});

Standard.args = {
  data: {
    payload: [
      { col1: "sample" },
      { col1: "sample" },
      { col1: "sample" },
      { col1: "sample" },
    ],
    columns: ["col1"],
  },
  columns: [{ Header: "Column1", accessor: "col1" }],
};
