import { METHODS } from "@/_helpers/types/types"
import { useHttpMutation } from "./useHttp"

export const useImageUpload = () => {
  const [uploadImage, error, loading, uploadedData] = useHttpMutation<any, FormData>()

  const handleImageSubmit = async (image: File, id: string) => {
    const formData = new FormData()
    formData.append("userId", id)
    formData.append("image", image)

    await uploadImage("/api/upload", METHODS.POST, formData)
  }

  return [handleImageSubmit, loading, error, uploadedData]
}
