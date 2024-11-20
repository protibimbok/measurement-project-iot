import { Fragment } from "react";
import { usePaginatedData } from "../utils/http";
import { SocketData } from "../utils/types";

const optionsDate = {
  day: "2-digit",
  month: "short",
  year: "numeric",
} as const;
const optionsTime = {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
} as const;

const TableData = () => {
  const [data, fetchNextPage, hasPage] = usePaginatedData();
  let lastDate = "";

  const fetchMore = () => {
    if (hasPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="p-6 pt-0">
      <div className="overflow-auto relative max-h-[calc(100vh-200px)]">
        <table className="table">
          {/* head */}
          <thead>
            <tr className="bg-white sticky top-0">
              <th></th>
              <th>Time</th>
              <th>Accelaration (X, Y, Z) m/s^2</th>
              <th>Gyro (X, Y, Z) rad/s^2</th>
              <th>Temperature (C)</th>
              <th>Gas (ppm)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((entry, index) => {
              if (!entry) {
                return (
                  <tr key={index}>
                    <th>
                      <div className="skeleton h-4 w-6"></div>
                    </th>
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                    <td>
                      <div className="skeleton h-4 w-20"></div>
                    </td>
                  </tr>
                );
              }
              const val: SocketData["value"] = JSON.parse(entry.value);
              const date = new Date(entry.timestamp);

              const formattedDate = date
                .toLocaleDateString("en-US", optionsDate)
                .replace(",", "");
              const formattedTime = date.toLocaleTimeString(
                "en-US",
                optionsTime
              );
              if (lastDate === formattedDate) {
                return (
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{formattedTime}</td>
                    <td>
                      {val.accelarationX}, {val.accelarationY},{" "}
                      {val.accelarationZ}
                    </td>
                    <td>
                      {val.gyroX}, {val.gyroY}, {val.gyroZ}
                    </td>
                    <td>{val.temperature}</td>
                    <td>{val.gas}</td>
                  </tr>
                );
              }
              lastDate = formattedDate;
              return (
                <Fragment key={index}>
                  <tr className="bg-white sticky top-10">
                    <th colSpan={5}>{formattedDate}</th>
                  </tr>
                  <tr key={index}>
                    <th>{index + 1}</th>
                    <td>{formattedTime}</td>
                    <td>
                      {val.accelarationX}, {val.accelarationY},{" "}
                      {val.accelarationZ}
                    </td>
                    <td>
                      {val.gyroX}, {val.gyroY}, {val.gyroZ}
                    </td>
                    <td>{val.temperature}</td>
                    <td>{val.gas}</td>
                  </tr>
                </Fragment>
              );
            })}
            {hasPage && (
              <tr>
                <td colSpan={5}>
                  <button
                    className="btn btn-primary w-full"
                    onClick={fetchMore}
                  >
                    Load more
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TableData;
