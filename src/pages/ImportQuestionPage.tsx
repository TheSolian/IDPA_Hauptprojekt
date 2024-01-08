import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'

type ImportQuestionPageProps = {}

type FileWithPreview = File & {
  preview: (obj: Blob | MediaSource) => string
}

const ImportQuestionPage: React.FC<ImportQuestionPageProps> = ({}) => {
  return (
    <div>
      <form></form>
    </div>
  )
}

export default ImportQuestionPage
