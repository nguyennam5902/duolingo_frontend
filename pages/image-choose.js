import 'dotenv/config'
import { useContext, useEffect, useState } from 'react'
import { toast } from "react-toastify"
import { Context } from '../context'
import { SyncOutlined } from '@ant-design/icons'
import axios from 'axios'

const ImageUpload = () => {
  const { state: { user } } = useContext(Context)
  const [loading, setLoading] = useState(false)
  const [pageState, setPageState] = useState({
    imageURL: process.env.NEXT_PUBLIC_DEFAULT_PROFILE_URL,
    selectedImage: null,
    loading: false,
  })
  const [file, setFile] = useState(null)

  const loadUserData = async () => {
    setPageState({
      imageURL: `/api/image/${user.data._id}`,
      loading: pageState.loading,
    })
  }

  useEffect(() => {
    setLoading(true)
    if (user) {
      loadUserData()
      setLoading(false)
    }
  }, [user])

  const isImage = (file) => {
    const imageTypes = ['image/jpeg', 'image/png', 'image/gif']
    return file && imageTypes.includes(file.type)
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile && isImage(selectedFile)) {
      const maxSizeBytes = 5 * 1024 * 1024 // 5 MB in bytes
      if (selectedFile.size <= maxSizeBytes) {
        const img = document.getElementById('new_image')
        const url = URL.createObjectURL(selectedFile)
        img.src = url
        setFile(selectedFile)

        // Revoke the object URL after handling the file
        // URL.revokeObjectURL(url)
      } else {
        setFile(null)
        toast.error('File size exceeds the maximum allowed limit.')
      }
    } else {
      setFile(null)
      toast.error('Invalid file type. Please choose an image.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (file) {
      const formData = new FormData()
      formData.append('image', file)
      formData.append('userID', user.data._id)

      try {
        const response = (await axios.post('/api/upload', formData)).data

        if (response.meta.code == 200) {
          toast.success('Image uploaded successfully')
        } else {
          toast.error('Failed to upload image')
          console.log(response.meta);
        }
      } catch (error) {
        toast.error('Failed to upload image')
        console.error('Error uploading image:', error)
      }
    } else {
      toast.error('No file selected. Please choose an image.')
    }
  }

  return <>
    {loading && <SyncOutlined spin className="d-flex justify-content-center display-1 text-danger p-5" />}
    <div>
      <div style={{ marginLeft: '10%', display: 'flex' }}>
        <div style={{ width: '40%', textAlign: 'center', height: '100%', fontSize: '18px' }}>
          <div style={{ fontSize: '24px' }}>Old Image</div><br />
          <img style={{ border: '1px solid black' }} height={'100%'} width={'100%'} src={pageState.imageURL}></img>
        </div>
        <div style={{ width: '40%', height: '100%', textAlign: 'center', margin: 'auto', fontSize: '18px', float: 'right' }}>
          <div style={{ fontSize: '24px' }}>New Image</div><br />
          <img style={{ border: '1px solid black' }} id='new_image' height={'100%'} width={'100%'} src={pageState.imageURL} /><br /><br />
          <form onSubmit={handleSubmit}>
            <input type="file" accept="image/*" onChange={(event) => handleFileChange(event)} />
            <button type="submit">Save</button>
          </form>
        </div>
      </div>
    </div>
  </>
}

export default ImageUpload