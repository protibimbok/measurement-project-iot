export const getLatest = (db) => {
  return new Promise((resolve) => {
    db.all(
      "SELECT name, MAX(timestamp) AS timestamp, value FROM sensor_entries GROUP BY name",
      (err, rows) => {
        if (err) {
          console.log("Latest:", err.message);
          resolve({});
        } else {
          const data = {};
          rows.forEach((row) => {
            data[row.name] = parseFloat(row.value).toFixed(2);
          });
          resolve(data);
        }
      }
    );
  });
};

export const getPage = (db, name, lastID) => {
  return new Promise((resolve) => {
    if (!name) {
      resolve([]);
      return;
    }
    const query =
      "SELECT * FROM sensor_entries WHERE name = ? AND id > ? ORDER BY id DESC LIMIT 120";
    db.all(query, [name, lastID], (err, rows) => {
      if (err) {
        console.log("Name:", err.message);
        resolve([]);
      } else {
        resolve(rows);
      }
    });
  });
};

export const asyncSql = (db, sql, binds = []) => {
  return new Promise((resolve) => {
    db.run(sql, binds, function (err, rows) {
      resolve([err, rows, this]);
    });
  });
};
