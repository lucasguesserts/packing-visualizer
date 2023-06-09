class OutputConversionError extends Error {
  constructor (sourceVersion, targetVersion) {
    super(`Error: conversion from ${sourceVersion} to ${targetVersion} is not supported`)
    this.sourceVersion = sourceVersion
    this.targetVersion = targetVersion
  }
}

export default OutputConversionError
