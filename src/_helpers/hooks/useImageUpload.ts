import { useHttpMutation } from "./useHttp"
import { METHODS } from "../lib/types"

const useImageUpload = () => {
  const onSuccess = (data: any) => {
    console.log("Upload successful:", data)
  }

  const [uploadImage, error, loading, uploadedData] = useHttpMutation<any, FormData>(onSuccess)

  const handleImageSubmit = (image: File, id: string) => {
    const formData = new FormData()
    formData.append("userId", id)
    formData.append("image", image)

    uploadImage("/api/upload", METHODS.POST, formData)
  }

  return [handleImageSubmit, loading, error, uploadedData]
}

export default useImageUpload
