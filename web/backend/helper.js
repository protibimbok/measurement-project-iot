export const getPage = (db, page, lastID) => {
  return new Promise((resolve) => {
    let query = "";
    const binds = [];
    if (lastID) {
      query =
        "SELECT * FROM sensor_entries WHERE id < ? ORDER BY id DESC LIMIT 60 OFFSET ?";
      binds.push(lastID, (page - 1) * 60);
    } else {
      query = "SELECT * FROM sensor_entries ORDER BY id DESC LIMIT 60 OFFSET ?";
      binds.push((page - 1) * 60);
    }
    db.all(query, binds, (err, rows) => {
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
