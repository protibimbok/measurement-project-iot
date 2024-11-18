export const getPage = (db, name, lastID) => {
  return new Promise((resolve) => {
    if (!name) {
      resolve([]);
      return;
    }
    const query =
      "SELECT * FROM sensor_entries WHERE name = ? AND id > ? ORDER BY id DESC LIMIT 60";
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

export const asyncQuery = (db, sql, binds = []) => {
  return new Promise((resolve) => {
    db.all(sql, binds, function (err, rows) {
      resolve([err, rows]);
    });
  });
};
