const db = require('../db.js');

exports.createDocument = async (projectId, documentName, yorkieName) => {
  try {
    const result = await db.query('INSERT INTO document (projectId, documentName, yorkieName) VALUES (?, ?, ?)',
    [projectId, documentName, yorkieName])
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