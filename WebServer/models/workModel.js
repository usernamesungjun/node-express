const db = require('../db.js');

exports.creatWork = async (projectId ,workTitle, workState) => {
  const result = await db.query('INSERT INTO work (projectId ,workTitle, workState) VALUES(?,?,?)', [projectId ,workTitle, workState])
  return result.insertId
}

exports.findByProjectId = async (projectId) => {
  const work = await db.query('SELECT * FROM work WHERE projectId = ?',[projectId])
  return work;
}

exports.findWorkIdByProjectId = async (projectId) => {
  const work = await db.query('SELECT workId,workTitle FROM work WHERE projectId = ?',[projectId])
  return work;
}

exports.findTitleByWorkId = async (workId) => {
  const work = await db.query('SELECT workTitle FROM work WHERE workId = ?',[workId])
  return work;
}

exports.updateWork = async(projectId,workId,newData) =>{
  const updates = [];
  const values = [];

  // Constructing the dynamic query
  Object.keys(newData).forEach(key => {
    if (newData[key] != null) {
      updates.push(`${key} = ?`);
      values.push(newData[key]);
    }
  });

  if (updates.length === 0) {
    throw new Error('No updates provided');
  }

  const query = `UPDATE work SET ${updates.join(', ')} WHERE projectId = ? AND workId = ?`;
  values.push(projectId);
  values.push(workId)

  try {
    const result = await db.query(query, values);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in updateWork:', error);
    throw error;
  }
}

//작업 삭제
exports.deleteWorkByWorkId = async (workId) => {
  const query = 'DELETE FROM work WHERE workId = ?';
  try {
    const result = await db.query(query, [workId]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in deleteWork:', error);
    throw error;
  }
}

//프로젝트 삭제 작업삭제
exports.deleteWorkByProjectId = async (projectId) => {
  const query = 'DELETE FROM work WHERE projectId = ?';
  try {
    const result = await db.query(query, [projectId]);
    return result.affectedRows;
  } catch (error) {
    console.error('Error in deleteWork:', error);
    throw error;
  }
}

