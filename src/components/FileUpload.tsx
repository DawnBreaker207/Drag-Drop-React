import React, { useState } from 'react'
import { CloudArrowUpIcon } from '@heroicons/react/24/outline'
import classNames from 'classnames'
import instance from '../apis'
// import axios from 'axios'
const FileUpload = () => {
  const [fileList, setFileList] = useState<File[] | null>(null)
  const [shouldHighlight, setShouldHighlight] = useState(false)
  const [progress, setProgress] = useState(0)
  const preventDefaultHandler = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleUpload = async () => {
    // URT

    // const UPLOAD_URL = "http://localhost:8888/api/v1/images/upload";
    // const UPLOAD_URL = "http://localhost:8888/test";
    const data = new FormData();
    for (const file of fileList!) {
      data.append('images', file)
    }

    // await axios.post(UPLOAD_URL, data, {
    //   headers: { 'Content-Type': 'multipart/form-data' },
    //   onUploadProgress(e) {
    //     const progress = e.progress ?? 0;
    //     setProgress(progress * 100);
    //     if (progress * 100 >= 100) {
    //       setFileList(null)

    //     }
    //   }
    // }
    // )


    const send = await instance.post("/images/upload", data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress(e) {
        const progress = e.progress ?? 0;
        setProgress(progress * 100);
        if (progress * 100 >= 100) {
          setFileList(null)

        }
      }
    })
    if (send) {
      console.log(`Success`);
      console.log(send);
    }

  }
  const uploading = progress < 0 && progress < 100;
  return (
    <div className={classNames({
      "w-full h-96": true,
      "p-4 grid place-content-center cursor-pointer": true,
      "bg-violet-50 text-violet-500 rounded-lg hover:bg-violet-100": true,
      "border-4 border-dashed border-violet-100 hover:border-violet-500":
        true,
      "transition-colors": true,
      "border-violet-500 bg-violet-100": shouldHighlight,
      "border-violet-100 bg-violet-50": !shouldHighlight,
    })}
      onDragOver={(e) => {
        preventDefaultHandler(e)
        setShouldHighlight(true)
      }}
      onDragEnter={(e) => {
        preventDefaultHandler(e)
        setShouldHighlight(true)
      }}
      onDragLeave={(e) => {
        preventDefaultHandler(e)
        setShouldHighlight(false)
      }}
      onDrop={(e) => {
        preventDefaultHandler(e)
        const files = Array.from(e.dataTransfer.files)
        setFileList(files)
        setShouldHighlight(false)
      }}
    >
      <div className='flex flex-col items-center'>
        {!fileList ? (
          <>
            <CloudArrowUpIcon className='w-10 h-10' />
            <span>
              <span>Choose a File</span> or Drag it here
            </span>
          </>
        ) : (
          <>
            <p>Files to Upload</p>
            {fileList.map((file, i) => {
              return <span key={i}>{file.name}</span>
            })}
            <div className='flex gap-2 mt-2'>
              <button className={classNames({
                "bg-violet-500 text-violet-50 px-2 py-1 rounded-md": true,
                "pointer-events-none opacity-40 w-full": uploading,
              })} onClick={() => handleUpload()}>

                {uploading ? `Uploading... (${progress.toFixed(2)}%)` : "Upload"}

              </button>
              {!uploading && (
                <button className='border border-violet-500 px-2 py-1 rounded-md' onClick={() => { setFileList(null) }}>Clear</button>
              )}
            </div>
          </>
        )}
      </div>
    </div >
  )
}

export default FileUpload