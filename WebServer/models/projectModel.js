const db = require('../db.js');

exports.createProject = async (projectName, startDate, endDate, ownerId, personnel) => {
  const result = await db.query('INSERT INTO project (projectName, startDate, endDate, ownerId, personnel) VALUES (?, ?, ?, ?, ?)', [projectName, startDate, endDate, ownerId, personnel]);
  // 새로 생성된 프로젝트의 ID를 반환합니다.
  return result.projectId;
};

exports.getProjectById = async (projectId) => {
  const sql = 'SELECT * FROM project WHERE projectId = ?';
  const result = await db.query(sql, [projectId]);
  return result[0];
};

// exports.updateProject = async (projectId, { name, startDate, endDate }) => {
//   const sql = 'UPDATE projects SET name = ?, start_date = ?, end_date = ? WHERE id = ?';
//   await db.query(sql, [name, startDate, endDate, projectId]);
// };

// exports.deleteProject = async (projectId) => {
//   const sql = 'DELETE FROM projects WHERE id = ?';
//   await db.query(sql, [projectId]);
// };
