import { User, Camera, Loader2 } from "lucide-react"; // Loader2 추가
import PhotoUploader from "../common/PhotoUploader";
import { uploadImageToS3 } from "../../api/review"; // 아까 만든 S3 업로드 함수
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProfileAvatar({ previewUrl, isEditing, onUpdate }) {
  const [isUploading, setIsUploading] = useState(false);

  //  프로필 사진 변경 핸들러
  const handleProfileChange = async (files) => {
    if (!files || files.length === 0) return;
    
    setIsUploading(true);
    const loadingToast = toast.loading("프로필 사진을 업로드 중...");

    try {
      // 1. S3에 사진 업로드
      const s3Url = await uploadImageToS3(files[0]);

      // 2. 부모(Mypage)에게 받은 S3 URL을 넘겨서 DB 업데이트 요청
      // (onUpdate는 부모에서 서버 API를 호출하는 함수입니다)
      if (onUpdate) {
        await onUpdate(s3Url); 
      }

      toast.success("프로필 사진이 변경되었습니다!", { id: loadingToast });
    } catch (error) {
      console.error("프로필 업로드 실패:", error);
      toast.error("사진 변경에 실패했습니다.", { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative group">
      <div
        className={`w-32 h-32 rounded-[2.8rem] overflow-hidden border-4 ${
          isEditing
            ? "border-blue-100 ring-4 ring-blue-50"
            : "border-white shadow-md"
        } transition-all duration-500 relative bg-white`}
      >
        { (previewUrl && previewUrl !== "") ? (
  <img
    key={previewUrl}
    src={previewUrl}
    alt="profile"
    className="w-full h-full object-cover"
    onLoad={() => console.log("이미지 로딩 성공:", previewUrl)} // 👈 성공 로그 추가
    onError={(e) => console.error("이미지 로딩 에러 발생:", previewUrl,e)}
  />
) : (
  <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
    <User size={40} strokeWidth={1.5} />
  </div>
)}
        
        {/* 업로드 중일 때 로딩 오버레이 */}
        {isUploading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center backdrop-blur-sm z-10">
            <Loader2 className="animate-spin text-blue-500" size={24} />
          </div>
        )}
      </div>

      {isEditing && !isUploading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-[2.8rem] backdrop-blur-[2px] animate-in fade-in">
          <PhotoUploader
            type="profile"
            previews={previewUrl ? [previewUrl] : []}
            onDrop={handleProfileChange} //  여기서 S3 업로드 로직 실행
          />
        </div>
      )}
    </div>
  );
}