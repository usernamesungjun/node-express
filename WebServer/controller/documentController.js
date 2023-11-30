const documentModel = require("../models/documentModel")
const projectModel = require("../models/projectModel")
const userModel = require('../models/userModel.js')
const { v4: uuidv4 } = require('uuid');

exports.createDocument = async (req, res) => {
  const { projectId, documentName } = req.body;
  console.log("문서 생성요청", req.body);

  try {
    const isProjectExist = await projectModel.isProjectExist(projectId);
    if (!isProjectExist){
      return res.status(400).json({ message: "projectId is not found" });
    }

    const yorkieName = uuidv4();

    const documentId = await documentModel.createDocument(projectId,documentName,yorkieName);
    
    res.status(201).json({success: true,documentId: documentId, message: "Document created successfully.",});
  } catch (error) {
    console.error("Error creating document:", error);
    res.status(500).send("Error creating document");
  }
};

exports.writeDocument = async (req, res) => {
  const { documentId } = req.query

  try {
    const documentName = await documentModel.findByDocumentId(documentId)

    res.status(200).json(documentName);
  } catch (error) {
    console.error("Error writing document:", error);
    res.status(500).send("Error writing document");
  }
}

exports.deleteDocument = async (req,res) => {
  const { documentId } = req.params
  try {
    await documentModel.deleteDocument(documentId)
    
    res.status(200).json({message : 'Delete documnet Success'})
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).send("Error deleting document");
  }
}