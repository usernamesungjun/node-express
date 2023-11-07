const db = require('../db.js');

exports.createProject = async (projectName, startDate, endDate, ownerId, personnel) => {
  try {
    const result = await db.query(
      'INSERT INTO project (projectName, startDate, endDate, ownerId, personnel) VALUES (?, ?, ?, ?, ?)',
      [projectName, startDate, endDate, ownerId, personnel]);
    return result.insertId; // Node.js의 mysql 라이브러리는 일반적으로 insertId를 사용하여 새로 생성된 ID를 반환합니다.
  } catch (error) {
    throw error; // 에러를 캐치하고, 호출 스택에 에러를 던집니다.
  }
};

exports.getProjectById = async (projectId) => {
  const sql = 'SELECT * FROM project WHERE projectId = ?';
  try {
    const result = await db.query(sql, [projectId]);
    console.log(result); // Log the raw result to see what you're getting back
    return result[0];
  } catch (error) {
    console.error('Error in getProjectById:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};

exports.findProjectNameById = async (projectId) => {
  const sql = 'SELECT projectName From project WHERE projectId = ?';
  try {
    const result = await db.query(sql, [projectId]);
    console.log(result); // Log the raw result to see what you're getting back
    return result[0];
  } catch (error) {
    console.error('Error in findProjectNameById:', error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
};