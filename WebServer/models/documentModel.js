const db = require('../db.js');

exports.createDocument = async (projectId, documentName, yorkieName, registerDate) => {
  try {
    const result = await db.query('INSERT INTO document (projectId, documentName, yorkieName,registerDate) VALUES (?, ?, ?, ?)',
    [projectId, documentName, yorkieName, registerDate])
    return result.insertId
  } catch (error) {
    throw error
  }
}

exports.findByDocumentId = async (documentId) => {
  try {
    const sql = 'SELECT documentName,yorkieName FROM document WHERE documentId = ?';
    const result = await db.query(sql, [documentId]);
    return result[0];
  } catch (error) {
    throw error
  }
}

exports.deleteDocument = async (documentId) => {
  try {
    const sql = 'DELETE FROM document WHERE documentId = ?'
    const result = await db.query(query, [documentId]);
    return result.affectedRows;
  } catch (error) {
    throw error
  }
}

exports.findByProjectId = async (projectId) => {
  try {
    const sql = 'SELECT * FROM document WHERE projectId = ?';
    const result = await db.query(sql, [projectId]);
    return result
  } catch (error) {
    throw error
  }
}